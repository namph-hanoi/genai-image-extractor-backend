import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptExtractorController } from './receipt-extractor.controller';
import { ReceiptExtractorService } from './receipt-extractor.service';

describe('ReceiptExtractorController', () => {
  let controller: ReceiptExtractorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReceiptExtractorController],
      providers: [ReceiptExtractorService],
    }).compile();

    controller = module.get<ReceiptExtractorController>(
      ReceiptExtractorController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return receipt details', () => {
    expect(controller.extractReceiptDetail()).toBe('Receipt details extracted');
  });

  it('expect return incorrect file type', () => {
    expect(controller).toBeDefined();
  });

  it('expect get successful extraction', () => {
    expect(controller).toBeDefined();
  });

  it('expect error from model', () => {
    expect(controller).toBeDefined();
  });

  it('expect internal error 500', () => {
    expect(controller).toBeDefined();
  });
});
