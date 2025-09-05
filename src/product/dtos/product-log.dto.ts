import { IsInt, IsOptional, IsString, IsDate, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductLogDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  productId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  operation?: string;

  @ApiProperty()
  @IsDate()
  timestamp: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  userId?: number;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  oldData?: Record<string, any>;

  @ApiProperty({ required: false, type: Object })
  @IsOptional()
  @IsObject()
  newData?: Record<string, any>;
}
