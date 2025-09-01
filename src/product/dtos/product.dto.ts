import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class ProductDto {
  @ApiProperty({ required: false, type: Number })
  @IsInt()
  @IsOptional()
  productId?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productDescriptionShort?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productDescription?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productNameShort?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  productPrice: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  productPriceYuan: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  productPriceYen: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  productPriceEuro: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  productPricePound: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  productPriceWon: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  productPriceInr: number;

  @ApiProperty({ required: false, type: Number })
  @IsNumber()
  @IsOptional()
  productWeight?: number;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  freeShippingItem?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  photoAltText?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  hideFreeAccessories?: boolean;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  taxableProduct?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  techSpecs?: string;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  hideProduct?: boolean;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsDate()
  @IsOptional()
  modifyOn?: Date;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsString()
  @IsOptional()
  createdOn?: Date;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  stockStatus?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  availability?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productPriceName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productManufacturer?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  salePriceName?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  accessories?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  optionIds?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  freeAccessories?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productDetailUrl?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  extInfo?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productDescriptionAbovePricing?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productPhotoUrl?: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  discount: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  metaTagDescription?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  metaTagKeywords?: string;

  @ApiProperty({ type: Number })
  @IsInt()
  priorityIndex: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  hideWhenOutOfStock: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isDeleted: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isFeatured: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  titleImage?: string;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isSerialAble: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isFreeProduct: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  harmonizedCode?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  exportControlClassificationNumber?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  unitOfMeasure?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  countryOfOrigin?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  exportDescription?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  groupId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  backlogLeadtime?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  backlogComments?: string;

  @ApiProperty({ type: Number })
  @IsInt()
  backlogPriority: number;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  backlogShow: boolean;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsDate()
  @IsOptional()
  updatedDateBacklogComment?: Date;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  holdForApproval: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  accessory: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  maintenance: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  upgrade: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  resale: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productClassId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productSubClassId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  gpn?: string;

  @ApiProperty({ type: Number })
  @IsInt()
  storeCategory: number;

  @ApiProperty({ required: false, type: Boolean })
  @IsBoolean()
  @IsOptional()
  isMultiClassification?: boolean;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  createdBy?: string;

  @ApiProperty({ required: false })
  @IsInt()
  @IsOptional()
  modifiedBy?: string;
}
