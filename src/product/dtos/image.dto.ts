import { ApiProperty } from '@nestjs/swagger';

export class ImageDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  tableId: number;

  @ApiProperty()
  tableName: string;

  @ApiProperty()
  imageUrl: string;

  @ApiProperty()
  displayOrder: number;

  @ApiProperty({ required: false, nullable: true })
  createdAt: Date | null;

  @ApiProperty({ required: false, nullable: true })
  isThumb: boolean | null;
}