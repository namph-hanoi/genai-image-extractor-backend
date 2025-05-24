import { Controller, Post } from '@nestjs/common';
import { ReceiptExtractorService } from './receipt-extractor.service';

@Controller('extract-receipt-details')
export class ReceiptExtractorController {
  constructor(
    private readonly receiptExtractorService: ReceiptExtractorService,
  ) {}

  @Post()
  extractReceiptDetail(): Promise<string> {
    return this.receiptExtractorService.extractDetails();
  }
}
