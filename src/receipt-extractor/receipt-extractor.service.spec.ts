import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptExtractorService } from './receipt-extractor.service';

describe('ReceiptExtractorService', () => {
  let service: ReceiptExtractorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReceiptExtractorService],
    }).compile();

    service = module.get<ReceiptExtractorService>(ReceiptExtractorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should extract receipt details', () => {
    // expect(service.extractDetails()).toBe('Receipt details extracted');
  });
});
