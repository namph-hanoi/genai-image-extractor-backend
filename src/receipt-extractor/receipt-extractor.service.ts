import { Injectable } from '@nestjs/common';

@Injectable()
export class ReceiptExtractorService {
  extractDetails(): string {
    return 'Receipt details extracted';
  }
}
