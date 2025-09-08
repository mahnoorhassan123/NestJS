import { IsNumber, IsOptional } from 'class-validator';

export class UpdateQuoteFileDto {
  @IsNumber()
  orderId: number;

  @IsOptional()
  @IsNumber()
  quoteId: number;
}
