import {
  Order as PrismaOrder,
  OrdersSnapshot as PrismaOrderSnapshot,
  OrderDetailsSnapshots as PrismaOrderDetailSnapshot,
  Order,
} from '@prisma/client';

export interface MappedOrder {
  Order_Entry_System: string;
  ShipEmailAddress: string;
  InsuranceValue: number;
  endUserId: string | null;
  PONum: string | null;
  TrackingNo: string | null;
  Incoterm: string | null;
  CreditCardAuthorizationHash: string | null;
  QuoteNo: number | null;
  Order_Comments: string | null;
  Custom_Field_CarrierAcctNo: string | null;
  IsPayed: true | false;
  LastModBy: number | null;
  OptionID: number | null;
  categoryIdOfOption: string | null;
  LastModified: string | null;
  OrderTaxExempt: true | false;
  UserId: number | null;
  Total_Payment_Received: number | null;
  CurrentCustomerDiscount: number;
  Options: string | null;
  Product_Subclass: string | null;
  TaxableProduct: string | null;
  QtyOnPackingSlip: number | null;
  QtyShipped: number | null;
  QtyOnBackOrder: number | null;
  shippedQty: string;
  parent: string | null;
  parentName: string | null;
  ProductSerials: string | null;
  isChild: true | false;
  isCategoriesOption: true | false;
  ModifiedByBlueFirstName: string;
  ModifiedByBlueLastName: string;
  CreatedByBlueFirstName: string;
  CreatedByBlueLastName: string;
  CreatedByVoluFirstName: string;
  CreatedByVoluLastName: string;
  OrderSerials: string | null;
  InvoiceableOn: string | null;
  OrderStatus: string | null;
  Order_Type: string;
  ShippingMethodID: number | null;
  PrivateNotes: string | null;
  Freight: number | null;
  OldOrder: true | false;
  TaxShipping: number;
  TotalTax: number;
  notes: string | null;
  OrderNotes: string | null;
  IsCustomerNameShow: true | false;
  OrderID: number;
  CustomerID: number | null;
  PaymentAmount: number;
  CustomerCompany: string | null;
  ShipCompanyName: string | null;
  ShipFirstName: string | null;
  ShipLastName: string | null;
  CustomerFName: string | null;
  CustomerLName: string | null;
  OrderDate: string | null;
  BillingStreetAddress1: string | null;
  BillingStreetAddress2: string | null;
  BillingCity1: string | null;
  BillingCountry1: string | null;
  BillingState: string | null;
  BillingPhoneNumber: string | null;
  IsTaxExempt: true | false;
  BillingPostalCode: string | null;
  ShipAddress1: string | null;
  ShipAddress2: string | null;
  ShipCity: string | null;
  ShipCountry: string | null;
  ShipState: string | null;
  ShipPhoneNumber: string | null;
  ShipPostalCode: string | null;
  SalesTaxRate1: number;
  SalesTax1: number | null;
  IsCustomerEmailShow: true | false;
  ProductCode: string | null;
  ProductName: string | null;
  description: string | null;
  HarmonizedCode: string | null;
  ExportControlClassificationNumber: string;
  ProductWeight: number | null;
  UnitOfMeasure: string | null;
  CountryOfOrigin: string;
  ExportDescription: string | null;
  Qty: number | null;
  Price: number | null;
  Discount: number;
  gpn: string | null;
  tagIds: string[];
  notesHistory: {
    Order_Comments: string | null;
    OrderNotes: string | null;
    firstname: string;
    lastname: string;
    LastModified: string | undefined;
  }[];
  OrderDatePDF: string;
}

interface OrderQueryResult {
  id: number;
  orderEntrySystem?: string | null;
  shipEmailAddress?: string | null;
  insuranceValue?: number | null;
  endUserId?: number | null;
  poNum?: string | null;
  trackingNo?: string | null;
  incoterm?: string | null;
  creditCardAuthorizationHash?: string | null;
  quoteNo?: number | null;
  orderComments?: string | null;
  customFieldCarrierAcctNo?: string | null;
  isPayed?: boolean | null;
  lastModBy?: number | null;
  lastModified?: string | null;
  orderTaxExempt?: boolean | null;
  userId?: number | null;
  totalPaymentReceived?: number | null;
  currentCustomerDiscount?: number;
  orderSerials?: string | null;
  invoiceableOn?: Date | null;
  orderStatus?: string | null;
  orderType?: string | null;
  shippingMethodId?: number | null;
  totalShippingCost?: number | null;
  oldOrder?: boolean | null;
  salesTaxRate1?: number | null;
  salesTaxRate2?: number | null;
  salesTaxRate3?: number | null;
  salesTax1?: number | null;
  salesTax2?: number | null;
  salesTax3?: number | null;
  isCustomerNameShow?: boolean | null;
  customerId?: number | null;
  paymentAmount?: number | null;
  billingCompanyName?: string | null;
  shipCompanyName?: string | null;
  shipFirstName?: string | null;
  shipLastName?: string | null;
  billingFirstName?: string | null;
  billingLastName?: string | null;
  orderDate?: string | null;
  billingAddress1?: string | null;
  billingAddress2?: string | null;
  billingCity?: string | null;
  billingCountry?: string | null;
  billingState?: string | null;
  billingPhoneNumber?: string | null;
  isTaxExempt?: boolean | null;
  billingPostalCode?: string | null;
  shipAddress1?: string | null;
  shipAddress2?: string | null;
  shipCity?: string | null;
  shipCountry?: string | null;
  shipState?: string | null;
  shipPhoneNumber?: string | null;
  shipPostalCode?: string | null;
  orderNotes?: string | null;
  isCustomerEmailShow?: boolean | null;
  customer?: {
    email?: string | null;
    company?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  } | null;
  orderedBy?: { firstname?: string | null; lastname?: string | null } | null;
  modifiedBy?: { firstname?: string | null; lastname?: string | null } | null;
  salesRep?: { firstName?: string | null; lastName?: string | null } | null;
  tagTable?: { tagId: number | null }[];
  snapshots?:
    | {
        Order_Comments?: string | null;
        PrivateNotes?: string | null;
        OrderNotes?: string | null;
        LastModified?: string | null;
        modifiedBy?: {
          firstname?: string | null;
          lastname?: string | null;
        } | null;
      }[]
    | null;
  orderDetails?:
    | (OrderDetail & {
        product?: { gpn?: string | null } | null;
        shippedQty?: number;
      })[]
    | null;
}

