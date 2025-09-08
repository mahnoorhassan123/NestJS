// mappers/quote.mapper.ts
import { Prisma, Quote as PrismaQuote } from '@prisma/client';
import { CreateQuoteDto, UpdateQuoteDto } from '../dtos/create-quote.dto';
import { QuoteEntity } from '../entities/quote.entity';
import moment from 'moment';

export class QuoteMapper {
  static toDomain(
    prismaQuote: PrismaQuote & {
      quotelineitems?: any[];
      tagIds?: number[];
      user?;
      modifiedBy?;
    },
  ): any {
    return {
      QuoteNo: prismaQuote.QuoteNo,
      QuoteDate: prismaQuote.QuoteDate ?? '',
      ValidTill: prismaQuote.ValidTill ?? '',
      customerId: prismaQuote.customerId ?? 1,
      billingAddress1: prismaQuote.billingAddress1 ?? '',
      billingAddress2: prismaQuote.billingAddress2 ?? '',
      billingCompanyName: prismaQuote.billingCompanyName ?? '',
      billingEmailAddress: prismaQuote.billingEmailAddress ?? '',
      billingCity: prismaQuote.billingCity ?? '',
      billingCountry: prismaQuote.billingCountry ?? '',
      billingState: prismaQuote.billingState ?? '',
      billingPostalCode: prismaQuote.billingPostalCode ?? '',
      billingPhoneNumber: prismaQuote.billingPhoneNumber ?? '',
      shipAddress1: prismaQuote.shipAddress1 ?? '',
      shipAddress2: prismaQuote.shipAddress2 ?? '',
      shipCompanyName: prismaQuote.shipCompanyName ?? '',
      shipCity: prismaQuote.shipCity ?? '',
      shipCountry: prismaQuote.shipCountry ?? '',
      shipState: prismaQuote.shipState ?? '',
      shipPhoneNumber: prismaQuote.shipPhoneNumber ?? '',
      shipPostalCode: prismaQuote.shipPostalCode ?? '',
      billingFirstName: prismaQuote.billingFirstName ?? '',
      billingLastName: prismaQuote.billingLastName ?? '',
      totalShippingCost: prismaQuote.totalShippingCost ?? 0,
      shippingMethodId: prismaQuote.shippingMethodId ?? 0,
      insuranceValue: prismaQuote.insuranceValue,
      salesTaxRate1: prismaQuote.salesTaxRate1 ?? 0,
      isTaxExempt: prismaQuote.isTaxExempt ?? false,
      quoteComments: prismaQuote.quoteComments ?? '',
      pdfname: prismaQuote.pdfname ?? '',
      customerCompany: prismaQuote.customerCompany ?? '',
      isCustomerNameShow: prismaQuote.isCustomerNameShow,
      isCustomerEmailShow: prismaQuote.isCustomerEmailShow,
      isOrdered: prismaQuote.isOrdered,
      orderBy: prismaQuote.orderBy ?? 0,
      orderId: prismaQuote.orderId ?? 0,
      createdBy: prismaQuote.createdBy ?? 0,
      modBy: prismaQuote.modBy ?? 0,
      modifiedOn: prismaQuote.modifiedOn ?? '',
      quoteNotes: prismaQuote.quoteNotes ?? '',
      selectedCustomerDiscount: prismaQuote.selectedCustomerDiscount,
      customerEmail: prismaQuote.customerEmail ?? '',
      isApproved: prismaQuote.isApproved,
      isExternal: prismaQuote.isExternal,
      shipEmailAddress: prismaQuote.shipEmailAddress ?? '',
      shipLastName: prismaQuote.shipLastName ?? '',
      shipFirstName: prismaQuote.shipFirstName ?? '',
      affiliateCommissionableValue: prismaQuote.affiliateCommissionableValue,
      salesTax1: prismaQuote.salesTax1,
      tax1Title: prismaQuote.tax1Title ?? '',
      endUserId: prismaQuote.endUserId ?? 0,
      paymentAmount: prismaQuote.paymentAmount ?? 0,
      customFieldCarrierAcctNo: prismaQuote.customFieldCarrierAcctNo ?? '',
      createdAt: prismaQuote.createdAt,
      updatedAt: prismaQuote.updatedAt,
      quotelineitems: prismaQuote.quotelineitems,
      tagIds: prismaQuote.tagIds,
      // IssueDatePDF: moment(prismaQuote.QuoteDate).format('YYYY-MM-DD'),
      // ValidTillPDF: moment(prismaQuote.ValidTill).format('YYYY-MM-DD'),
      createdByFirst: prismaQuote.user?.firstname,
      createdByLast: prismaQuote.user?.lastname,
      modifiedByFirst: prismaQuote.modifiedBy?.firstname,
      modifiedByLast: prismaQuote.modifiedBy?.lastname,
    };
  }

  static mapQuoteToPrismaModel(request: any): Prisma.QuoteCreateInput {
    return {
      // Scalar fields with defaults

      QuoteDate:
        request.QuoteDate.toString() ||
        new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }), // Default to current date/time
      ValidTill:
        request.validTill ||
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // Default to 30 days from now

