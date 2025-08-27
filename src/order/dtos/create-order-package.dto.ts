import { IsOptional, IsString, IsInt, IsNumber, IsDateString } from 'class-validator';

export class CreateOrderPackageDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  price?: number;
}