interface OrderDetail {
  optionId?: number | null;
  categoryIdOfOption?: string | null;
  options?: string | null;
  productSubClass?: string | null;
  taxableProduct?: string | null;
  qtyOnPackingSlip?: number | null;
  qtyShipped?: number | null;
  qtyOnBackOrder?: number | null;
  parent?: string | null;
  parentName?: string | null;
  productSerials?: string | null;
  isChild?: boolean | null;
  isCategoriesOption?: boolean | null;
  productCode?: string | null;
  productName?: string | null;
  description?: string | null;
  harmonizedCode?: string | null;
  exportControlClassificationNumber?: string | null;
  productWeight?: number | null;
  unitOfMeasure?: string | null;
  countryOfOrigin?: string | null;
  exportDescription?: string | null;
  quantity?: number | null;
  productPrice?: number | null;
  discountValue?: number | null;
  productId?: number | null;
}
export class orderMappers {
  static mapToInsert(input: any): any {
    return {
      id: input.OrderID ? Number(input.OrderID) : 1,
      orderDate: input.OrderDate,
      invoiceableOn: input.InvoiceableOn,
      affiliateCommissionableValue: input.AffiliateCommissionableValue,

      orderStatus: input.OrderStatus || undefined,
      userId: input.UserId,
      // modifiedBy: { connect: { id: input.LastModBy } },
      trackingNo: input.TrackingNo,
      shippingMethodId: input.ShippingMethodId,
      totalShippingCost: input.TotalShippingCost,
      // customer: { connect: { id: input.CustomerId } },
      // salesRep: { connect: { id: input.SalesRepCustomerId } },
      // endUser: { connect: { id: input.EndUserId } },
      billingFirstName: input.BillingFirstName || undefined,
      billingLastName: input.BillingLastName || undefined,
      billingCompanyName: input.BillingCompanyName || undefined,
      billingAddress1: input.BillingAddress1 || undefined,
      billingAddress2: input.BillingAddress2 || undefined,
      billingCity: input.BillingCity || undefined,
      billingState: input.BillingState || undefined,
      billingPostalCode: input.BillingPostalCode || undefined,
      billingCountry: input.BillingCountry || undefined,
      billingPhoneNumber: input.BillingPhoneNumber || undefined,
      shipFirstName: input.ShipFirstName || undefined,
      shipLastName: input.ShipLastName || undefined,
      shipCompanyName: input.ShipCompanyName || undefined,
      shipAddress1: input.ShipAddress1 || undefined,
      shipAddress2: input.ShipAddress2 || undefined,
      shipCity: input.ShipCity || undefined,
      shipState: input.ShipState || undefined,
      shipPostalCode: input.ShipPostalCode || undefined,
      shipCountry: input.ShipCountry || undefined,
      shipPhoneNumber: input.ShipPhoneNumber || undefined,
      shipEmailAddress: input.ShipEmailAddress || undefined,
      orderComments: input.OrderComments || undefined,
      orderNotes: input.OrderNotes || undefined,
      poNum: input.poNum || undefined,
      paymentAmount: input.PaymentAmount,
      paymentMethodId: input.PaymentMethodId,
      salesTaxRate1: input.SalesTaxRate1,
      salesTax1: input.SalesTax1,
      salesTaxRate2: input.SalesTaxRate2,
      salesTax2: input.SalesTax2,
      salesTaxRate3: input.SalesTaxRate3,
      salesTax3: input.SalesTax3,
      isPayed: input.IsPayed,
      isTaxExempt: Boolean(input.IsTaxExempt),
      orderType: input.OrderType || undefined,
      orderSerials: input.OrderSerials || undefined,
      isAGift: input.IsAGift || undefined,
      insuranceValue: input.InsuranceValue,
      incoterm: input.Incoterm,
      taxExemptionId: input.TaxExemptionId,
      totalPaymentReceived: input.TotalPaymentReceived,
      currentCustomerDiscount: input.CurrentCustomerDiscount,
      isCustomerNameShow: input.IsCustomerNameShow !== undefined,
      isCustomerEmailShow: input.IsCustomerEmailShow !== undefined,
      isGTSOrder: input.IsGTSOrder === 'false' ? 'N' : 'Y',
      shipResidential: input.ShipResidential,
      shipped: input.Shipped.toString(),
      stockPriority: input.StockPriority,
      tax1Title: input.Tax1Title,
      totalPaymentAuthorized: input.TotalPaymentAuthorized,
    };
  }

  static mapOrderDetailToInsert(input: any): any {
    return {
      orderId: Number(input.OrderID),
      // productId: Number(input.productId),
      productCode: input.productCode,
      description: input.description,
      qtyOnPackingSlip: Number(input.qtyOnPackingSlip),
      isChild: Boolean(input.isChild),
      displayOrder: Number(input.displayOrder),
      productName: input.productName,
      productWeight: Number(input.productWeight),
      quantity: Number(input.quantity),
      taxableProduct: String(input.taxableProduct),
      qtyShipped: Number(input.qtyShipped),
      qtyOnBackOrder: Number(input.qtyOnBackOrder),
    };
  }

  static mapOrdersByStatus(
    order,
    totalCount: number,
    tagName: string,
    paymentAmountSum: number,
  ) {
    return {
      IsPayed: order.isPayed ?? false,
      Order_Entry_System: order.orderEntrySystem ?? '',
      OrderStatus: order.orderStatus ?? '',
      OldOrder: order.oldOrder ?? false,
      OrderID: order.id ?? 0,
      LastName: order.orderedBy?.lastname ?? '',
      FirstName: order.orderedBy?.firstname ?? '',
      EmailAddress: order.customer?.email ?? '',
      BillingCompanyName: order.billingCompanyName ?? '',
      ShipCompanyName: order.shipCompanyName ?? '',
      CompanyName: order.customer?.company ?? '',
      ShipCountry: order.shipCountry ?? '',
      CreatedByBlueFirstName: order.customer?.firstname ?? '',
      CreatedByBlueLastName: order.customer?.lastname ?? '',
      CreatedByVoluLastName: order.createdBy?.firstname ?? '',
      CreatedByVoluFirstName: order.createdBy?.lastname ?? '',
      OrderDate: order.orderDate ?? '',
      ShipDate: order.shipDate ?? '',
      PaymentAmount: order.paymentAmount ?? 0,
      ShippedByFirstName: order.shippedByUser?.firstname ?? '',
      ShippedByLastName: order.shippedByUser?.lastname ?? '',
      totalAmount: paymentAmountSum ?? 0,
      count: totalCount ?? 0,
    };
  }

  static mapOrdersByOpenStatus(order): any {
    return {
      ProductCode: order.orderDetails
        .map((detail) => detail.productCode)
        .join(','), // Combine multiple ProductCodes
      IsPayed: order.isPayed,
      OrderNotes: order.orderNotes,
      BillingAddress1: order.billingAddress1,
      BillingAddress2: order.billingAddress2,
      PONum: order.poNum,
      BillingCity: order.billingCity,
      BillingCompanyName: order.billingCompanyName,
      BillingCountry: order.billingCountry,
      BillingFaxNumber: order.billingFaxNumber,
      BillingFirstName: order.billingFirstName,
      BillingLastName: order.billingLastName,
      BillingPhoneNumber: order.billingPhoneNumber,
      BillingPostalCode: order.billingPostalCode,
      BillingState: order.billingState,
      Order_Comments: order.orderComments,
      ShipAddress1: order.shipAddress1,
      ShipAddress2: order.shipAddress2,
      ShipCity: order.shipCity,
      ShipCompanyName: order.shipCompanyName,
      ShipCountry: order.shipCountry,
      ShipDate: order.shipDate,
      CancelDate: order.cancelDate,
      ShipFaxNumber: order.shipFaxNumber,
      ShipFirstName: order.shipFirstName,
      ShipLastName: order.shipLastName,
      Shipped: order.shipped,
      ShipPhoneNumber: order.shipPhoneNumber,
      ShipPostalCode: order.shipPostalCode,
      ShipState: order.shipState,
      Order_Entry_System: order.orderEntrySystem,
      OrderSerials: order.orderSerials,
      OldOrder: order.oldOrder,
      OrderID: order.id,
      QuoteNo: order.quoteNo,
      QuoteDate: order.quote?.quoteDate,
      InvoiceableOn: order.invoiceableOn,
      CustomerID: order.customerId,
      OrderStatus: order.orderStatus,
      PaymentAmount: order.paymentAmount,
      CompanyName: order.billingCompanyName,
      FirstName: order.billingFirstName,
      LastName: order.billingLastName,
      OrderDate: order.orderDate,
      City: order.billingCity,
      EmailAddress: order.customer?.email,
      CreatedByBlueFirstName: order.orderedBy?.firstname,
      CreatedByBlueLastName: order.orderedBy?.lastname,
      CreatedByVoluFirstName: order.salesRep?.firstName,
      CreatedByVoluLastName: order.salesRep?.lastName,
    };
  }

