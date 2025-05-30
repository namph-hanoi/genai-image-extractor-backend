import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReceiptItemDto {
  @IsString()
  @IsNotEmpty()
  item_name: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  item_cost: number;
}
