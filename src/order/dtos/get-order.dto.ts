import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsInt,
  IsDateString,
  IsNumber,
  IsDate,
} from 'class-validator';

export class DatesDto {
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;
}

export class GetOrdersCsvDto {
  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;

  @IsBoolean()
  @IsOptional()
  isIndividual?: boolean;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  orderStatus?: string;

  @IsString()
  @IsOptional()
  total?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsDateString()
  @IsOptional()
  orderDate?: string;

  @IsDateString()
  @IsOptional()
  shipDate?: string;

  @IsString()
  @IsOptional()
  shippedBy?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsString()
  @IsOptional()
  sortColumn?: string;

  @IsString()
  @IsOptional()
  sortOrder?: string;

  @IsString()
  @IsOptional()
  serialNo?: string;

  @IsOptional()
  dates?: DatesDto;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  productCode?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];

  @IsString()
  @IsOptional()
  tag_type?: string;
}

export class GetOrdersByStatusDto {
  @IsBoolean()
  @IsOptional()
  isGlobal?: boolean;

  @IsBoolean()
  @IsOptional()
  isIndividual?: boolean;

  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  createdBy?: string;

  @IsString()
  @IsOptional()
  orderStatus?: string;

  @IsString()
  @IsOptional()
  total?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsDateString()
  @IsOptional()
  orderDate?: string;

  @IsDateString()
  @IsOptional()
  shipDate?: string;

  @IsString()
  @IsOptional()
  shippedBy?: string;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsString()
  @IsOptional()
  sortColumn?: string;

  @IsString()
  @IsOptional()
  sortOrder?: string;

  @IsString()
  @IsOptional()
  serialNo?: string;

  @IsOptional()
  dates?: DatesDto;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  productCode?: number[];

  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  tags?: number[];

  @IsString()
  @IsOptional()
  tag_type?: string;
}

export class GetOrdersDto {
  @IsString()
  @IsOptional()
  duration?: string;

  @IsDateString()
  @IsOptional()
  startTime?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

  @IsBoolean()
  @IsOptional()
  openStatus?: boolean;
}

export class GetOrdersByOpenStatusResponseDto {
  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsBoolean()
  @IsOptional()
  IsPayed?: boolean;

  @IsString()
  @IsOptional()
  OrderEntrySystem?: string;

  @IsString()
  @IsOptional()
  OrderNotes?: string;

  @IsString()
  @IsOptional()
  BillingAddress1?: string;

  @IsString()
  @IsOptional()
  BillingAddress2?: string;

  @IsString()
  @IsOptional()
  PONum?: string;

  @IsString()
  @IsOptional()
  BillingCity?: string;

  @IsString()
  @IsOptional()
  BillingCompanyName?: string;

  @IsString()
  @IsOptional()
  BillingCountry?: string;

  @IsString()
  @IsOptional()
  BillingFaxNumber?: string;

  @IsString()
  @IsOptional()
  BillingFirstName?: string;

  @IsString()
  @IsOptional()
  BillingLastName?: string;

  @IsString()
  @IsOptional()
  BillingPhoneNumber?: string;

  @IsString()
  @IsOptional()
  BillingPostalCode?: string;

  @IsString()
  @IsOptional()
  BillingState?: string;

  @IsString()
  @IsOptional()
  OrderComments?: string;

  @IsString()
  @IsOptional()
  ShipAddress1?: string;

  @IsString()
  @IsOptional()
  ShipAddress2?: string;

  @IsString()
  @IsOptional()
  ShipCity?: string;

  @IsString()
  @IsOptional()
  ShipCompanyName?: string;

  @IsString()
  @IsOptional()
  ShipCountry?: string;

  @IsDate()
  @IsOptional()
  ShipDate?: Date;

  @IsDate()
  @IsOptional()
  CancelDate?: Date;

  @IsString()
  @IsOptional()
  ShipFaxNumber?: string;

  @IsString()
  @IsOptional()
  ShipFirstName?: string;

  @IsString()
  @IsOptional()
  ShipLastName?: string;

  @IsBoolean()
  @IsOptional()
  Shipped?: boolean;

  @IsString()
  @IsOptional()
  ShipPhoneNumber?: string;

  @IsString()
  @IsOptional()
  ShipPostalCode?: string;

  @IsString()
  @IsOptional()
  ShipState?: string;

