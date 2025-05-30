import {
  IsString,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
  Length,
  Matches,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReceiptItemDto } from './receipt-item.dto';

export class ReceiptDataDto {
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  id: number;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency must be a 3-character uppercase code (e.g., USD, EUR)',
  })
  currency: string;

  @IsString()
  @IsNotEmpty()
  vendor_name: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  total: number;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  tax: number;

  @IsArray()
  @ArrayMinSize(1, { message: 'Receipt must contain at least one item' })
  @ValidateNested({ each: true })
  @Type(() => ReceiptItemDto)
  receipt_items: ReceiptItemDto[];
}
