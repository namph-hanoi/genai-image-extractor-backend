import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiptExtractorModule } from './receipt-extractor/receipt-extractor.module';

@Module({
  imports: [ReceiptExtractorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
