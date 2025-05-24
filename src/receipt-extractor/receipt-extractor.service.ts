/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReceiptExtractorService implements OnModuleInit {
  private googleAI: GoogleGenAI;

  onModuleInit() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables');
    }

    this.googleAI = new GoogleGenAI({ apiKey });
  }

  async extractDetails(): Promise<any> {
    const imagePath = path.join(__dirname, '../../sample-receipts/1.jpg');
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');

    const prompt = `Extract the texts in the the uploaded image, convert and return the extracted into a json structure which is comprised of the following properties and formats:
- date (string of YYYY/MM/DD)
- currency (string 3-character currency code)
- receipt_items (array of items, each item has properties of item_name and item_cost in string and number respectively):
- tax (number)
- total (number)`;

    try {
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
      return JSON.parse(cleanedText);
    } catch (error) {
      console.error('Error during receipt extraction:', error);
      throw new Error('Failed to extract receipt details.');
    }
  }
}
