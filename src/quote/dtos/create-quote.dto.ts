import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QuoteLineItemDto {
  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsInt()
  @IsOptional()
  Quantity?: number;

  @IsString()
  @IsOptional()
  ProductName?: string;

  @IsNumber()
  @IsOptional()
  ProductPrice?: number;

  @IsNumber()
  @IsOptional()
  DiscountValue?: number;

  @IsString()
  @IsOptional()
  TaxableProduct?: string;

  @IsString()
  @IsOptional()
  Discription?: string;

  @IsBoolean()
  @IsOptional()
  isChild?: boolean;

  @IsString()
  @IsOptional()
  parent?: string;

  @IsString()
  @IsOptional()
  parentName?: string;

  @IsInt()
  @IsOptional()
  displayOrder?: number;

  @IsString()
  @IsOptional()
  categoryIdOfOption?: string;

  @IsInt()
  @IsOptional()
  OptionID?: number;

  @IsBoolean()
  @IsOptional()
  isCategoriesOption?: boolean;

  @IsString()
  @IsOptional()
  Options?: string;

  @IsNumber()
  @IsOptional()
  TotalPrice?: number;

  @IsNumber()
  @IsOptional()
  ProductWeight?: number;

  @IsInt()
  @IsOptional()
  ProductID?: number;

  @IsString()
  @IsOptional()
  Custom_Field_CarrierAcctNo?: string;

  @IsString()
  @IsOptional()
  Product_Subclass?: string;
}

export class CreateQuoteLineItemDto {
  @ApiProperty({ description: 'Quantity of the product', example: 1 })
  @IsNumber()
  @IsOptional()
  Quantity?: number;

  @ApiProperty({ description: 'Product code', example: 'TESTING-PRODUCT' })
  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsInt()
  @IsOptional()
  QuoteNo?: number;

  @IsNumber()
  @IsOptional()
  Discount?: number;

  @ApiProperty({ description: 'Product ID', example: 200970 })
  @IsNumber()
  @IsOptional()
  ProductID?: number;

  @ApiProperty({ description: 'Product weight', example: 12, nullable: true })
  @IsNumber()
  @IsOptional()
  ProductWeight?: number;

