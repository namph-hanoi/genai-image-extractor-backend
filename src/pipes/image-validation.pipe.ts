import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { extname } from 'path';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  transform(value: any): any {
    if (!value || !value.originalname) {
      throw new BadRequestException('No file provided');
    }

    const validExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExtension = extname(value.originalname).toLowerCase();

    if (!validExtensions.includes(fileExtension)) {
      throw new BadRequestException(
        `Invalid file type. Only ${validExtensions.join(', ')} are allowed.`,
      );
    }

    return value;
  }
}
