import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ReceiptExtractorService } from './receipt-extractor.service';
import { FileInterceptor } from '../interceptors/file.interceptor';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { readFileSync } from 'fs';

@Controller('extract-receipt-details')
export class ReceiptExtractorController {
  constructor(
    private readonly receiptExtractorService: ReceiptExtractorService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor)
  async extractReceiptDetail(
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ): Promise<string> {
    // TODO: apply the S3 logic here
    const imageBuffer = readFileSync(file.path);
    return this.receiptExtractorService.extractDetails(imageBuffer);
    // return this.receiptExtractorService.testUpload(imageBuffer);
  }
}
