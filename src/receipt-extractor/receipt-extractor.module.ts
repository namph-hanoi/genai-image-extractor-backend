import { Module } from '@nestjs/common';
import { ReceiptExtractorController } from './receipt-extractor.controller';
import { ReceiptExtractorService } from './receipt-extractor.service';

@Module({
  controllers: [ReceiptExtractorController],
  providers: [ReceiptExtractorService],
})
export class ReceiptExtractorModule {}
