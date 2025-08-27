import { BlobOptions } from 'buffer';
import { IsArray, IsBoolean, IsInt, IsNumber, IsString, IsOptional } from 'class-validator';

export class OrderDetailDto {
  @IsInt()
  OnOrder_Qty: number;

  @IsNumber()
  ProductWeight: number;

  @IsInt()
  QtyOnBackOrder: number;

  @IsInt()
  QtyOnPackingSlip: number;

  @IsInt()
  QtyShipped: number;
}

export class CreateOrderDto {
  @IsNumber()
  Affiliate_Commissionable_Value: number;

  @IsString()
  BillingAddress1: string;

  @IsString()
  @IsOptional()
  BillingAddress2?: string;

  @IsString()
  BillingCity: string;

  @IsString()
  @IsOptional()
  BillingCompanyName?: string;

  @IsString()
  BillingCountry: string;

  @IsString()
  BillingFirstName: string;

  @IsString()
  BillingLastName: string;

  @IsString()
  BillingPhoneNumber: string;

  @IsString()
  BillingPostalCode: string;

  @IsString()
  BillingState: string;

  @IsString()
  CancelDate: string;

  @IsNumber()
  CurrentCustomerDiscount: number;

  @IsInt()
  CustomerID: number;

  @IsString()
  Incoterm: string;

  @IsString()
  InvoiceableOn: string;

  @IsString()
  IsAGift: string;

  @IsBoolean()
  IsCustomerEmailShow: boolean;

  @IsBoolean()
  IsCustomerNameShow: boolean;

  @IsBoolean()
  IsGTSOrder: boolean;

  @IsBoolean()
  IsPayed: boolean;

  @IsBoolean()
  IsTaxExempt: boolean;

  @IsString()
  OrderDate: string;

  @IsArray()
  OrderDetails: OrderDetailDto[];

  @IsString()
  OrderNotes: string;

  @IsString()
  OrderSerials: string;

  @IsString()
  OrderStatus: string;

  @IsBoolean()
  OrderTaxExempt: boolean;

  @IsString()
  Order_Comments: string;

  @IsString()
  Order_Entry_System: string;

  @IsString()
  Order_Type: string;

  @IsString()
  PONum: string;

  @IsNumber()
  PaymentAmount: number;

  @IsInt()
  PaymentMethodID: number;

  @IsString()
  Printed: string;

  @IsInt()
  SalesRep_CustomerID: number;

  @IsNumber()
  SalesTax1: number;

  @IsNumber()
  SalesTaxRate1: number;

  @IsString()
  ShipAddress1: string;

  @IsString()
  @IsOptional()
  ShipAddress2?: string;

  @IsString()
  ShipCity: string;

  @IsString()
  @IsOptional()
  ShipCompanyName?: string;

  @IsString()
  ShipCountry: string;

  @IsString()
 
  ShipDate: string;

  @IsString()
  ShipEmailAddress: string;

  @IsString()
  ShipFirstName: string;

  @IsString()
  ShipLastName: string;

  @IsString()
  ShipPhoneNumber: string;

  @IsString()
  ShipPostalCode: string;

  @IsString()
  ShipResidential: string;

  @IsString()
  ShipState: string;

  @IsBoolean()
  Shipped: boolean;

  @IsInt()
  ShippedBy: number;

  @IsInt()
  ShippingMethodID: number;

  @IsInt()
  Stock_Priority: number;

  @IsString()
  Tax1_Title: string;

  @IsString()
  @IsOptional()
  TaxExemptionId?: string;

  @IsNumber()
  TotalShippingCost: number;

  @IsNumber()
  Total_Payment_Authorized: number;

  @IsNumber()
  Total_Payment_Received: number;

  @IsString()
  TrackingNo: string;

  @IsInt()
  UserId: number;

  @IsString()
  endUserId: string;

  @IsNumber()
  insuranceValue: number;

  @IsArray()
  tagsArray: string[];
}

export class UpdateOrderDto extends CreateOrderDto {
  @IsInt()
  OrderID: number;
}