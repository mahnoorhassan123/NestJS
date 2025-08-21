import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateFilesDto {
  @IsString()
  @IsNotEmpty({ message: 'Please enter the title.' })
  title: string;

  @IsUrl()
  @IsNotEmpty()
  URL: string;
}

export class UpdateFilesDto extends PartialType(CreateFilesDto) {}
