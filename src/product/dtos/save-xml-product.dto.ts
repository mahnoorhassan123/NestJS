import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SaveXmlProductDto {
  @ApiProperty()
  @IsString()
  path!: string;
}
