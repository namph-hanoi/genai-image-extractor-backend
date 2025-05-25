import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptExtractorController } from './receipt-extractor.controller';
import { ReceiptExtractorService } from './receipt-extractor.service';
import { UploadedImage } from '../entities/uploaded-image.entity';
import { ExtractedReceipt } from '../entities/extracted-receipt.entity';
import { ExtractedItem } from '../entities/extracted-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UploadedImage, ExtractedReceipt, ExtractedItem]),
  ],
  controllers: [ReceiptExtractorController],
  providers: [ReceiptExtractorService],
})
export class ReceiptExtractorModule {}