  @IsString()
  @IsOptional()
  CreatedByBlueFirstName?: string;

  @IsString()
  @IsOptional()
  CreatedByBlueLastName?: string;

  @IsString()
  @IsOptional()
  CreatedByVoluFirstName?: string;

  @IsString()
  @IsOptional()
  CreatedByVoluLastName?: string;

  @IsString()
  @IsOptional()
  OrderSerials?: string;

  @IsInt()
  OrderID: number;

  @IsInt()
  @IsOptional()
  QuoteNo?: number;

  @IsDate()
  @IsOptional()
  QuoteDate?: Date;

  @IsDate()
  @IsOptional()
  InvoiceableOn?: Date;

  @IsString()
  @IsOptional()
  CustomerID?: number;

  @IsString()
  @IsOptional()
  OrderStatus?: string;

  @IsNumber()
  PaymentAmount: number;

  @IsString()
  @IsOptional()
  CompanyName?: string;

  @IsString()
  @IsOptional()
  FirstName?: string;

  @IsString()
  @IsOptional()
  LastName?: string;

  @IsString()
  @IsOptional()
  City?: string;

  @IsDate()
  @IsOptional()
  OrderDate?: Date;

  @IsBoolean()
  @IsOptional()
  OldOrder?: boolean;
}

export class GetTrackShippingDto {
  @IsInt()
  orderId: number;

  @IsInt()
  shippingId: number;
}

export class TrackShippingLineItemDto {
  @IsInt()
  id: number;

  @IsInt()
  trackShippingId: number;

  @IsInt()
  @IsOptional()
  orderId?: number;

  @IsInt()
  @IsOptional()
  QtyOnPackingSlip?: number;

  @IsInt()
  @IsOptional()
  ProductId?: number;

  @IsBoolean()
  @IsOptional()
  isChild?: boolean;

  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}

export class GetTrackShippingResponseDto {
  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsBoolean()
  @IsOptional()
  isCategoriesOption?: boolean;

  @IsBoolean()
  @IsOptional()
  isChild?: boolean;

  @IsString()
  @IsOptional()
  ProductName?: string;

  @IsInt()
  @IsOptional()
  OptionID?: number;

  @IsBoolean()
  @IsOptional()
  IsCustomerNameShow?: boolean;

  @IsString()
  @IsOptional()
  OrderComments?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  OrderNotes?: string;

  @IsString()
  @IsOptional()
  PrivateNotes?: string;

  @IsString()
  @IsOptional()
  ShipEmailAddress?: string;

  @IsString()
  @IsOptional()
  PONum?: string;

  @IsString()
  @IsOptional()
  TrackingNo?: string;

  @IsInt()
  @IsOptional()
  CustomerID?: number;

  @IsInt()
  OrderID: number;

  @IsString()
  @IsOptional()
  Incoterm?: string;

  @IsString()
  @IsOptional()
  ModifiedByBlueFirstName?: string;

  @IsString()
  @IsOptional()
  ModifiedByBlueLastName?: string;

  @IsString()
  @IsOptional()
  CreatedByBlueFirstName?: string;

  @IsString()
  @IsOptional()
  CreatedByBlueLastName?: string;

  @IsString()
  @IsOptional()
  CreatedByVoluFirstName?: string;

  @IsString()
  @IsOptional()
  CreatedByVoluLastName?: string;

  @IsString()
  @IsOptional()
  OrderStatus?: string;

  @IsString()
  @IsOptional()
  OrderType?: string;

  @IsInt()
  @IsOptional()
  ShippingMethodID?: number;

  @IsNumber()
  PaymentAmount: number;

  @IsString()
  @IsOptional()
  CustomerCompany?: string;

  @IsString()
  @IsOptional()
  ShipCompanyName?: string;

  @IsString()
  @IsOptional()
  ShipFirstName?: string;

  @IsString()
  @IsOptional()
  ShipLastName?: string;

  @IsString()
  @IsOptional()
  CustomerFName?: string;

  @IsString()
  @IsOptional()
  CustomerLName?: string;

  @IsDate()
  @IsOptional()
  OrderDate?: Date;

  @IsString()
  @IsOptional()
  OrderDatePDF?: string;

  @IsString()
  @IsOptional()
  BillingStreetAddress1?: string;