  static mapGetOrders(order): any {
    return {
      IsPayed: order.isPayed,
      OrderNotes: order.orderNotes,
      BillingAddress1: order.billingAddress1,
      BillingAddress2: order.billingAddress2,
      PONum: order.poNum,
      orderDetails: order.orderDetails,
      BillingCity: order.billingCity,
      BillingCompanyName: order.billingCompanyName,
      BillingCountry: order.billingCountry,
      BillingFaxNumber: order.billingFaxNumber,
      BillingFirstName: order.billingFirstName,
      BillingLastName: order.billingLastName,
      BillingPhoneNumber: order.billingPhoneNumber,
      BillingPostalCode: order.billingPostalCode,
      BillingState: order.billingState,
      Order_Comments: order.orderComments,
      ShipAddress1: order.shipAddress1,
      ShipAddress2: order.shipAddress2,
      ShipCity: order.shipCity,
      ShipCompanyName: order.shipCompanyName,
      ShipCountry: order.shipCountry,
      ShipDate: order.shipDate,
      CancelDate: order.cancelDate,
      ShipFaxNumber: order.shipFaxNumber,
      ShipFirstName: order.shipFirstName,
      ShipLastName: order.shipLastName,
      Shipped: order.shipped,
      ShipPhoneNumber: order.shipPhoneNumber,
      ShipPostalCode: order.shipPostalCode,
      ShipState: order.shipState,
      Order_Entry_System: order.orderEntrySystem,
      OrderSerials: order.orderSerials,
      OldOrder: order.oldOrder,
      OrderID: order.id,
      QuoteNo: order.quoteNo,
      QuoteDate: order.quote?.quoteDate,
      InvoiceableOn: order.invoiceableOn,
      CustomerID: order.customerId,
      OrderStatus: order.orderStatus,
      PaymentAmount: order.paymentAmount,
      CompanyName: order.billingCompanyName,
      FirstName: order.billingFirstName,
      LastName: order.billingLastName,
      OrderDate: order.orderDate,
      City: order.billingCity,
      EmailAddress: order.customer?.email,
      CreatedByBlueFirstName: order.orderedBy?.firstname,
      CreatedByBlueLastName: order.orderedBy?.lastname,
      CreatedByVoluFirstName: order.salesRep?.firstName,
      CreatedByVoluLastName: order.salesRep?.lastName,
    };
  }

  static mapGetOrdersCSV(order: any): any {
    return {
      ProductCode: order.orderDetails
        .map((detail) => detail.productCode)
        .join(','),
      IsPayed: order.isPayed,
      OrderNotes: order.orderNotes,
      BillingAddress1: order.billingAddress1,
      BillingAddress2: order.billingAddress2,
      PONum: order.poNum,
      BillingCity: order.billingCity,
      BillingCompanyName: order.billingCompanyName,
      BillingCountry: order.billingCountry,
      BillingFaxNumber: order.billingFaxNumber,
      BillingFirstName: order.billingFirstName,
      BillingLastName: order.billingLastName,
      BillingPhoneNumber: order.billingPhoneNumber,
      BillingPostalCode: order.billingPostalCode,
      BillingState: order.billingState,
      Order_Comments: order.orderComments,
      ShipAddress1: order.shipAddress1,
      ShipAddress2: order.shipAddress2,
      ShipCity: order.shipCity,
      ShipCompanyName: order.shipCompanyName,
      ShipCountry: order.shipCountry,
      ShipDate: order.shipDate,
      CancelDate: order.cancelDate,
      ShipFaxNumber: order.shipFaxNumber,
      ShipFirstName: order.shipFirstName,
      ShipLastName: order.shipLastName,
      Shipped: order.shipped,
      ShipPhoneNumber: order.shipPhoneNumber,
      ShipPostalCode: order.shipPostalCode,
      ShipState: order.shipState,
      Order_Entry_System: order.orderEntrySystem,
      OrderSerials: order.orderSerials,
      OldOrder: order.oldOrder,
      OrderID: order.id,
      QuoteNo: order.quoteNo,
      QuoteDate: order.quote?.quoteDate,
      InvoiceableOn: order.invoiceableOn,
      CustomerID: order.customerId,
      OrderStatus: order.orderStatus,
      PaymentAmount: order.paymentAmount,
      CompanyName: order.billingCompanyName,
      FirstName: order.billingFirstName,
      LastName: order.billingLastName,
      OrderDate: order.orderDate,
      City: order.billingCity,
      EmailAddress: order.customer?.email,
      CreatedByBlueFirstName: order.orderedBy?.firstname,
      CreatedByBlueLastName: order.orderedBy?.lastname,
      CreatedByVoluFirstName: order.salesRep?.firstName,
      CreatedByVoluLastName: order.salesRep?.lastName,
      tagName: order.tagTable
        .map((tt) => {
          let name = tt.tag?.title || '';
          const changeText = name.indexOf('-');
          if (changeText !== -1) {
            name = name.substring(changeText + 1).trim();
          }
          return name;
        })
        .join(','),
    };
  }

