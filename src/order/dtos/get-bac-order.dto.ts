// dtos/backorder.dto.ts
import { IsArray, IsInt } from 'class-validator';

export class GetBackOrderDto {
  @IsArray()
  @IsInt({ each: true })
  productCodes: number[];
}
