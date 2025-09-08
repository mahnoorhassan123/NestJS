import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderDetailDto {
  @IsNumber()
  OnOrder_Qty: number;

  @IsNumber()
  ProductWeight: number;

  @IsNumber()
  QtyOnBackOrder: number;

  @IsNumber()
  QtyOnPackingSlip: number;

  @IsNumber()
  QtyShipped: number;

  @IsString()
  @IsNotEmpty()
  CountryOfOrigin: string;

  @IsNumber()
  DiscountValue: number;

  @IsString()
  @IsNotEmpty()
  Discription: string;

  @IsString()
  @IsNotEmpty()
  ExportControlClassificationNumber: string;

  @IsString()
  @IsNotEmpty()
  HarmonizedCode: string;

  @IsNumber()
  OptionID: number;

  @IsString()
  OptionIDs: string;

  @IsString()
  Options: string;

  @IsString()
  @IsNotEmpty()
  ProductCode: string;

  @IsNumber()
  ProductID: number;

  @IsString()
  @IsNotEmpty()
  ProductName: string;

  @IsNumber()
  ProductPrice: number;

  @IsString()
  ProductSerials: string;

  @IsString()
  @IsNotEmpty()
  Product_Subclass: string;

  @IsNumber()
  Quantity: number;

  @IsDateString()
  ShipDate: string;

  @IsString()
  @IsNotEmpty()
  TaxableProduct: string;

  @IsNumber()
  TotalPrice: number;

  @IsString()
  @IsNotEmpty()
  UnitOfMeasure: string;

  @IsNumber()
  categoryIdOfOption: number;

  @IsBoolean()
  isCategoriesOption: boolean;

  @IsBoolean()
  isChild: boolean;

  @IsNumber()
  isMultiClassification: number;

  @IsString()
  @IsNotEmpty()
  parentName: string;

  @IsNumber()
  qutantityForTrackToShipped: number;
}

export class CreateOrderDto {
  @IsNumber()
  Affiliate_Commissionable_Value: number;

  @IsNumber()
  @IsOptional()
  QuoteNo: number;

  @IsNumber()
  @IsOptional()
  OrderID: number;

  @IsString()
  @IsNotEmpty()
  BillingAddress1: string;

  @IsString()
  @IsOptional()
  BillingAddress2: string;

  @IsString()
  @IsNotEmpty()
  BillingCity: string;

  @IsString()
  @IsOptional()
  BillingCompanyName: string;

  @IsString()
  @IsNotEmpty()
  BillingCountry: string;

  @IsString()
  @IsNotEmpty()
  BillingFirstName: string;

  @IsString()
  @IsNotEmpty()
  BillingLastName: string;

  @IsString()
  @IsNotEmpty()
  BillingPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  BillingPostalCode: string;

  @IsString()
  @IsNotEmpty()
  BillingState: string;

  @IsOptional()
  @IsDateString()
  CancelDate: string | null;

  @IsNumber()
  CurrentCustomerDiscount: number;

  @IsNumber()
  CustomerID: number;

  @IsString()
  @IsNotEmpty()
  Incoterm: string;

  @IsDateString()
  InvoiceableOn: string;

  @IsString()
  @IsNotEmpty()
  IsAGift: string;

  @IsBoolean()
  IsCustomerEmailShow: boolean;

  @IsBoolean()
  IsCustomerNameShow: boolean;

  @IsBoolean()
  IsGTSOrder: boolean;

  @IsBoolean()
  IsPayed: boolean;

  @IsNumber()
  IsTaxExempt: number;

  @IsDateString()
  OrderDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  OrderDetails: OrderDetailDto[];

  @IsString()
  OrderNotes: string;

  @IsString()
  OrderSerials: string;

  @IsString()
  @IsNotEmpty()
  OrderStatus: string;

  @IsBoolean()
  OrderTaxExempt: boolean;

  @IsString()
  Order_Comments: string;

  @IsString()
  @IsNotEmpty()
  Order_Entry_System: string;

  @IsString()
  @IsNotEmpty()
  Order_Type: string;

  @IsNumber()
  PaymentAmount: number;

  @IsNumber()
  PaymentMethodID: number;

  @IsString()
  @IsNotEmpty()
  Printed: string;

  @IsNumber()
  SalesRep_CustomerID: number;

  @IsNumber()
  SalesTax1: number;

  @IsNumber()
  SalesTaxRate1: number;

  @IsString()
  @IsNotEmpty()
  ShipAddress1: string;

  @IsString()
  @IsOptional()
  ShipAddress2: string;

  @IsString()
  @IsNotEmpty()
  ShipCity: string;

  @IsString()
  @IsOptional()
  ShipCompanyName: string;

  @IsString()
  @IsNotEmpty()
  ShipCountry: string;

  @IsOptional()
  @IsDateString()
  ShipDate: string | null;

  @IsString()
  @IsNotEmpty()
  ShipEmailAddress: string;

  @IsString()
  @IsNotEmpty()
  ShipFirstName: string;

  @IsString()
  @IsNotEmpty()
  ShipLastName: string;

  @IsString()
  @IsNotEmpty()
  ShipPhoneNumber: string;

  @IsString()
  @IsNotEmpty()
  ShipPostalCode: string;

  @IsString()
  @IsNotEmpty()
  ShipResidential: string;

  @IsString()
  @IsNotEmpty()
  ShipState: string;

  @IsString()
  @IsNotEmpty()
  Shipped: string;

  @IsNumber()
  
  ShippedBy: number;

  @IsString()
  @IsNotEmpty()
  ShippingMethodID: string;

  @IsNumber()
  Stock_Priority: number;

  @IsString()
  @IsNotEmpty()
  Tax1_Title: string;

  @IsOptional()
  @IsString()
  TaxExemptionId: string | null;

  @IsNumber()
  TotalShippingCost: number;

  @IsNumber()
  Total_Payment_Authorized: number;

  @IsNumber()
  Total_Payment_Received: number;

  @IsNumber()
  UserId: number;

  @IsString()
  @IsNotEmpty()
  endUserId: string;
  
  
  @IsArray()
  @IsString({ each: true })
  tagsArray: string[];
}
