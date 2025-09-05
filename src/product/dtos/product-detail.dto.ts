import { ApiProperty } from '@nestjs/swagger';

export class ProductDetailDto {
  @ApiProperty()
  productDetailID: number;

  @ApiProperty()
  productID: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty({ required: false, nullable: true })
  createdAt: Date | null;
}