  static mapGetOrdersProductsCSV(order): any {
    return {
      ProductCode: order.orderDetails
        .map((detail) => detail.productCode)
        .join(','),
      ProductID: order.orderDetails.map((detail) => detail.productId).join(','),
      IsPayed: order.isPayed,
      OrderNotes: order.orderNotes,
      BillingAddress1: order.billingAddress1,
      BillingAddress2: order.billingAddress2,
      PONum: order.poNum,
      BillingCity: order.billingCity,
      BillingCompanyName: order.billingCompanyName,
      BillingCountry: order.billingCountry,
      BillingFaxNumber: order.billingFaxNumber,
      BillingFirstName: order.billingFirstName,
      BillingLastName: order.billingLastName,
      BillingPhoneNumber: order.billingPhoneNumber,
      BillingPostalCode: order.billingPostalCode,
      BillingState: order.billingState,
      Order_Comments: order.orderComments,
      ShipAddress1: order.shipAddress1,
      ShipAddress2: order.shipAddress2,
      ShipCity: order.shipCity,
      ShipCompanyName: order.shipCompanyName,
      ShipCountry: order.shipCountry,
      ShipDate: order.shipDate,
      CancelDate: order.cancelDate,
      ShipFaxNumber: order.shipFaxNumber,
      ShipFirstName: order.shipFirstName,
      ShipLastName: order.shipLastName,
      Shipped: order.shipped,
      ShipPhoneNumber: order.shipPhoneNumber,
      ShipPostalCode: order.shipPostalCode,
      ShipState: order.shipState,
      Order_Entry_System: order.orderEntrySystem,
      OrderSerials: order.orderSerials,
      OldOrder: order.oldOrder,
      OrderID: order.id,
      QuoteNo: order.quoteNo,
      QuoteDate: order.quote?.quoteDate,
      InvoiceableOn: order.invoiceableOn,
      CustomerID: order.customerId,
      OrderStatus: order.orderStatus,
      PaymentAmount: order.paymentAmount,
      CompanyName: order.billingCompanyName,
      FirstName: order.billingFirstName,
      LastName: order.billingLastName,
      OrderDate: order.orderDate,
      City: order.billingCity,
      EmailAddress: order.customer?.email,
      CreatedByBlueFirstName: order.orderedBy?.firstname,
      CreatedByBlueLastName: order.orderedBy?.lastname,
      CreatedByVoluFirstName: order.salesRep?.firstName,
      CreatedByVoluLastName: order.salesRep?.lastName,
      tagName: order.tagTable
        .map((tt) => {
          let name = tt.tag?.title || '';
          const changeText = name.indexOf('-');
          if (changeText !== -1) {
            name = name.substring(changeText + 1).trim();
          }
          return name;
        })
        .join(','),
    };
  }
  static mapOrderDetails(detail): any {
    return {
      OptionID: detail.optionId,
      productId: detail.productId,
      categoryIdOfOption: detail.categoryIdOfOption,
      Options: detail.options,
      ProductSubClass: detail.productSubClass,
      TaxableProduct: detail.taxableProduct,
      QtyOnPackingSlip: detail.qtyOnPackingSlip,
      QtyShipped: detail.qtyShipped,
      QtyOnBackOrder: detail.qtyOnBackOrder,
      shippedQty: 0, // Computed below
      parent: detail.parent,
      parentName: detail.parentName,
      ProductSerials: detail.productSerials,
      isChild: detail.isChild,
      isCategoriesOption: detail.isCategoriesOption,
      ProductCode: detail.productCode,
      ProductName: detail.productName,
      description: detail.description,
      HarmonizedCode: detail.harmonizedCode,
      ExportControlClassificationNumber:
        detail.exportControlClassificationNumber,
      ProductWeight: detail.productWeight,
      UnitOfMeasure: detail.unitOfMeasure,
      CountryOfOrigin: detail.countryOfOrigin,
      ExportDescription: detail.exportDescription,
      Qty: detail.quantity,
      Price: detail.productPrice,
      Discount: detail.discountValue,
      gpn: detail.product?.gpn,
    };
  }

  static mapGetOrderOld(order, notes, orderDetails): any {
    return {
      OrderEntrySystem: order.orderEntrySystem || '',
      ShipEmailAddress: order.shipEmailAddress || '',
      InsuranceValue: order.insuranceValue,
      endUserId: order.endUserId,
      PONum: order.poNum || '',
      TrackingNo: order.trackingNo || '',
      Incoterm: order.incoterm || '',
      CreditCardAuthorizationHash: order.creditCardAuthorizationHash || '',
      CustomFieldCarrierAcctNo: order.customFieldCarrierAcctNo || '',
      IsPayed: order.isPayed || false,
      LastModBy: order.lastModBy,
      LastModified: order.lastModified
        ? new Date(order.lastModified)
        : undefined,
      OrderTaxExempt: order.orderTaxExempt || false,
      UserId: order.orderedBy?.id,
      TotalPaymentReceived: order.totalPaymentReceived,
      CurrentCustomerDiscount: order.currentCustomerDiscount,
      IsCustomerNameShow: order.isCustomerNameShow || false,
      OrderID: order.id,
      QuoteNo: order.quote?.quoteNo,
      OrderComments: order.orderComments || '',
      notes: order.orderComments || '',
      OrderNotes: order.orderNotes || '',
      //   PrivateNotes: order.privateNotes || '',
      PaymentAmount: order.paymentAmount || 0,
      CustomerCompany: order.billingCompanyName || '',
      ShipCompanyName: order.shipCompanyName || '',
      ShipFirstName: order.shipFirstName || '',
      ShipLastName: order.shipLastName || '',
      CustomerFName: order.billingFirstName || '',
      CustomerLName: order.billingLastName || '',
      OrderDate: order.orderDate ? new Date(order.orderDate) : undefined,
      OrderDatePDF: order.orderDate
        ? new Date(order.orderDate).toISOString().split('T')[0]
        : '',
      BillingStreetAddress1: order.billingAddress1 || '',
      BillingStreetAddress2: order.billingAddress2 || '',
      BillingCity1: order.billingCity || '',
      BillingCountry1: order.billingCountry || '',
      BillingState: order.billingState || '',
      BillingPhoneNumber: order.billingPhoneNumber || '',
      IsTaxExempt: order.orderTaxExempt || false,
      BillingPostalCode: order.billingPostalCode || '',
      ShipAddress1: order.shipAddress1 || '',
      ShipAddress2: order.shipAddress2 || '',
      ShipCity: order.shipCity || '',
      ShipCountry: order.shipCountry || '',
      ShipState: order.shipState || '',
      ShipPhoneNumber: order.shipPhoneNumber || '',
      ShipPostalCode: order.shipPostalCode || '',
      SalesTaxRate1:
        (order.salesTaxRate1 || 0) +
        (order.salesTaxRate2 || 0) +
        (order.salesTaxRate3 || 0),
      SalesTax1: order.salesTax1,
      IsCustomerEmailShow: order.isCustomerEmailShow || false,
      ModifiedByBlueFirstName: order.modifiedBy?.firstname || '',
      ModifiedByBlueLastName: order.modifiedBy?.lastname || '',
      CreatedByBlueFirstName: order.orderedBy?.firstname || '',
      CreatedByBlueLastName: order.orderedBy?.lastname || '',
      CreatedByVoluFirstName: order.salesRep?.firstName || '',
      CreatedByVoluLastName: order.salesRep?.lastName || '',
      OrderSerials: order.orderSerials || '',
      invoiceableOn: order.invoiceableOn
        ? new Date(order.invoiceableOn)
        : undefined,
      OrderStatus: order.orderStatus || '',
      OrderType: order.orderType || '',
      ShippingMethodID: order.shippingMethodId,
      Freight: order.totalShippingCost,
      OldOrder: order.oldOrder ?? false,
      TaxShipping:
        (order.salesTaxRate1 || 0) +
        (order.salesTaxRate2 || 0) +
        (order.salesTaxRate3 || 0),
      TotalTax:
        (order.salesTax1 || 0) +
        (order.salesTax2 || 0) +
        (order.salesTax3 || 0),
      CustomerID: order.customerId,
      tagIds: order.tagTable?.map((tt) => tt.tagId) || [],
      notesHistory: notes,
      orderDetails: orderDetails,
    };
  }

