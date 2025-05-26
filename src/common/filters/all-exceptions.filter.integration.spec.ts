import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import * as request from 'supertest';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ReceiptExtractorModule } from '../../receipt-extractor/receipt-extractor.module';
import { ReceiptExtractorService } from '../../receipt-extractor/receipt-extractor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedImage } from '../../entities/uploaded-image.entity';
import { ExtractedReceipt } from '../../entities/extracted-receipt.entity';
import { ExtractedItem } from '../../entities/extracted-item.entity';
import { ImageValidationPipe } from '../../pipes/image-validation.pipe';

describe('AllExceptionsFilter Integration Tests', () => {
  let app: INestApplication;
  let receiptExtractorService: ReceiptExtractorService;

  beforeEach(async () => {
    process.env.GEMINI_API_KEY = 'test-key';
    process.env.GEMINI_MODEL_NAME = 'test-model';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [UploadedImage, ExtractedReceipt, ExtractedItem],
          synchronize: true,
        }),
        ReceiptExtractorModule,
      ],
    })
      .overrideProvider(ImageValidationPipe)
      .useValue({
        transform: (value: any) =>
          value || { originalname: 'test.jpg', buffer: Buffer.from('test') },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new AllExceptionsFilter());

    receiptExtractorService = moduleFixture.get<ReceiptExtractorService>(
      ReceiptExtractorService,
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
    jest.clearAllMocks();
  });

  it('should handle BadRequestException correctly', async () => {
    // Test with no file attached - should trigger BadRequestException from validation
    const response = await request(app.getHttpServer())
      .post('/extract-receipt-details')
      .expect(HttpStatus.BAD_REQUEST);

    expect(response.body).toMatchObject({
      statusCode: HttpStatus.BAD_REQUEST,
      error: 'Bad Request',
    });
  });

  it('should handle NotFoundException correctly', async () => {
    // Mock the service to throw NotFoundException after validation passes
    jest
      .spyOn(receiptExtractorService, 'extractDetails')
      .mockRejectedValue(new NotFoundException('Resource not found'));

    const response = await request(app.getHttpServer())
      .post('/extract-receipt-details')
      .attach('image', Buffer.from('fake image data'), 'test.jpg')
      .expect(HttpStatus.NOT_FOUND);

    expect(response.body).toEqual({
      statusCode: HttpStatus.NOT_FOUND,
      message: 'Resource not found',
      error: 'Not Found',
    });
  });

  it('should handle generic Error as internal server error', async () => {
    // Mock the service to throw a generic Error after validation passes
    jest
      .spyOn(receiptExtractorService, 'extractDetails')
      .mockRejectedValue(new Error('Something went wrong'));

    const response = await request(app.getHttpServer())
      .post('/extract-receipt-details')
      .attach('image', Buffer.from('fake image data'), 'test.jpg')
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);

    expect(response.body.statusCode).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.body.message).toBe('Internal server error');
    expect(response.body.timestamp).toBeDefined();
    expect(response.body.path).toBe('/extract-receipt-details');
  });
});
