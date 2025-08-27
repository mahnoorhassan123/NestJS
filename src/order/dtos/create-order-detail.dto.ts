import { IsOptional, IsString, IsInt, IsBoolean, IsNumber, IsDateString } from 'class-validator';

export class CreateOrderDetailDto {
  @IsOptional()
  @IsInt()
  productId?: number;

  @IsOptional()
  @IsString()
  productCode?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  qtyOnPackingSlip?: number;

  @IsOptional()
  @IsBoolean()
  isChild?: boolean;

  @IsOptional()
  @IsInt()
  displayOrder?: number;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsString()
  harmonizedCode?: string;

  @IsOptional()
  @IsString()
  exportControlClassificationNumber?: string;

  @IsOptional()
  @IsNumber()
  productWeight?: number;

  @IsOptional()
  @IsString()
  unitOfMeasure?: string;

  @IsOptional()
  @IsString()
  countryOfOrigin?: string;

  @IsOptional()
  @IsString()
  exportDescription?: string;

  @IsOptional()
  @IsInt()
  quantity?: number;

  @IsOptional()
  @IsNumber()
  productPrice?: number;

  @IsOptional()
  @IsNumber()
  discountValue?: number;

  @IsOptional()
  @IsString()
  productSubClass?: string;

  @IsOptional()
  @IsBoolean()
  taxableProduct?: boolean;

  @IsOptional()
  @IsInt()
  qtyShipped?: number;

  @IsOptional()
  @IsInt()
  qtyOnBackOrder?: number;

  @IsOptional()
  @IsInt()
  parent?: number;

  @IsOptional()
  @IsString()
  parentName?: string;

  @IsOptional()
  @IsString()
  productSerials?: string;

  @IsOptional()
  @IsBoolean()
  isCategoriesOption?: boolean;

  @IsOptional()
  @IsInt()
  optionId?: number;

  @IsOptional()
  @IsInt()
  categoryIdOfOption?: number;

  @IsOptional()
  @IsString()
  options?: string;
}