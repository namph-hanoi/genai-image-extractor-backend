import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ReceiptExtractorService } from './receipt-extractor.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { readFileSync } from 'fs';

@Controller('extract-receipt-details')
export class ReceiptExtractorController {
  constructor(
    private readonly receiptExtractorService: ReceiptExtractorService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './upload',
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);

          const ext = extname(file.originalname);
          callback(
            null,
            `${file.originalname.split('.')[0]}-${uniqueSuffix}${ext}`,
          );
        },
      }),
    }),
  )
  async extractReceiptDetail(
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ): Promise<string> {
    const imageBuffer = readFileSync(file.path);
    // return this.receiptExtractorService.extractDetails(imageBuffer);
    return this.receiptExtractorService.testUpload(imageBuffer);
  }
}