  @IsString()
  @IsOptional()
  BillingStreetAddress2?: string;

  @IsString()
  @IsOptional()
  BillingCity1?: string;

  @IsString()
  @IsOptional()
  BillingCountry1?: string;

  @IsString()
  @IsOptional()
  BillingState?: string;

  @IsString()
  @IsOptional()
  BillingPhoneNumber?: string;

  @IsString()
  @IsOptional()
  BillingPostalCode?: string;

  @IsString()
  @IsOptional()
  ShipAddress1?: string;

  @IsString()
  @IsOptional()
  ShipAddress2?: string;

  @IsString()
  @IsOptional()
  ShipCity?: string;

  @IsString()
  @IsOptional()
  ShipCountry?: string;

  @IsString()
  @IsOptional()
  ShipState?: string;

  @IsString()
  @IsOptional()
  ShipPhoneNumber?: string;

  @IsString()
  @IsOptional()
  ShipPostalCode?: string;

  @IsString()
  @IsOptional()
  gpn?: string;

  @IsNumber()
  @IsOptional()
  SalesTaxRate1?: number;

  @IsNumber()
  @IsOptional()
  SalesTax1?: number;

  @IsBoolean()
  @IsOptional()
  IsCustomerEmailShow?: boolean;

  @IsArray()
  @IsInt({ each: true })
  tagIds: number[];

  @IsArray()
  notesHistory: NoteHistoryDto[];

  @IsInt()
  id: number;

  @IsInt()
  trackShippingId: number;

  @IsInt()
  @IsOptional()
  ProductId?: number;

  @IsInt()
  @IsOptional()
  QtyOnPackingSlip?: number;

  @IsDate()
  @IsOptional()
  createdAt?: Date;
}

export class NoteHistoryDto {
  @IsString()
  @IsOptional()
  OrderComments?: string;

  @IsString()
  @IsOptional()
  OrderNotes?: string;

  @IsString()
  @IsOptional()
  firstname?: string;

  @IsString()
  @IsOptional()
  lastname?: string;

  @IsDate()
  @IsOptional()
  LastModified?: Date;
}

export class GetOrderBySerialDto {
  @IsString()
  serialNo: string;
}

export class OrderDetailBySerialResponseDto {
  @IsString()
  @IsOptional()
  Options?: string;

  @IsInt()
  @IsOptional()
  QtyOnPackingSlip?: number;

  @IsInt()
  @IsOptional()
  QtyShipped?: number;

  @IsInt()
  @IsOptional()
  QtyOnBackOrder?: number;

  @IsInt()
  @IsOptional()
  shippedQty?: number;

  @IsInt()
  @IsOptional()
  parent?: number;

  @IsString()
  @IsOptional()
  parentName?: string;

  @IsString()
  @IsOptional()
  ProductSerials?: string;

  @IsBoolean()
  @IsOptional()
  isChild?: boolean;

  @IsBoolean()
  @IsOptional()
  isCategoriesOption?: boolean;

  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsString()
  @IsOptional()
  ProductName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @IsOptional()
  Qty?: number;

  @IsNumber()
  @IsOptional()
  Price?: number;

  @IsNumber()
  @IsOptional()
  Discount?: number;
}

export class GetOrderBySerialResponseDto {
  @IsString()
  @IsOptional()
  OrderEntrySystem?: string;

  @IsBoolean()
  @IsOptional()
  IsPayed?: boolean;

  @IsNumber()
  @IsOptional()
  TotalPaymentReceived?: number;

  @IsString()
  @IsOptional()
  CreatedByBlueFirstName?: string;

  @IsString()
  @IsOptional()
  CreatedByBlueLastName?: string;

  @IsString()
  @IsOptional()
  CreatedByVoluFirstName?: string;

  @IsString()
  @IsOptional()
  CreatedByVoluLastName?: string;

  @IsString()
  @IsOptional()
  OrderSerials?: string;

  @IsDate()
  @IsOptional()
  InvoiceableOn?: Date;

  @IsString()
  @IsOptional()
  OrderStatus?: string;

  @IsString()
  @IsOptional()
  OrderType?: string;

  @IsInt()
  @IsOptional()
  ShippingMethodID?: number;

  @IsString()
  @IsOptional()
  PrivateNotes?: string;

  @IsNumber()
  @IsOptional()
  Freight?: number;

