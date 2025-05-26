import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { ReceiptExtractorService } from './receipt-extractor.service';
import { ReceiptExtractorModule } from './receipt-extractor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedImage } from '../entities/uploaded-image.entity';
import { ExtractedReceipt } from '../entities/extracted-receipt.entity';
import { ExtractedItem } from '../entities/extracted-item.entity';

describe('ReceiptExtractorController Integration Tests', () => {
  let app: INestApplication;
  let receiptExtractorService: ReceiptExtractorService;

  beforeEach(async () => {
    // Set required environment variables
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
    }).compile();

    app = moduleFixture.createNestApplication();
    receiptExtractorService = moduleFixture.get<ReceiptExtractorService>(
      ReceiptExtractorService,
    );

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return receipt details for valid image upload', async () => {
    const mockResponse = {
      id: 1,
      date: '2021/03/26',
      vendor: 'STOP&SHOP',
      currency: 'USD',
      receipt_items: [
        { id: 1, item_name: 'SB BGICE CB 10LB', item_cost: 2.99 },
        { id: 2, item_name: 'SB BGICE CB 10LB', item_cost: 2.99 },
        { id: 3, item_name: 'SB BGICE CB 10LB', item_cost: 2.99 },
        { id: 4, item_name: 'HALLMARK CARD', item_cost: 2 },
        { id: 5, item_name: 'HALLMARK CARD', item_cost: 3.79 },
        { id: 6, item_name: 'HALLMARK CARD', item_cost: 0.99 },
        { id: 7, item_name: 'CHARITY', item_cost: 1 },
      ],
      tax: 0.42,
      total: 17.17,
      image_url: 'http://test.com/image.jpg',
    };

    // Mock the service method
    jest
      .spyOn(receiptExtractorService, 'extractDetails')
      .mockResolvedValue(mockResponse);
    const response = await request(app.getHttpServer())
      .post('/extract-receipt-details')
      .attach('image', Buffer.from('fake image data'), 'test.jpg')
      .expect(HttpStatus.CREATED);
    expect(response.body).toEqual(mockResponse);
  });

  it('should return error for incorrect file type', async () => {
    await request(app.getHttpServer())
      .post('/extract-receipt-details')
      .attach('image', Buffer.from('This is not an image'), 'test.txt')
      .expect(HttpStatus.BAD_REQUEST);
  });

  it('should handle error from AI model/service', async () => {
    // Mock the service to throw an error
    jest
      .spyOn(receiptExtractorService, 'extractDetails')
      .mockRejectedValue(new Error('Model processing failed'));

    await request(app.getHttpServer())
      .post('/extract-receipt-details')
      .attach('image', Buffer.from('fake image data'), 'test.jpg')
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it('should handle internal server error (500)', async () => {
    // Mock the service to throw a generic error
    jest
      .spyOn(receiptExtractorService, 'extractDetails')
      .mockImplementation(() => {
        throw new Error('Unexpected server error');
      });

    await request(app.getHttpServer())
      .post('/extract-receipt-details')
      .attach('image', Buffer.from('fake image data'), 'test.jpg')
      .expect(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