  static mapGetOrderBySerial(order) {
    return {
      OrderEntrySystem: order.orderEntrySystem || '',
      IsPayed: order.isPayed || false,
      TotalPaymentReceived: order.totalPaymentReceived || 0,
      CreatedByBlueFirstName: order.orderedBy?.firstname || '',
      CreatedByBlueLastName: order.orderedBy?.lastname || '',
      CreatedByVoluFirstName: order.salesRep?.firstName || '',
      CreatedByVoluLastName: order.salesRep?.lastName || '',
      OrderSerials: order.orderSerials || '',
      invoiceableOn: order.invoiceableOn
        ? new Date(order.invoiceableOn)
        : undefined,
      OrderStatus: order.orderStatus || '',
      OrderType: order.orderType || '',
      ShippingMethodID: order.shippingMethodId || 0,
      //   PrivateNotes: order.privateNotes || '',
      Freight: order.totalShippingCost || 0,
      OldOrder: order.oldOrder || false,
      TaxShipping:
        (order.salesTaxRate1 || 0) +
        (order.salesTaxRate2 || 0) +
        (order.salesTaxRate3 || 0),
      notes: order.orderComments || '',
      IsCustomerNameShow: order.isCustomerNameShow || false,
      OrderID: order.id,
      CustomerID: order.customerId || 0,
      PaymentAmount: order.paymentAmount || 0,
      CustomerCompany: order.billingCompanyName || '',
      ShipCompanyName: order.shipCompanyName || '',
      ShipFirstName: order.shipFirstName || '',
      ShipLastName: order.shipLastName || '',
      CustomerFName: order.billingFirstName || '',
      CustomerLName: order.billingLastName || '',
      OrderDate: order.orderDate ? new Date(order.orderDate) : undefined,
      BillingStreetAddress1: order.billingAddress1 || '',
      BillingStreetAddress2: order.billingAddress2 || '',
      BillingCity1: order.billingCity || '',
      BillingCountry1: order.billingCountry || '',
      BillingState: order.billingState || '',
      BillingPhoneNumber: order.billingPhoneNumber || '',
      IsTaxExempt: order.orderTaxExempt || false,
      BillingPostalCode: order.billingPostalCode || '',
      ShipAddress1: order.shipAddress1 || '',
      ShipAddress2: order.shipAddress2 || '',
      ShipCity: order.shipCity || '',
      ShipCountry: order.shipCountry || '',
      ShipState: order.shipState || '',
      ShipPhoneNumber: order.shipPhoneNumber || '',
      ShipPostalCode: order.shipPostalCode || '',
      SalesTaxRate1:
        (order.salesTaxRate1 || 0) +
        (order.salesTaxRate2 || 0) +
        (order.salesTaxRate3 || 0),
      SalesTax1: order.salesTax1 || 0,
      IsCustomerEmailShow: order.isCustomerEmailShow || false,
      orderDetails: order.orderDetails.map((detail) => ({
        productId: detail.productId,
        Options: detail.options,
        QtyOnPackingSlip: detail.qtyOnPackingSlip,
        QtyShipped: detail.qtyShipped,
        QtyOnBackOrder: detail.qtyOnBackOrder,
        shippedQty: 0, // Computed below
        parent: detail.parent,
        parentName: detail.parentName,
        ProductSerials: detail.productSerials,
        isChild: detail.isChild,
        isCategoriesOption: detail.isCategoriesOption,
        ProductCode: detail.productCode,
        ProductName: detail.productName,
        description: detail.description,
        Qty: detail.quantity,
        Price: detail.productPrice,
        Discount: detail.discountValue,
      })),
    };
  }

  static mapGetTrackShipping(tracking, orders, matchedOrderDetail, notes) {
    return {
      ProductCode: tracking.productCode || '',
      isCategoriesOption: matchedOrderDetail?.isCategoriesOption || false,
      isChild: tracking.isChild || false,
      ProductName: matchedOrderDetail?.productName || '',
      OptionID: matchedOrderDetail?.optionId,
      IsCustomerNameShow: orders[0].isCustomerNameShow || false,
      OrderComments: orders[0].orderComments || '',
      notes: orders[0].orderComments || '',
      OrderNotes: orders[0].orderNotes || '',
      // PrivateNotes: orders[0].privateNotes || '',
      ShipEmailAddress: orders[0].shipEmailAddress || '',
      PONum: orders[0].poNum || '',
      TrackingNo: orders[0].trackingNo || '',
      CustomerID: orders[0].customerId,
      OrderID: orders[0].id,
      Incoterm: orders[0].incoterm || '',
      ModifiedByBlueFirstName: orders[0].modifiedBy?.firstname || '',
      ModifiedByBlueLastName: orders[0].modifiedBy?.lastname || '',
      CreatedByBlueFirstName: orders[0].orderedBy?.firstname || '',
      CreatedByBlueLastName: orders[0].orderedBy?.lastname || '',
      CreatedByVoluFirstName: orders[0].salesRep?.firstName || '',
      CreatedByVoluLastName: orders[0].salesRep?.lastName || '',
      OrderStatus: orders[0].orderStatus || '',
      OrderType: orders[0].orderType || '',
      ShippingMethodID: orders[0].shippingMethodId,
      PaymentAmount: orders[0].paymentAmount || 0,
      CustomerCompany: orders[0].billingCompanyName || '',
      ShipCompanyName: orders[0].shipCompanyName || '',
      ShipFirstName: orders[0].shipFirstName || '',
      ShipLastName: orders[0].shipLastName || '',
      CustomerFName: orders[0].billingFirstName || '',
      CustomerLName: orders[0].billingLastName || '',
      OrderDate: orders[0].orderDate
        ? new Date(orders[0].orderDate)
        : undefined,
      OrderDatePDF: orders[0].orderDate
        ? new Date(orders[0].orderDate).toISOString().split('T')[0]
        : '',
      BillingStreetAddress1: orders[0].billingAddress1 || '',
      BillingStreetAddress2: orders[0].billingAddress2 || '',
      BillingCity1: orders[0].billingCity || '',
      BillingCountry1: orders[0].billingCountry || '',
      BillingState: orders[0].billingState || '',
      BillingPhoneNumber: orders[0].billingPhoneNumber || '',
      BillingPostalCode: orders[0].billingPostalCode || '',
      ShipAddress1: orders[0].shipAddress1 || '',
      ShipAddress2: orders[0].shipAddress2 || '',
      ShipCity: orders[0].shipCity || '',
      ShipCountry: orders[0].shipCountry || '',
      ShipState: orders[0].shipState || '',
      ShipPhoneNumber: orders[0].shipPhoneNumber || '',
      ShipPostalCode: orders[0].shipPostalCode || '',
      gpn: matchedOrderDetail?.product?.gpn || '',
      SalesTaxRate1:
        (orders[0].salesTaxRate1 || 0) +
        (orders[0].salesTaxRate2 || 0) +
        (orders[0].salesTaxRate3 || 0),
      SalesTax1: orders[0].salesTax1,
      IsCustomerEmailShow: orders[0].isCustomerEmailShow || false,
      tagIds: orders[0].tagTable?.map((tt) => tt.tagId) || [],
      notesHistory: notes,
      id: tracking.id,
      trackShippingId: tracking.trackShippingId,
      ProductId: tracking.productId,
      QtyOnPackingSlip: tracking.quantity,
      createdAt: tracking.createdAt ? new Date(tracking.createdAt) : undefined,
    };
  }

