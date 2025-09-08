import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDateString,
  ValidateNested,
  IsEnum,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InventoryS3BucketDestinationFilterSensitiveLog } from '@aws-sdk/client-s3';

class DatesDto {
  @IsOptional()
  @IsDateString()
  from?: string | null;

  @IsOptional()
  @IsDateString()
  to?: string | null;
}

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

export class SearchParamsDto {
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  size?: number;

  @IsString()
  @IsOptional()
  sortColumn?: string;

  @IsEnum(['ASC', 'DESC', null], {
    message: 'sortOrder must be ASC, DESC, or null',
  })
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC' | null;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isGlobal?: boolean;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isIndividual?: boolean;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isSmallReport: boolean;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  total?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsString()
  orderStatus?: string;

  @IsOptional()
  @IsDateString()
  orderDate?: string;

  @IsOptional()
  @IsDateString()
  shipDate?: string;

  @IsOptional()
  @IsString()
  shippedBy?: string;
}
