import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class DatesDto {
  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}

export class SearchOrdersDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => DatesDto)
  dates?: DatesDto;

  @IsString()
  status: string;

  @IsString()
  country: string;

  @IsOptional()
  @IsString()
  serialNo?: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsString()
  tag_type: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  productCode?: number[];

  @IsOptional()
  @IsBoolean()
  all?: boolean;
}
