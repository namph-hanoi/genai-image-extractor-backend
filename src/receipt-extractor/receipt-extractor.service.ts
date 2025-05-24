/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoogleGenAI } from '@google/genai';
import { readFileSync } from 'fs';
import { UploadedImage } from '../entities/uploaded-image.entity';
import { ExtractedReceipt } from '../entities/extracted-receipt.entity';
import { ExtractedItem } from '../entities/extracted-item.entity';

@Injectable()
export class ReceiptExtractorService implements OnModuleInit {
  private readonly logger = new Logger(ReceiptExtractorService.name);
  private googleAI: GoogleGenAI;

  constructor(
    @InjectRepository(UploadedImage)
    private uploadedImageRepository: Repository<UploadedImage>,
    @InjectRepository(ExtractedReceipt)
    private extractedReceiptRepository: Repository<ExtractedReceipt>,
    @InjectRepository(ExtractedItem)
    private extractedItemRepository: Repository<ExtractedItem>,
  ) {}

  onModuleInit() {
    try {
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error('GEMINI_API_KEY is not defined in the environment variables');
      }

      this.googleAI = new GoogleGenAI({ apiKey });
      this.logger.log('GoogleGenAI initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize GoogleGenAI', error);
      throw error;
    }
  }

  async extractDetails(file: Express.Multer.File): Promise<any> {
    this.logger.log(`Starting receipt extraction for file: ${file.originalname}`);
    
    try {
      const uploadedImage = await this.saveUploadedImage(file);
      
      const extractedData = await this.extractDataFromImage(file);
      
      const extractedReceipt = await this.saveExtractedReceipt(extractedData, uploadedImage);
      
      const extractedItems = await this.saveExtractedItems(extractedData.receipt_items, extractedReceipt);
      
      this.logger.log(`Successfully processed receipt for file: ${file.originalname}`);
      
      // Return a serializable structure without circular references
      return {
        uploadedImage: {
          id: uploadedImage.id,
          name: uploadedImage.name,
          path: uploadedImage.path,
          created_at: uploadedImage.created_at
        },
        extractedReceipt: {
          id: extractedReceipt.id,
          extracted_date: extractedReceipt.extracted_date,
          extracted_currency: extractedReceipt.extracted_currency,
          extracted_vendor_name: extractedReceipt.extracted_vendor_name,
          extracted_tax: extractedReceipt.extracted_tax,
          extracted_total: extractedReceipt.extracted_total,
          created_at: extractedReceipt.created_at
        },
        extractedItems: extractedItems.map(item => ({
          id: item.id,
          item_name: item.item_name,
          item_cost: item.item_cost,
          created_at: item.created_at
        })),
        rawData: extractedData
      };
    } catch (error) {
      this.logger.error(`Failed to extract receipt details for file: ${file.originalname}`, error);
      throw new Error('Failed to extract receipt details.');
    }
  }

  private async saveUploadedImage(file: Express.Multer.File): Promise<UploadedImage> {
    try {
      const uploadedImage = new UploadedImage();
      uploadedImage.name = file.originalname;
      uploadedImage.path = file.path;

      const savedImage = await this.uploadedImageRepository.save(uploadedImage);
      this.logger.log(`Saved uploaded image with ID: ${savedImage.id}`);
      return savedImage;
    } catch (error) {
      this.logger.error('Failed to save uploaded image', error);
      throw new Error('Failed to save uploaded image to database');
    }
  }

  private async extractDataFromImage(file: Express.Multer.File): Promise<any> {
    try {
      const imageBuffer = readFileSync(file.path);
      const imageBase64 = imageBuffer.toString('base64');

      const prompt = `Extract the texts in the the uploaded image, convert and return the extracted into a json structure which is comprised of the following properties and formats:
- date (string of YYYY/MM/DD)
- vendor (string of YYYY/MM/DD)
- currency (string 3-character currency code)
- receipt_items (array of items, each item has properties of item_name and item_cost in string and number respectively):
- tax (number)
- total (number)`;

      const response = await this.googleAI.models.generateContent({
        model: process.env.GEMINI_MODEL_NAME,
        contents: [
          { text: prompt },
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: imageBase64,
            },
          },
        ],
      });

      const cleanedText = response.text.replace(/^```json\n|```$/g, '');
      const extractedData = JSON.parse(cleanedText);
      
      this.logger.log('Successfully extracted data from image using AI');
      return extractedData;
    } catch (error) {
      this.logger.error('Failed to extract data from image', error);
      throw new Error('Failed to extract data from image using AI');
    }
  }

  private async saveExtractedReceipt(extractedData: any, uploadedImage: UploadedImage): Promise<ExtractedReceipt> {
    try {
      const extractedReceipt = new ExtractedReceipt();
      extractedReceipt.extracted_date = new Date(extractedData.date);
      extractedReceipt.extracted_currency = extractedData.currency;
      extractedReceipt.extracted_vendor_name = extractedData.vendor;
      extractedReceipt.extracted_items = extractedData.receipt_items; // Set the JSON column
      extractedReceipt.extracted_tax = extractedData.tax;
      extractedReceipt.extracted_total = extractedData.total;
      extractedReceipt.uploadedImage = uploadedImage;

      const savedReceipt = await this.extractedReceiptRepository.save(extractedReceipt);
      this.logger.log(`Saved extracted receipt with ID: ${savedReceipt.id}`);
      return savedReceipt;
    } catch (error) {
      this.logger.error('Failed to save extracted receipt', error);
      throw new Error('Failed to save extracted receipt to database');
    }
  }

  private async saveExtractedItems(receiptItems: any[], extractedReceipt: ExtractedReceipt): Promise<ExtractedItem[]> {
    try {
      const extractedItems = receiptItems.map((item: any) => {
        const extractedItem = new ExtractedItem();
        extractedItem.item_name = item.item_name;
        extractedItem.item_cost = item.item_cost;
        extractedItem.receipt = extractedReceipt;
        return extractedItem;
      });

      const savedItems = await this.extractedItemRepository.save(extractedItems);
      this.logger.log(`Saved ${savedItems.length} extracted items`);
      return savedItems;
    } catch (error) {
      this.logger.error('Failed to save extracted items', error);
      throw new Error('Failed to save extracted items to database');
    }
  }

  // TODO: remove after done working with uploading functions
  async testUpload(imageBuffer: Buffer): Promise<any> {
    const imageBase64 = imageBuffer.toString('base64');
    console.log(["🚀 ~ ReceiptExtractorService ~ testUpload ~ imageBase64:", imageBase64]);
    return imageBase64;
  }
}