  @IsBoolean()
  @IsOptional()
  OldOrder?: boolean;

  @IsNumber()
  @IsOptional()
  TaxShipping?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  IsCustomerNameShow?: boolean;

  @IsInt()
  OrderID: number;

  @IsInt()
  @IsOptional()
  CustomerID?: number;

  @IsNumber()
  PaymentAmount: number;

  @IsString()
  @IsOptional()
  CustomerCompany?: string;

  @IsString()
  @IsOptional()
  ShipCompanyName?: string;

  @IsString()
  @IsOptional()
  ShipFirstName?: string;

  @IsString()
  @IsOptional()
  ShipLastName?: string;

  @IsString()
  @IsOptional()
  CustomerFName?: string;

  @IsString()
  @IsOptional()
  CustomerLName?: string;

  @IsDate()
  @IsOptional()
  OrderDate?: Date;

  @IsString()
  @IsOptional()
  BillingStreetAddress1?: string;

  @IsString()
  @IsOptional()
  BillingStreetAddress2?: string;

  @IsString()
  @IsOptional()
  BillingCity1?: string;

  @IsString()
  @IsOptional()
  BillingCountry1?: string;

  @IsString()
  @IsOptional()
  BillingState?: string;

  @IsString()
  @IsOptional()
  BillingPhoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  IsTaxExempt?: boolean;

  @IsString()
  @IsOptional()
  BillingPostalCode?: string;

  @IsString()
  @IsOptional()
  ShipAddress1?: string;

  @IsString()
  @IsOptional()
  ShipAddress2?: string;

  @IsString()
  @IsOptional()
  ShipCity?: string;

  @IsString()
  @IsOptional()
  ShipCountry?: string;

  @IsString()
  @IsOptional()
  ShipState?: string;

  @IsString()
  @IsOptional()
  ShipPhoneNumber?: string;

  @IsString()
  @IsOptional()
  ShipPostalCode?: string;

  @IsNumber()
  @IsOptional()
  SalesTaxRate1?: number;

  @IsNumber()
  @IsOptional()
  SalesTax1?: number;

  @IsBoolean()
  @IsOptional()
  IsCustomerEmailShow?: boolean;

  orderDetails: OrderDetailBySerialResponseDto[];
}

export class GetOpenOrderByProductIdDto {
  @IsInt()
  productId: number;
}

export class GetOpenOrderByProductIdResponseDto {
  @IsString()
  @IsOptional()
  ProductCode?: string;

  @IsBoolean()
  @IsOptional()
  IsPayed?: boolean;

  @IsString()
  @IsOptional()
  OrderEntrySystem?: string;

  @IsString()
  @IsOptional()
  BillingAddress1?: string;

  @IsString()
  @IsOptional()
  BillingAddress2?: string;

  @IsString()
  @IsOptional()
  PONum?: string;

  @IsString()
  @IsOptional()
  BillingCity?: string;

  @IsString()
  @IsOptional()
  BillingCompanyName?: string;

  @IsString()
  @IsOptional()
  BillingCountry?: string;

  @IsString()
  @IsOptional()
  BillingFaxNumber?: string;

  @IsString()
  @IsOptional()
  BillingFirstName?: string;

  @IsString()
  @IsOptional()
  BillingLastName?: string;

  @IsString()
  @IsOptional()
  BillingPhoneNumber?: string;

  @IsString()
  @IsOptional()
  BillingPostalCode?: string;

  @IsString()
  @IsOptional()
  BillingState?: string;

  @IsString()
  @IsOptional()
  OrderComments?: string;

  @IsString()
  @IsOptional()
  ShipAddress1?: string;

  @IsString()
  @IsOptional()
  ShipAddress2?: string;

  @IsString()
  @IsOptional()
  ShipCity?: string;

  @IsString()
  @IsOptional()
  ShipCompanyName?: string;

  @IsString()
  @IsOptional()
  ShipCountry?: string;

  @IsDate()
  @IsOptional()
  ShipDate?: Date;

  @IsString()
  @IsOptional()
  ShipFaxNumber?: string;

  @IsString()
  @IsOptional()
  ShipFirstName?: string;

  @IsString()
  @IsOptional()
  ShipLastName?: string;

  @IsBoolean()
  @IsOptional()
  Shipped?: boolean;