  @ApiProperty({
    description: 'Indicates if the item is a child item',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isChild?: boolean;

  @ApiProperty({
    description: 'Indicates if the item is a category option',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isCategoriesOption?: boolean;

  @ApiProperty({
    description: 'Indicates if the product is taxable',
    example: 'Y',
  })
  @IsString()
  @IsOptional()
  TaxableProduct?: string;

  @ApiProperty({ description: 'Total price of the item', example: 12 })
  @IsNumber()
  @IsOptional()
  TotalPrice?: number;

  @ApiProperty({ description: 'Product name', example: 'test name' })
  @IsString()
  @IsOptional()
  ProductName?: string;

  @ApiProperty({ description: 'Product options', example: '' })
  @IsString()
  @IsOptional()
  Options?: string;

  @ApiProperty({ description: 'Product price', example: 12 })
  @IsNumber()
  @IsOptional()
  ProductPrice?: number;

  @ApiProperty({ description: 'Option IDs', example: '', nullable: true })
  @IsString()
  @IsOptional()
  OptionIDs?: string;

  @ApiProperty({ description: 'Option ID', example: 0 })
  @IsNumber()
  @IsOptional()
  OptionID?: number;

  @ApiProperty({ description: 'Category ID of the option', example: 0 })
  @IsNumber()
  @IsOptional()
  categoryIdOfOption?: number;

  @ApiProperty({
    description: 'Product description',
    example: 'This is a test product',
  })
  @IsString()
  @IsOptional()
  Discription?: string;

  @ApiProperty({
    description: 'Parent product name',
    example: 'TESTING-PRODUCTt5nne6d',
  })
  @IsString()
  @IsOptional()
  parentName?: string;

  @ApiProperty({
    description: 'Parent product code',
    example: 'TESTING-PRODUCTt5nne6d',
  })
  @IsString()
  @IsOptional()
  parent?: string;

  @IsInt()
  @IsOptional()
  display_order?: number;

  @ApiProperty({
    description: 'Indicates if the product has multiple classifications',
    example: 1,
  })
  @IsNumber()
  @IsOptional()
  isMultiClassification?: number;

  @ApiProperty({
    description: 'Product subclass',
    example: 'DataSpy',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  Product_Subclass?: string;

  @ApiProperty({
    description: 'Quantity on packing slip',
    example: null,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  QtyOnPackingSlip?: number;
}

export class CreateQuoteDto {
  @IsInt()
  @IsOptional()
  QuoteNo?: number;

  @ApiProperty({
    description: 'Array of quote line items',
    type: [CreateQuoteLineItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuoteLineItemDto)
  quotelineitems: CreateQuoteLineItemDto[];

  @IsInt()
  @IsOptional()
  shippingMethodId?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tagsArray?: string[] | number[];

  @IsOptional()
  InvoiceableOn?: String | Date;

  @ApiProperty({ description: 'Total shipping cost', example: 0 })
  @IsNumber()
  @IsOptional()
  TotalShippingCost?: number;

  @ApiProperty({ description: 'Sales tax rate 1', example: 0 })
  @IsNumber()
  @IsOptional()
  SalesTaxRate1?: number;

  @ApiProperty({ description: 'Sales tax amount 1', example: 0 })
  @IsNumber()
  @IsOptional()
  SalesTax1?: number;

  @ApiProperty({
    description: 'Quote creation date',
    example: '9/5/2025 11:28:19 AM',
  })
  @IsString()
  @IsOptional()
  QuoteDate?: string;

  @ApiProperty({ description: 'Show customer name', example: true })
  @IsBoolean()
  @IsOptional()
  IsCustomerNameShow?: boolean;

  @ApiProperty({ description: 'Show customer email', example: 1 })
  @IsNumber()
  @IsOptional()
  IsCustomerEmailShow?: number;

  @ApiProperty({ description: 'Insurance value', example: 0 })
  @IsNumber()
  @IsOptional()
  InsuranceValue?: number;

  @ApiProperty({ description: 'Quote approval status', example: 1 })
  @IsNumber()
  @IsOptional()
  isApproved?: number;

  @ApiProperty({ description: 'External quote status', example: 0 })
  @IsNumber()
  @IsOptional()
  isExternal?: number;

  @ApiProperty({ description: 'Affiliate commissionable value', example: 4007 })
  @IsNumber()
  @IsOptional()
  Affiliate_Commissionable_Value?: number;

  @ApiProperty({ description: 'Customer ID', example: 1010 })
  @IsNumber()
  @IsOptional()
  CustomerID?: number;

  @ApiProperty({ description: 'Billing first name', example: 'Test' })
  @IsString()
  @IsOptional()
  BillingFirstName?: string;

  @ApiProperty({ description: 'Billing last name', example: 'User' })
  @IsString()
  @IsOptional()
  BillingLastName?: string;

  @ApiProperty({ description: 'Billing company name', example: '' })
  @IsString()
  @IsOptional()
  BillingCompanyName?: string;

  @ApiProperty({ description: 'Billing address line 1', example: 'Neustr.13' })
  @IsString()
  @IsOptional()
  BillingAddress1?: string;

  @ApiProperty({ description: 'Billing address line 2', example: '' })
  @IsString()
  @IsOptional()
  BillingAddress2?: string;

  @ApiProperty({ description: 'Billing city', example: 'Rodenbach' })
  @IsString()
  @IsOptional()
  BillingCity?: string;

  @ApiProperty({ description: 'Billing country', example: 'DE' })
  @IsString()
  @IsOptional()
  BillingCountry?: string;

  @ApiProperty({ description: 'Billing postal code', example: '61841' })
  @IsString()
  @IsOptional()
  BillingPostalCode?: string;

  @ApiProperty({ description: 'Billing state', example: 'Hessen' })
  @IsString()
  @IsOptional()
  BillingState?: string;

  @ApiProperty({
    description: 'Billing email address',
    example: 'testUser@googlemail.com',
  })
  @IsString()
  @IsOptional()
  BillingEmailAddress?: string;

  @ApiProperty({
    description: 'Billing phone number',
    example: '06923416273534',
  })
  @IsString()
  @IsOptional()
  BillingPhoneNumber?: string;

  @ApiProperty({ description: 'End user ID', example: '20023' })
  @IsString()
  @IsOptional()
  endUserId?: string;

  @ApiProperty({ description: 'Shipping address line 1', example: 'Neustr.13' })
  @IsString()
  @IsOptional()
  ShipAddress1?: string;

  @ApiProperty({ description: 'Shipping address line 2', example: '' })
  @IsString()
  @IsOptional()
  ShipAddress2?: string;

  @ApiProperty({ description: 'Shipping city', example: 'Rodenbach' })
  @IsString()
  @IsOptional()
  ShipCity?: string;

  @ApiProperty({ description: 'Shipping country', example: 'DE' })
  @IsString()
  @IsOptional()
  ShipCountry?: string;

  @ApiProperty({ description: 'Shipping postal code', example: '61841' })
  @IsString()
  @IsOptional()
  ShipPostalCode?: string;

  @ApiProperty({ description: 'Shipping state', example: 'Hessen' })
  @IsString()
  @IsOptional()
  ShipState?: string;

  @ApiProperty({
    description: 'Shipping phone number',
    example: '06923416273534',
  })
  @IsString()
  @IsOptional()
  ShipPhoneNumber?: string;

  @ApiProperty({ description: 'Shipping first name', example: 'Test' })
  @IsString()
  @IsOptional()
  ShipFirstName?: string;

  @ApiProperty({ description: 'Shipping last name', example: 'User' })
  @IsString()
  @IsOptional()
  ShipLastName?: string;

  @ApiProperty({
    description: 'Shipping email address',
    example: 'testUser@googlemail.com',
  })
  @IsString()
  @IsOptional()
  ShipEmailAddress?: string;

  @ApiProperty({ description: 'Shipping company name', example: '' })
  @IsString()
  @IsOptional()
  ShipCompanyName?: string;

  @ApiProperty({
    description: 'Quote comments',
    example: '<p>test order notes</p>',
  })
  @IsString()
  @IsOptional()
  Quote_Comments?: string;

  @ApiProperty({
    description: 'Quote notes',
    example: '<p>test order notes</p>',
  })
  @IsString()
  @IsOptional()
  QuoteNotes?: string;

  @ApiProperty({ description: 'Tax exempt status', example: 0 })
  @IsNumber()
  @IsOptional()
  IsTaxExempt?: number;

  @ApiProperty({
    description: 'Tax exemption ID',
    example: null,
    nullable: true,
  })
  @IsNumber()
  @IsOptional()
  TaxExemptionId?: number;

  @ApiProperty({ description: 'Tax title 1', example: 'Tax (0%)' })
  @IsString()
  @IsOptional()
  Tax1_Title?: string;

  @ApiProperty({
    description: 'Quote validity date',
    example: '2025-10-05T06:29:16.455Z',
  })
  @IsString()
  @IsOptional()
  validTill?: string;

  @ApiProperty({ description: 'Created by user ID', example: 160 })
  @IsNumber()
  @IsOptional()
  createdBy?: number;

  @ApiProperty({
    description: 'Modified on date',
    example: null,
    nullable: true,
  })
  @IsString()
  @IsOptional()
  modifiedOn?: string;

  @ApiProperty({ description: 'Quote tax exempt status', example: false })
  @IsBoolean()
  @IsOptional()
  QuoteTaxExempt?: boolean;

  @ApiProperty({ description: 'Payment amount', example: '4007.00' })
  @IsString()
  @IsOptional()
  PaymentAmount?: string;
}

export class UpdateQuoteDto extends CreateQuoteDto {
  @IsInt()
  @IsOptional()
  modBy?: number;
}

export class CloneQuoteDto {
  @IsInt()
  @IsNotEmpty()
  quoteNo: number;

  @IsInt()
  @IsNotEmpty()
  userId: number;
}

export class GetQuoteCSVDto {
  @IsString()
  @IsNotEmpty()
  from: string;
  @IsString()
  @IsNotEmpty()
  to: string;
}

export class QuoteSearchParamsDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  page?: string;

  @IsString()
  @IsOptional()
  @Type(() => String)
  size?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => String)
  isGlobal?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => String)
  isIndividual?: string;

  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  company?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  total?: string;

  @IsOptional()
  @IsString()
  createdBy?: string;

  @IsOptional()
  @IsDateString()
  quoteDate?: string;
}

export class QuoteSearchBodyDto {
  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsOptional()
  products: string;
}
