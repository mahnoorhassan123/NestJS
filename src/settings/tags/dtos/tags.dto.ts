import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export enum TagType {
  Reseller = 'Reseller',
  Company = 'Company',
  Product = 'Product',
}

export class CreateTagDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter the title.' })
  @Matches(/^[a-zA-Z0-9\s]*$/, {
    message: 'Title cannot contain special characters',
  })
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsNotEmpty()
  backgroundColor: string;

  @IsEnum(TagType, { message: 'Tag type must be Product, Company, Reseller' })
  @IsOptional()
  type?: TagType;

  @IsBoolean()
  @IsOptional()
  active: boolean = true;

  @IsNotEmpty()
  typeId: number;

  @IsNotEmpty()
  color: string;

  @IsNotEmpty()
  createdBy: string;

  @IsNotEmpty()
  updatedBy: string;
}
export class UpdateTagDto extends PartialType(CreateTagDto) {}

export class TagResponseDto {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  isActive: 1 | 0;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  color: string;
  typeId: number;
}
