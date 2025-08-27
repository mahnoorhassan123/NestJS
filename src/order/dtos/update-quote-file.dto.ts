import { IsNumber } from 'class-validator';

export class UpdateQuoteFileDto {
  @IsNumber()
  orderId: number;

  @IsNumber()
  quoteId: number;
}
