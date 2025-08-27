import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTagTableDto {
  @ApiPropertyOptional({ enum: ['customers', 'orders', 'quotes', 'products'] })
  @IsOptional()
  @IsEnum(['customers', 'orders', 'quotes', 'products'])
  tableName?: 'customers' | 'orders' | 'quotes' | 'products';

  @ApiProperty()
  @IsInt()
  tableId: number;

  @ApiProperty()
  @IsInt()
  tagId: number;
}
