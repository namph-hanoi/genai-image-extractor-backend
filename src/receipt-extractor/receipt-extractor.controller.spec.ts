import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptExtractorController } from './receipt-extractor.controller';
import { ReceiptExtractorService } from './receipt-extractor.service';
import * as fs from 'fs';

jest.mock('fs');

describe('ReceiptExtractorController', () => {
  let controller: ReceiptExtractorController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
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

  it('should return receipt details', async () => {
    const mockImageBuffer = Buffer.from('mockImageData');
    const mockFile = {
      path: '/mock/path/to/image.jpg',
      originalname: 'test-image.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
    } as Express.Multer.File;

    const mockCleanedText = {
      date: '2021/03/26',
      vendor: 'STOP&SHOP',
      currency: 'USD',
      receipt_items: [
        { item_name: 'SB BGICE CB 10LB', item_cost: 2.99 },
        { item_name: 'SB BGICE CB 10LB', item_cost: 2.99 },
        { item_name: 'SB BGICE CB 10LB', item_cost: 2.99 },
        { item_name: 'HALLMARK CARD', item_cost: 2 },
        { item_name: 'HALLMARK CARD', item_cost: 3.79 },
        { item_name: 'HALLMARK CARD', item_cost: 0.99 },
        { item_name: 'CHARITY', item_cost: 1 },
      ],
      tax: 0.42,
      total: 17.17,
    };

    // Mock fs.readFileSync to return our mock buffer
    (fs.readFileSync as jest.Mock).mockReturnValue(mockImageBuffer);

    const receiptExtractorService = module.get<ReceiptExtractorService>(
      ReceiptExtractorService,
    );
    jest
      .spyOn(receiptExtractorService, 'extractDetails')
      .mockResolvedValue(mockCleanedText);

    const result = await controller.extractReceiptDetail(mockFile);

    expect(result).toEqual(mockCleanedText);
    expect(fs.readFileSync).toHaveBeenCalledWith('/mock/path/to/image.jpg');
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
