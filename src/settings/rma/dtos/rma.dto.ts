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

  @IsNumber()
  @IsNotEmpty()
  endUserId: number;

  @IsString()
  @IsOptional()
  extraInfo?: string;

  @IsBoolean()
  @IsOptional()
  havePO?: boolean;

  @IsBoolean()
  @IsOptional()
  haveBoot?: boolean;

  @IsBoolean()
  @IsOptional()
  haveCables?: boolean;

  @IsBoolean()
  @IsOptional()
  haveSimCard?: boolean;

  @IsBoolean()
  @IsOptional()
  haveSDCard?: boolean;

  @IsString()
  @IsOptional()
  haveSDcardSize?: string;

  @IsBoolean()
  @IsOptional()
  haveOther?: boolean;

  @IsString()
  @IsOptional()
  haveOtherText?: string;

  @IsString()
  @IsOptional()
  vnet1?: string;

  @IsString()
  @IsOptional()
  vnet2?: string;

  @IsString()
  @IsOptional()
  vnet3?: string;

  @IsString()
  @IsOptional()
  predefinedProblems?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  repairStatus?: string;

  @IsString()
  @IsOptional()
  unitInfo?: string;

  @IsString()
  @IsOptional()
  replacedSN?: string;

  @IsString()
  @IsOptional()
  repairerName?: string;

  @IsString()
  @IsOptional()
  testedName?: string;

  @IsDateString()
  @IsOptional()
  finishedDayTime?: string;

  @IsString()
  @IsOptional()
  shippingTrackingNumber?: string;

  @IsString()
  @IsOptional()
  bugZilla?: string;
}

export class UpdateRmaDto extends PartialType(CreateRmaDto) {}
export class RmaResponseDto {
  id: number;
  Taker: string;
  Name: string;
  Company: string;
  Address: string;
  Email: string;
  PhoneNumber: string;
  Device: string;
  SN: string;
  HavePO: '1' | '0';
  HaveBoot: '1' | '0';
  HaveCables: '1' | '0';
  HaveSimCard: '1' | '0';
  HaveSDCard: '1' | '0';
  HaveSDcardSize: string;
  HaveOther: '1' | '0';
  HaveOtherText: string;
  Vnet1: string;
  Vnet2: string;
  Vnet3: string;
  RMAIssuedDate: string;
  PredefinedProblems: string;
  Problem: string;
  RMANumber: string;
  ReceivedByName: string;
  ReceivedDateTime: string;
  Notes: string;
  RepairStatus: string;
  UnitInfo: string;
  ReplacedSN: string;
  RepairerName: string;
  TestedName: string;
  FinishedDayTime: string;
  ShippingTrackingNumber: string;
  BugZilla: string;
}
