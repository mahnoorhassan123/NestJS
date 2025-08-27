import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateFileDto {
  @IsString()
  name: string;

  @IsString()
  fileType: string;

  @IsOptional()
  @IsNumber()
  orderId?: number;

  @IsOptional()
  @IsNumber()
  quoteId?: number;

  @IsNumber()
  uploadedBy: number;
}
