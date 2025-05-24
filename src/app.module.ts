import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReceiptExtractorModule } from './receipt-extractor/receipt-extractor.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadedImage } from './entities/uploaded-image.entity';
import { ExtractedReceipt } from './entities/extracted-receipt.entity';
import { ExtractedItem } from './entities/extracted-item.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false, // Set to false in production
    }),
    ReceiptExtractorModule,
    TypeOrmModule.forFeature([UploadedImage, ExtractedReceipt, ExtractedItem]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