  static mapGetOpenOrdersByProductId(order) {
    return {
      ProductCode: order.orderDetails[0]?.productCode || '',
      IsPayed: order.isPayed || false,
      OrderEntrySystem: order.orderEntrySystem || '',
      BillingAddress1: order.billingAddress1 || '',
      BillingAddress2: order.billingAddress2 || '',
      PONum: order.poNum || '',
      BillingCity: order.billingCity || '',
      BillingCompanyName: order.billingCompanyName || '',
      BillingCountry: order.billingCountry || '',
      BillingFaxNumber: order.billingFaxNumber || '',
      BillingFirstName: order.billingFirstName || '',
      BillingLastName: order.billingLastName || '',
      BillingPhoneNumber: order.billingPhoneNumber || '',
      BillingPostalCode: order.billingPostalCode || '',
      BillingState: order.billingState || '',
      OrderComments: order.orderComments || '',
      ShipAddress1: order.shipAddress1 || '',
      ShipAddress2: order.shipAddress2 || '',
      ShipCity: order.shipCity || '',
      ShipCompanyName: order.shipCompanyName || '',
      ShipCountry: order.shipCountry || '',
      ShipDate: order.shipDate ? new Date(order.shipDate) : undefined,
      ShipFaxNumber: order.shipFaxNumber || '',
      ShipFirstName: order.shipFirstName || '',
      ShipLastName: order.shipLastName || '',
      Shipped: order.shipped || false,
      ShipPhoneNumber: order.shipPhoneNumber || '',
      ShipPostalCode: order.shipPostalCode || '',
      ShipState: order.shipState || '',
      OrderNotes: order.orderNotes || '',
      CreatedByBlueFirstName: order.orderedBy?.firstname || '',
      CreatedByBlueLastName: order.orderedBy?.lastname || '',
      CreatedByVoluFirstName: order.salesRep?.firstName || '',
      CreatedByVoluLastName: order.salesRep?.lastName || '',
      OrderSerials: order.orderSerials || '',
      OrderID: order.id,
      QuoteNo: order.quote?.id || '',
      QuoteDate: order.quote?.quoteDate
        ? new Date(order.quote.quoteDate)
        : undefined,
      invoiceableOn: order.invoiceableOn
        ? new Date(order.invoiceableOn)
        : undefined,
      CustomerID: order.customerId?.toString(),
      OrderStatus: order.orderStatus || '',
      PaymentAmount: order.paymentAmount || 0,
      CompanyName: order.billingCompanyName || '',
      FirstName: order.billingFirstName || '',
      LastName: order.billingLastName || '',
      OrderDate: order.orderDate ? new Date(order.orderDate) : undefined,
      City: order.billingCity || '',
      EmailAddress: order.customer?.email || '',
      OldOrder: order.oldOrder || false,
    };
  }

  static mapGetOrderTrack(result) {
    return {
      Id: result.id,
      TrackingNo: result.trackingNo,
      Gateway: result.gateway,
      ShipDate: result.shipDate,
      OrderId: result,
      ShipmentCost: 1,
      ShippingMethodID: 701,
      Package: null,
      Form: null,
      IsImported: 0,
      OrderType: 'Shipped',
      updatedBy: 160,
      id: 73909,
      trackShippingId: 33710,
      orderId: 70469,
      quantity: 1,
      productId: 200542,
      productCode: 'DB26-2-DB25-DB9-RJ45-CABLE',
      productDescription:
        '<p id=\\\\\\"details\\\\\\">Converts the HD-26F connector on DB26 #2 (Fire 3), neoVI FIRE2, and RAD-Gigastar to DB-25M, DB-9 and RJ-45 (Ethernet) connectors. Compatible with neoVI FIRE3 (2nd DB26), RAD-Gigastar, neoVI Fire 2, Fire 2 VNET.</p>\n',
      isChild: 1,
      displayOrder: 5,
      createdAt: '2025-08-27T12:29:15.000Z',
      createdBy: 160,
      updatedAt: '2025-08-27T12:29:15.000Z',
      countOfLineItems: '6',
    };
  }