      billingAddress1: request.BillingAddress1 || '',
      billingAddress2: request.BillingAddress2 || '',
      billingCompanyName: request.BillingCompanyName || '',
      billingEmailAddress: request.BillingEmailAddress || '',
      billingCity: request.BillingCity || '',
      billingCountry: request.BillingCountry || 'US', // Default to US based on request context
      billingState: request.BillingState || '',
      billingPostalCode: request.BillingPostalCode || '',
      billingPhoneNumber: request.BillingPhoneNumber || '',
      shipAddress1: request.ShipAddress1 || '',
      shipAddress2: request.ShipAddress2 || '',
      shipCompanyName: request.ShipCompanyName || '',
      shipCity: request.ShipCity || '',
      shipCountry: request.ShipCountry || 'US',
      shipState: request.ShipState || '',
      shipPhoneNumber: request.ShipPhoneNumber || '',
      shipPostalCode: request.ShipPostalCode || '',
      billingFirstName: request.BillingFirstName || '',
      billingLastName: request.BillingLastName || '',
      totalShippingCost: request.TotalShippingCost
        ? Number(request.TotalShippingCost)
        : 0.0,
      shippingMethodId: 0, // Default to 0 (adjust based on your valid shipping method IDs)
      insuranceValue: request.InsuranceValue
        ? Number(request.InsuranceValue)
        : 0.0,
      salesTaxRate1: request.SalesTaxRate1
        ? Number(request.SalesTaxRate1)
        : 0.0,
      isTaxExempt:
        request.IsTaxExempt !== undefined
          ? Boolean(request.IsTaxExempt)
          : false,
      quoteComments: request.Quote_Comments || '',
      pdfname: '', // Default to empty string; set to generated PDF name if needed
      customerCompany: '', // Default to empty string
      isCustomerNameShow:
        request.IsCustomerNameShow !== undefined
          ? Boolean(request.IsCustomerNameShow)
          : true,
      isCustomerEmailShow:
        request.IsCustomerEmailShow !== undefined
          ? Boolean(request.IsCustomerEmailShow)
          : true,
      isOrdered: false, // Schema default

      createdBy: request.createdBy ? Number(request.createdBy) : 0, // Default to 0

      modifiedOn: request.modifiedOn || null, // Nullable in schema
      quoteNotes: request.QuoteNotes || '',
      selectedCustomerDiscount: 0, // Schema default
      customerEmail: request.BillingEmailAddress || '',
      isApproved:
        request.isApproved !== undefined ? Boolean(request.isApproved) : false,
      isExternal:
        request.isExternal !== undefined ? Boolean(request.isExternal) : false,
      shipEmailAddress: request.ShipEmailAddress || '',
      shipLastName: request.ShipLastName || '',
      shipFirstName: request.ShipFirstName || '',
      affiliateCommissionableValue: request.Affiliate_Commissionable_Value,
      salesTax1: request.SalesTax1 ? Number(request.SalesTax1) : 0.0,
      tax1Title: request.Tax1_Title || 'Tax', // Default to generic title
      endUserId: request.endUserId ? Number(request.endUserId) : 0, // Default to 0
      paymentAmount: request.PaymentAmount
        ? Number(request.PaymentAmount)
        : 0.0,
      customFieldCarrierAcctNo: '', // Default to empty string
      // customer: { connect: { id: +request.CustomerID } },
      // user: { connect: { id: +request.endUserId } },
      // Relations
      // modifiedBy: { connect: { id: +request.endUserId } },
      // tagTable: {
      //   connect:
      //     request.tagsArray?.map((tagId: number) => ({ id: Number(tagId) })) ||
      //     [], // Empty array if no tags
      // },
    };
  }

  static mapQuoteLineItemToPrismaModel(
    item: any,
    quoteNo,
    index: number,
  ): Prisma.QuoteLineItemCreateInput {
    return {
      quote: { connect: { QuoteNo: quoteNo } },
      ProductCode: item.ProductCode || 'UNKNOWN', // Required, default to 'UNKNOWN'
      ProductName: item.ProductName || 'Unknown Product', // Required, default to 'Unknown Product'
      TaxableProduct: item.TaxableProduct || 'N', // Default from schema
      isChild: item.isChild !== undefined ? Boolean(item.isChild) : false, // Default from schema
      display_order: index,
      displayOrder: index,
      isCategoriesOption:
        item.isCategoriesOption !== undefined
          ? Boolean(item.isCategoriesOption)
          : false, // Default from schema
      Quantity: item.Quantity ? Number(item.Quantity) : 1, // Default to 1
      ProductPrice: item.ProductPrice ? Number(item.ProductPrice) : 0.0,
      DiscountValue: item.DiscountValue ? Number(item.DiscountValue) : 0.0,
      Discription: item.Discription || item.Description || 'No description', // Handle typo
      parent: item.parent || '',
      parentName: item.parentName || '',
      categoryIdOfOption: item.categoryIdOfOption
        ? String(item.categoryIdOfOption)
        : '',
      OptionID: item.OptionID ? Number(item.OptionID) : 0,
      OptionIDs: item.OptionIDs || '',
      Options: item.Options || '',
      TotalPrice: item.TotalPrice ? Number(item.TotalPrice) : 0.0,
      ProductWeight: item.ProductWeight ? Number(item.ProductWeight) : 0.0,

      // product:{connect:{productId:item.productId}},
      Custom_Field_CarrierAcctNo: item.Custom_Field_CarrierAcctNo || '',
      Product_Subclass: item.Product_Subclass || '',
    };
  }
}
