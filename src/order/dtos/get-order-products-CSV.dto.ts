import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
} from 'class-validator';

export class GetOrdersProductCSVDto {
  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;

  @IsBoolean()
  @IsOptional()
  isIndividual?: boolean;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  orderStatus?: string;

  @IsString()
  @IsOptional()
  total?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsDateString()
  @IsOptional()
  orderDate?: string;

  @IsDateString()
  @IsOptional()
  shipDate?: string;

  @IsString()
  @IsOptional()
  serialNo?: string;

  @IsDateString()
  @IsOptional()
  datesFrom?: string;

  @IsDateString()
  @IsOptional()
  datesTo?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsOptional()
  productCode?: number[];

  @IsArray()
  @IsOptional()
  tags?: number[];

  @IsString()
  @IsOptional()
  tag_type?: string;
}
