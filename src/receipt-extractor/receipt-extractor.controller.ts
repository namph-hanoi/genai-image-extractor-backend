import {
  Controller,
  Post,
  Patch,
  Get,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ReceiptExtractorService } from './receipt-extractor.service';
import { FileInterceptor } from '../common/interceptors/file.interceptor';
import { ImageValidationPipe } from '../pipes/image-validation.pipe';
import { ReceiptDataValidationPipe } from '../pipes/receipt-data-validation.pipe';
import { ReceiptDataDto } from '../dto/receipt-data.dto';

@Controller()
export class ReceiptExtractorController {
  private readonly logger = new Logger(ReceiptExtractorController.name);

  constructor(
    private readonly receiptExtractorService: ReceiptExtractorService,
  ) {}

  @Post('extract-receipt-details')
  @UseInterceptors(FileInterceptor)
  async extractReceiptDetail(
    @UploadedFile(new ImageValidationPipe()) file: Express.Multer.File,
  ): Promise<any> {
    this.logger.log(
      `Processing receipt extraction for file: ${file.originalname}`,
    );
    // TODO: apply the S3 logic here
    return this.receiptExtractorService.extractDetails(file);
    // return this.receiptExtractorService.testUpload(imageBuffer);
  }

  @Get('images/:imageId')
  async getUploadedImage(
    @Param('imageId') imageId: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      this.logger.log(`Retrieving image with ID: ${imageId}`);
      // TODO: apply the S3 logic here
      const imageStream =
        await this.receiptExtractorService.getUploadedImage(imageId);
      imageStream.pipe(res);
    } catch (error) {
      this.logger.error(
        `Failed to retrieve image with ID: ${imageId}`,
        error.stack,
      );
      throw new NotFoundException('Image not found');
    }
  }

  @Patch('update-extracted-receipt-details')
  async updateReceiptData(
    @Body(new ReceiptDataValidationPipe()) receiptData: ReceiptDataDto,
  ): Promise<{ message: string; data: ReceiptDataDto }> {
    this.logger.log(`Updating receipt data for ID: ${receiptData.id}`);
    return this.receiptExtractorService.updateReceiptData(receiptData);
  }
}