  @IsString()
  @IsOptional()
  ShipPhoneNumber?: string;

  @IsString()
  @IsOptional()
  ShipPostalCode?: string;

  @IsString()
  @IsOptional()
  ShipState?: string;

  @IsString()
  @IsOptional()
  OrderNotes?: string;

  @IsString()
  @IsOptional()
  CreatedByBlueFirstName?: string;

  @IsString()
  @IsOptional()
  CreatedByBlueLastName?: string;

  @IsString()
  @IsOptional()
  CreatedByVoluFirstName?: string;

  @IsString()
  @IsOptional()
  CreatedByVoluLastName?: string;

  @IsString()
  @IsOptional()
  OrderSerials?: string;

  @IsInt()
  OrderID: number;

  @IsString()
  @IsOptional()
  QuoteNo?: string;

  @IsDate()
  @IsOptional()
  QuoteDate?: Date;

  @IsDate()
  @IsOptional()
  InvoiceableOn?: Date;

  @IsString()
  @IsOptional()
  CustomerID?: number;

  @IsString()
  @IsOptional()
  OrderStatus?: string;

  @IsNumber()
  PaymentAmount: number;

  @IsString()
  @IsOptional()
  CompanyName?: string;

  @IsString()
  @IsOptional()
  FirstName?: string;

  @IsString()
  @IsOptional()
  LastName?: string;

  @IsDate()
  @IsOptional()
  OrderDate?: Date;

  @IsString()
  @IsOptional()
  City?: string;

  @IsString()
  @IsOptional()
  EmailAddress?: string;

  @IsBoolean()
  @IsOptional()
  OldOrder?: boolean;
}

export class DeleteFileDto {
  @IsInt()
  id: number;
}

export class DeleteFileResponseDto {
  success: boolean;
  affectedRows: number;
}

export class GetBackOrderDto {
  @IsArray()
  @IsInt({ each: true })
  productCodes: number[];
}

export class GetBackOrderResponseDto {
  @IsString()
  @IsOptional()
  class?: string;

  @IsString()
  @IsOptional()
  subclass?: string;

  @IsString()
  ProductCode: string;

  @IsInt()
  @IsOptional()
  ProductID?: number;

  @IsBoolean()
  @IsOptional()
  backlog_show?: boolean;

  @IsDate()
  @IsOptional()
  backlog_leadtime?: Date;

  @IsString()
  @IsOptional()
  backlog_comments?: string;

  @IsNumber()
  @IsOptional()
  backlog_priority?: number;

  @IsDate()
  @IsOptional()
  updatedDateBacklogComment?: Date;

  @IsBoolean()
  @IsOptional()
  IsActive?: boolean;

  @IsNumber()
  @IsOptional()
  unallocated?: number;

  @IsNumber()
  @IsOptional()
  allocated?: number;

  @IsNumber()
  @IsOptional()
  open?: number;

  @IsString()
  @IsOptional()
  Order_Comments?: string;
}

export class UpdateOrderDto {
  @IsInt()
  OrderID: number;

  @IsString()
  @IsOptional()
  quoteNo?: string;

  @IsString()
  @IsOptional()
  orderStatus?: string;

  @IsDate()
  @IsOptional()
  orderDate?: Date;

  @IsInt()
  @IsOptional()
  customerId?: number;

  @IsInt()
  @IsOptional()
  shippingMethodId?: number;

  @IsNumber()
  @IsOptional()
  totalShippingCost?: number;

  @IsDate()
  @IsOptional()
  shipDate?: Date;

  @IsInt()
  @IsOptional()
  shippedBy?: number;

  @IsInt()
  @IsOptional()
  lastModBy?: number;

  @IsString()
  @IsOptional()
  ccLast4?: string;

  @IsString()
  @IsOptional()
  orderEntrySystem?: string;

  @IsString()
  @IsOptional()
  orderComments?: string;

  @IsString()
  @IsOptional()
  orderNotes?: string;

  @IsString()
  @IsOptional()
  poNum?: string;

  @IsString()
  @IsOptional()
  billingLastName?: string;

  @IsString()
  @IsOptional()
  billingFirstName?: string;

  @IsString()
  @IsOptional()
  shipCompanyName?: string;

  @IsString()
  @IsOptional()
  shipFirstName?: string;

  @IsString()
  @IsOptional()
  shipLastName?: string;

