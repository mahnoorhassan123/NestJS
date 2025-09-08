import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { DatesDto } from './search-by-status.dto';

export class GetOrdersByStatusDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DatesDto)
  dates?: DatesDto;

  @IsString()
  status: string;

  @IsString()
  country: string;

  @IsString()
  serialNo: string;

  @IsString()
  type: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  tag_type: string;

  @IsArray()
  @IsNumber({}, { each: true })
  productCode: number[];

  @IsOptional()
  @IsBoolean()
  all?: boolean;

  @IsOptional()
  @IsString()
  orderDateFrom?: string;

  @IsOptional()
  @IsString()
  orderDateTo?: string;

  @IsOptional()
  @IsString()
  shipDateFrom?: string;

  @IsOptional()
  @IsString()
  shipDateTo?: string;
}