  static mapOrderSnapshotToPrisma(orderData): PrismaOrderSnapshot {
    return {
      endUser_id: orderData.endUserId ?? 1,
      OrderID: orderData.OrderID,
      AccountNumber: orderData.AccountNumber,
      AccountType: orderData.AccountType,
      AddressValidated: orderData.AddressValidated,
      Affiliate_Commissionable_Value: orderData.Affiliate_Commissionable_Value,
      OrderTaxExempt: orderData.OrderTaxExempt,
      AuthHash: orderData.AuthHash,
      AVS: orderData.AVS,
      BankName: orderData.BankName,
      BatchNumber: orderData.BatchNumber,
      BillingAddress1: orderData.BillingAddress1,
      BillingAddress2: orderData.BillingAddress2,
      BillingCity: orderData.BillingCity,
      BillingCompanyName: orderData.BillingCompanyName,
      BillingCountry: orderData.BillingCountry,
      BillingFaxNumber: orderData.BillingFaxNumber,
      BillingFirstName: orderData.BillingFirstName,
      BillingLastName: orderData.BillingLastName,
      BillingPhoneNumber: orderData.BillingPhoneNumber,
      BillingPostalCode: orderData.BillingPostalCode,
      BillingState: orderData.BillingState,
      CancelDate: orderData.CancelDate,
      CancelReason: orderData.CancelReason,
      CardHoldersName: orderData.CardHoldersName,
      CashTender: orderData.CashTender,
      CC_Last4: orderData.CC_Last4,
      CheckNumber: orderData.CheckNumber,
      CreditCardAuthorizationDate: orderData.CreditCardAuthorizationDate,
      CreditCardAuthorizationNumber: orderData.CreditCardAuthorizationNumber,
      CreditCardExpDate: orderData.CreditCardExpDate,
      CreditCardIssueDate: orderData.CreditCardIssueDate,
      CreditCardIssueNumber: orderData.CreditCardIssueNumber,
      CreditCardTransactionID: orderData.CreditCardTransactionID,
      CreditCardAuthorizationHash: orderData.CreditCardAuthorizationHash,
      Custom_Field_CarrierAcctNo: orderData.Custom_Field_CarrierAcctNo,
      Custom_Field_Custom2: orderData.Custom_Field_Custom2,
      Custom_Field_Custom3: orderData.Custom_Field_Custom3,
      Custom_Field_Custom4: orderData.Custom_Field_Custom4,
      Custom_Field_Custom5: orderData.Custom_Field_Custom5,
      Customer_IPAddress: orderData.Customer_IPAddress,
      CustomerID: orderData.CustomerID,
      CVV2_Response: orderData.CVV2_Response,
      DV_CreditCardNumber: orderData.DV_CreditCardNumber,
      GiftCardIDUsed: orderData.GiftCardIDUsed,
      GiftWrapNote: orderData.GiftWrapNote,
      InitiallyShippedDate: orderData.InitiallyShippedDate,
      IsAGift: orderData.IsAGift,
      IsGTSOrder: orderData.IsGTSOrder,
      LastModBy: orderData.LastModBy,
      LastModified: orderData.LastModified,
      Locked: orderData.Locked,
      MICR: orderData.MICR,
      Order_Comments: orderData.Order_Comments,
      Order_Entry_System: orderData.Order_Entry_System,
      OrderDate: orderData.OrderDate,
      InvoiceableOn: orderData.InvoiceableOn
        ? new Date(orderData.InvoiceableOn)
        : null,
      OrderDateUtc: orderData.OrderDateUtc,
      OrderID_Third_Party: orderData.OrderID_Third_Party,
      OrderID_Third_Party_Link: orderData.OrderID_Third_Party_Link,
      OrderNotes: orderData.OrderNotes,
      OrderStatus: orderData.OrderStatus,
      PaymentAmount: orderData.PaymentAmount,
      PaymentDeclined: orderData.PaymentDeclined,
      PaymentMethodID: orderData.PaymentMethodID,
      PCIaaS_CardId: orderData.PCIaaS_CardId,
      PCIaaS_MaskedCardRef: orderData.PCIaaS_MaskedCardRef,
      PONum: orderData.PONum,
      Printed: orderData.Printed,
      Processed_AutoEvents: orderData.Processed_AutoEvents,
      RoutingNumber: orderData.RoutingNumber,
      SalesRep_CustomerID: orderData.SalesRep_CustomerID,
      SalesTax1: orderData.SalesTax1,
      SalesTax2: orderData.SalesTax2,
      SalesTax3: orderData.SalesTax3,
      SalesTaxRate: orderData.SalesTaxRate,
      SalesTaxRate1: orderData.SalesTaxRate1,
      SalesTaxRate2: orderData.SalesTaxRate2,
      SalesTaxRate3: orderData.SalesTaxRate3,
      ShipAddress1: orderData.ShipAddress1,
      ShipAddress2: orderData.ShipAddress2,
      ShipCity: orderData.ShipCity,
      ShipCompanyName: orderData.ShipCompanyName,
      ShipCountry: orderData.ShipCountry,
      ShipDate: orderData.ShipDate,
      ShipFaxNumber: orderData.ShipFaxNumber,
      ShipFirstName: orderData.ShipFirstName,
      ShipLastName: orderData.ShipLastName,
      Shipped: orderData.Shipped,
      ShipPhoneNumber: orderData.ShipPhoneNumber,
      Shipping_Locked: orderData.Shipping_Locked,
      ShippingMethodID: orderData.ShippingMethodID,
      ShipPostalCode: orderData.ShipPostalCode,
      ShipResidential: orderData.ShipResidential,
      ShipState: orderData.ShipState,
      sOrderID: orderData.sOrderID,
      Stock_Priority: orderData.Stock_Priority,
      Tax1_IgnoreNoTaxRules: orderData.Tax1_IgnoreNoTaxRules,
      Tax1_Title: orderData.Tax1_Title,
      Tax2_IgnoreNoTaxRules: orderData.Tax2_IgnoreNoTaxRules,
      Tax2_IncludePrevious: orderData.Tax2_IncludePrevious,
      Tax2_Title: orderData.Tax2_Title,
      Tax3_IgnoreNoTaxRules: orderData.Tax3_IgnoreNoTaxRules,
      Tax3_IncludePrevious: orderData.Tax3_IncludePrevious,
      Tax3_Title: orderData.Tax3_Title,
      TaxRate_IsVat: orderData.TaxRate_IsVat,
      Total_Payment_Authorized: orderData.Total_Payment_Authorized,
      Total_Payment_Received: orderData.Total_Payment_Received,
      TotalShippingCost: orderData.TotalShippingCost,
      VendorID: orderData.VendorID,
      pdfname: orderData.pdfname,
      IsCustomerNameShow: orderData.IsCustomerNameShow,
      IsCustomerEmailShow: orderData.IsCustomerEmailShow,
      QuoteNo: orderData.QuoteNo,
      PrivateNotes: orderData.PrivateNotes,
      Order_Type: orderData.Order_Type,
      UserId: orderData.UserId,
      OrderSerials: orderData.OrderSerials,
      OldOrder: orderData.OldOrder,
      IsTaxExempt: orderData.IsTaxExempt,
      TaxExemptionId: orderData.TaxExemptionId,
      IsPayed: orderData.IsPayed,
      ListPrice_Name: orderData.ListPrice_Name,
      CurrentCustomerDiscount: orderData.CurrentCustomerDiscount,
      InsuranceValue: orderData.InsuranceValue,
      IsFreeOrder: orderData.IsFreeOrder,
      Incoterm: orderData.Incoterm,
      TrackingNo: orderData.TrackingNo,
      endUserId: orderData.endUser_id || orderData.endUserId,
      ShipEmailAddress: orderData.ShipEmailAddress,
      id: 0,
    };
  }
  static mapOrderDetailsSnapshotToPrisma(
    detailData,
    snapshotId,
    index,
  ): PrismaOrderDetailSnapshot {
    return {
      OrderDetailID: detailData.snapshotId,
      Additional_Handling_Indicator: detailData.Additional_Handling_Indicator,
      Affiliate_Commissionable_Value: detailData.Affiliate_Commissionable_Value,
      AutoDropShip: detailData.AutoDropShip,
      CategoryID: detailData.CategoryID,
      CouponCode: detailData.CouponCode,
      CustomLineItem: detailData.CustomLineItem,
      DiscountAutoID: detailData.DiscountAutoID,
      DiscountType: detailData.DiscountType,
      DiscountValue: detailData.DiscountValue,
      DownloadFile: detailData.DownloadFile,
      Fixed_ShippingCost: detailData.Fixed_ShippingCost,
      Fixed_ShippingCost_Outside_LocalRegion:
        detailData.Fixed_ShippingCost_Outside_LocalRegion,
      FreeShippingItem: detailData.FreeShippingItem,
      GiftTrakNumber: detailData.GiftTrakNumber,
      GiftWrap: detailData.GiftWrap,
      GiftWrapCost: detailData.GiftWrapCost,
      GiftWrapNote: detailData.GiftWrapNote,
      Height: detailData.Height,
      IsKitID: detailData.IsKitID,
      KitID: detailData.KitID,
      LastModBy: detailData.LastModBy,
      LastModified: detailData.LastModified,
      Length: detailData.Length,
      Locked: detailData.Locked,
      OnOrder_Qty: detailData.OnOrder_Qty,
      OptionID: detailData.OptionID,
      OptionIDs: detailData.OptionIDs,
      Options: detailData.Options,
      OrderDetailID_Third_Party: detailData.OrderDetailID_Third_Party,
      OrderDetailID_Third_Party_Link: detailData.OrderDetailID_Third_Party_Link,
      Order_Snapshot_ID: snapshotId,
      Oversized: detailData.Oversized,
      Package_Type: detailData.Package_Type,
      Product_Keys_Shipped: detailData.Product_Keys_Shipped,
      ProductCode: detailData.ProductCode,
      ProductID: detailData.ProductID,
      ProductName: detailData.ProductName,
      ProductNote: detailData.ProductNote,
      ProductPrice: detailData.ProductPrice,
      ProductWeight: detailData.ProductWeight,
      QtyOnBackOrder: detailData.QtyOnBackOrder,
      QtyOnHold: detailData.QtyOnHold,
      QtyOnPackingSlip: detailData.QtyOnPackingSlip,
      QtyShipped: detailData.QtyShipped,
      Quantity: detailData.Quantity,
      Returned: detailData.Returned,
      Returned_Date: detailData.Returned_Date,
      Reward_Points_Given_For_Purchase:
        detailData.Reward_Points_Given_For_Purchase,
      RMA_Number: detailData.RMA_Number,
      RMAI_ID: detailData.RMAI_ID,
      ShipDate: detailData.ShipDate,
      Shipped: detailData.Shipped,
      Ships_By_Itself: detailData.Ships_By_Itself,
      TaxableProduct: detailData.TaxableProduct,
      TotalPrice: detailData.TotalPrice,
      VAT_Percentage: detailData.VAT_Percentage,
      Vendor_Price: detailData.Vendor_Price,
      Warehouses: detailData.Warehouses,
      Width: detailData.Width,
      OrderDetails_Options: detailData.OrderDetails_Options,
      Discription: detailData.Discription,
      PrivateNotes: detailData.PrivateNotes,
      ProductTax: detailData.ProductTax,
      ProductSerials: detailData.ProductSerials,
      isChild: detailData.isChild,
      showOnShippingSlip: detailData.showOnShippingSlip,
      parent: detailData.parent,
      parentName: detailData.parentName,
      displayOrder: index,
      FreeShippingDiscount: detailData.FreeShippingDiscount,
      NonShippable: detailData.NonShippable,
      HarmonizedCode: detailData.HarmonizedCode,
      ExportControlClassificationNumber:
        detailData.ExportControlClassificationNumber,
      UnitOfMeasure: detailData.UnitOfMeasure,
      CountryOfOrigin: detailData.CountryOfOrigin,
      ExportDescription: detailData.ExportDescription,
      categoryIdOfOption: detailData.categoryIdOfOption,
      isCategoriesOption: detailData.isCategoriesOption,
      Product_Subclass: detailData.Product_Subclass,
    };
  }

