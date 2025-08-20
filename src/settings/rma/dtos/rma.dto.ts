import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateRmaDto {
  @IsString()
  @IsNotEmpty()
  sn: string;

  @IsString()
  @IsNotEmpty()
  rmaNumber: string;

  @IsString()
  @IsNotEmpty()
  device: string;

  @IsString()
  @IsNotEmpty()
  po: string;

  @IsString()
  @IsNotEmpty()
  receivedBy: string;

  @IsDateString()
  @IsNotEmpty()
  issuedDate: string;

  @IsDateString()
  @IsNotEmpty()
  receivedDateTime: string;

  @IsBoolean()
  @IsNotEmpty()
  ready: boolean;

  @IsNumber()
  @IsNotEmpty()
  holdingTime: number;

  @IsString()
  @IsOptional()
  extraInfo?: string;
}

export class UpdateRmaDto extends PartialType(CreateRmaDto) {}
