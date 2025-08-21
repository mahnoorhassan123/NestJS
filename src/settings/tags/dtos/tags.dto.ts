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
}
export class UpdateTagDto extends PartialType(CreateTagDto) {}