  static mapGetOrder(order: OrderQueryResult, notes: any[]): MappedOrder[] {
    const orderDatePDF = order.orderDate
      ? new Date(order.orderDate).toISOString().split('T')[0]
      : '';
    const tagIds = (order.tagTable ?? []).map((tag) => String(tag.tagId));
    const baseOrder = {
      Order_Entry_System: order.orderEntrySystem ?? '',
      ShipEmailAddress: order.shipEmailAddress ?? '',
      InsuranceValue: order.insuranceValue ?? 0,
      endUserId: order.endUserId != null ? String(order.endUserId) : null,
      PONum: order.poNum ?? null,
      TrackingNo: order.trackingNo ?? null,
      Incoterm: order.incoterm ?? null,
      CreditCardAuthorizationHash: order.creditCardAuthorizationHash ?? null,
      QuoteNo: order.quoteNo ?? null,
      Order_Comments: order.orderComments ?? null,
      Custom_Field_CarrierAcctNo: order.customFieldCarrierAcctNo ?? null,
      IsPayed: order.isPayed ?? false,
      LastModBy: order.lastModBy ?? null,
      LastModified: order.lastModified ?? null,
      OrderTaxExempt: order.orderTaxExempt ?? false,
      UserId: order.userId ?? null,
      Total_Payment_Received: order.totalPaymentReceived ?? 0,
      CurrentCustomerDiscount: order.currentCustomerDiscount ?? 0,
      OrderSerials: order.orderSerials ?? '',
      InvoiceableOn: order.invoiceableOn
        ? order.invoiceableOn.toISOString()
        : null,
      OrderStatus: order.orderStatus ?? null,
      Order_Type: order.orderType ?? 'Customer',
      ShippingMethodID: order.shippingMethodId ?? null,
      PrivateNotes:
        order.snapshots && order.snapshots.length > 0
          ? (order.snapshots?.[0].PrivateNotes ?? null)
          : null,
      Freight: order.totalShippingCost ?? 0,
      OldOrder: order.oldOrder ?? false,
      TaxShipping:
        (order.salesTaxRate1 ?? 0) +
        (order.salesTaxRate2 ?? 0) +
        (order.salesTaxRate3 ?? 0),
      TotalTax:
        (order.salesTax1 ?? 0) +
        (order.salesTax2 ?? 0) +
        (order.salesTax3 ?? 0),
      notes: order.orderComments ?? null,
      OrderNotes: order.orderNotes ?? null,
      IsCustomerNameShow: order.isCustomerNameShow ?? false,
      OrderID: order.id ?? 0,
      CustomerID: order.customerId ?? null,
      PaymentAmount: order.paymentAmount ?? 0,
      CustomerCompany: order.billingCompanyName ?? '',
      ShipCompanyName: order.shipCompanyName ?? '',
      ShipFirstName: order.shipFirstName ?? '',
      ShipLastName: order.shipLastName ?? '',
      CustomerFName: order.billingFirstName ?? '',
      CustomerLName: order.billingLastName ?? '',
      OrderDate: order.orderDate ?? '',
      BillingStreetAddress1: order.billingAddress1 ?? '',
      BillingStreetAddress2: order.billingAddress2 ?? '',
      BillingCity1: order.billingCity ?? '',
      BillingCountry1: order.billingCountry ?? '',
      BillingState: order.billingState ?? '',
      BillingPhoneNumber: order.billingPhoneNumber ?? '',
      IsTaxExempt: order.isTaxExempt ?? false,
      BillingPostalCode: order.billingPostalCode ?? '',
      ShipAddress1: order.shipAddress1 ?? '',
      ShipAddress2: order.shipAddress2 ?? '',
      ShipCity: order.shipCity ?? '',
      ShipCountry: order.shipCountry ?? '',
      ShipState: order.shipState ?? '',
      ShipPhoneNumber: order.shipPhoneNumber ?? '',
      ShipPostalCode: order.shipPostalCode ?? '',
      SalesTaxRate1:
        (order.salesTaxRate1 ?? 0) +
        (order.salesTaxRate2 ?? 0) +
        (order.salesTaxRate3 ?? 0),
      SalesTax1: order.salesTax1 ?? 0,
      IsCustomerEmailShow: order.isCustomerEmailShow ?? false,
      ModifiedByBlueFirstName: order.modifiedBy?.firstname ?? '',
      ModifiedByBlueLastName: order.modifiedBy?.lastname ?? '',
      CreatedByBlueFirstName: order.orderedBy?.firstname ?? '',
      CreatedByBlueLastName: order.orderedBy?.lastname ?? '',
      CreatedByVoluFirstName: order.salesRep?.firstName ?? '',
      CreatedByVoluLastName: order.salesRep?.lastName ?? '',
      tagIds,
      notesHistory: notes.map((note) => ({
        Order_Comments: note.OrderComments,
        OrderNotes: note.OrderNotes,
        firstname: note.firstname,
        lastname: note.lastname,
        LastModified: note.LastModified
          ? note.LastModified.toISOString()
          : undefined,
      })),
      OrderDatePDF: orderDatePDF,
    };

    return (order.orderDetails ?? []).map((detail) => ({
      ...baseOrder,

      OptionID: detail.optionId ?? null,
      categoryIdOfOption: detail.categoryIdOfOption ?? null,
      Options: detail.options ?? '',
      Product_Subclass: detail.productSubClass ?? null,
      TaxableProduct: detail.taxableProduct ?? null,
      QtyOnPackingSlip: detail.qtyOnPackingSlip ?? null,
      QtyShipped: detail.qtyShipped ?? null,
      QtyOnBackOrder: detail.qtyOnBackOrder ?? null,
      shippedQty: String(detail.shippedQty ?? 0),
      parent: detail.parent ?? null,
      parentName: detail.parentName ?? null,
      ProductSerials: detail.productSerials ?? '',
      isChild: detail.isChild ?? false,
      isCategoriesOption: detail.isCategoriesOption ?? false,
      ProductCode: detail.productCode ?? null,
      ProductName: detail.productName ?? null,
      description: detail.description ?? null,
      HarmonizedCode: detail.harmonizedCode ?? null,
      ExportControlClassificationNumber:
        detail.exportControlClassificationNumber ?? 'EAR99',
      ProductWeight: detail.productWeight ?? null,
      UnitOfMeasure: detail.unitOfMeasure ?? null,
      CountryOfOrigin: detail.countryOfOrigin ?? 'US',
      ExportDescription: detail.exportDescription ?? null,
      Qty: detail.quantity ?? null,
      Price: detail.productPrice ?? null,
      Discount: detail.discountValue ?? 0,
      gpn: detail.product?.gpn ?? null,
    }));
  }
}
