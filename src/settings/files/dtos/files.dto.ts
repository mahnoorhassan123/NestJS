import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateFilesDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter the title.' })
  title: string;

  @IsUrl()
  @IsNotEmpty()
  URL: string;

  @IsString()
  @IsNotEmpty()
  fileExt: string;

  @IsString()
  @IsNotEmpty()
  tableName: string;

  @IsNumber()
  @IsOptional()
  tableId?: number;

  @IsNumber()
  @IsNotEmpty()
  createdBy: number;
}

export class UpdateFilesDto extends PartialType(CreateFilesDto) {}

export class FileResponseDto {
  FileID: number;
  FileName: string;
  FileExt: string;
  FileURL: string;
  TableName: string;
  TableID: number;
  CreatedBy: number;
  CreatedAt: string;
  IsActive: 1 | 0;
  firstname: string;
  lastname: string;
}