  @IsString()
  @IsOptional()
  billingCompanyName?: string;

  @IsNumber()
  @IsOptional()
  paymentAmount?: number;

  @IsString()
  @IsOptional()
  orderType?: string;

  @IsString()
  @IsOptional()
  orderSerials?: string;

  @IsInt()
  @IsOptional()
  salesRepCustomerId?: number;

  @IsBoolean()
  @IsOptional()
  isPayed?: boolean;

  @IsString()
  @IsOptional()
  billingAddress1?: string;

  @IsString()
  @IsOptional()
  billingAddress2?: string;

  @IsString()
  @IsOptional()
  billingCity?: string;

  @IsString()
  @IsOptional()
  billingCountry?: string;

  @IsString()
  @IsOptional()
  billingFaxNumber?: string;

  @IsString()
  @IsOptional()
  billingPhoneNumber?: string;

  @IsString()
  @IsOptional()
  billingPostalCode?: string;

  @IsString()
  @IsOptional()
  shipAddress1?: string;

  @IsString()
  @IsOptional()
  shipAddress2?: string;

  @IsString()
  @IsOptional()
  shipCity?: string;

  @IsString()
  @IsOptional()
  shipFaxNumber?: string;

  @IsString()
  @IsOptional()
  shipPhoneNumber?: string;

  @IsString()
  @IsOptional()
  shipPostalCode?: string;

  @IsString()
  @IsOptional()
  shipState?: string;

  @IsBoolean()
  @IsOptional()
  shipped?: boolean;

  @IsDate()
  @IsOptional()
  cancelDate?: Date;

  @IsDate()
  @IsOptional()
  invoiceableOn?: Date;

  @IsBoolean()
  @IsOptional()
  oldOrder?: boolean;

  @IsString()
  @IsOptional()
  shipEmailAddress?: string;

  @IsNumber()
  @IsOptional()
  insuranceValue?: number;

  @IsInt()
  @IsOptional()
  endUserId?: number;

  @IsString()
  @IsOptional()
  trackingNo?: string;

  @IsString()
  @IsOptional()
  incoterm?: string;

  @IsString()
  @IsOptional()
  creditCardAuthorizationHash?: string;

  @IsString()
  @IsOptional()
  customFieldCarrierAcctNo?: string;

  @IsBoolean()
  @IsOptional()
  orderTaxExempt?: boolean;

  @IsNumber()
  @IsOptional()
  totalPaymentReceived?: number;

  @IsNumber()
  @IsOptional()
  currentCustomerDiscount?: number;

  @IsBoolean()
  @IsOptional()
  isCustomerNameShow?: boolean;

  @IsBoolean()
  @IsOptional()
  isCustomerEmailShow?: boolean;

  @IsNumber()
  @IsOptional()
  salesTaxRate1?: number;

  @IsNumber()
  @IsOptional()
  salesTaxRate2?: number;

  @IsNumber()
  @IsOptional()
  salesTaxRate3?: number;

  @IsNumber()
  @IsOptional()
  salesTax1?: number;

  @IsNumber()
  @IsOptional()
  salesTax2?: number;

  @IsNumber()
  @IsOptional()
  salesTax3?: number;

  @IsString()
  @IsOptional()
  privateNotes?: string;

  @IsDate()
  @IsOptional()
  lastModified?: Date;
}

export class UpdateOrderResponseDto {
  @IsBoolean()
  status: boolean;

  @IsString()
  msg: string;
}

export class OrderTrackingInputDto {
  @IsString()
  @IsOptional()
  trackingnumber?: string;

  @IsString()
  @IsOptional()
  gateway?: string;

  @IsDate()
  @IsOptional()
  shipdate?: Date;

  @IsInt()
  @IsOptional()
  orderid?: number;

  @IsNumber()
  @IsOptional()
  shipment_cost?: number;

  @IsInt()
  @IsOptional()
  shippingmethodid?: number;

  @IsString()
  @IsOptional()
  package?: string;

  @IsString()
  @IsOptional()
  form?: string;
}

export class ImportOrderFileDto {
  @IsArray()
  data: OrderTrackingInputDto[];
}

export class ImportOrderFileResponseDto {
  @IsBoolean()
  status: boolean;

  @IsString()
  @IsOptional()
  msg?: string;

  @IsOptional()
  error?: any;
}
