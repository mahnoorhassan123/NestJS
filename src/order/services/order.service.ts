import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileDto } from '../dtos/create-file.dto';
import { createObjectCsvStringifier } from 'csv-writer';
import {
  DeleteFileDto,
  DeleteFileResponseDto,
  GetBackOrderDto,
  GetBackOrderResponseDto,
  GetOpenOrderByProductIdDto,
  GetOpenOrderByProductIdResponseDto,
  GetOrderBySerialDto,
  GetOrderBySerialResponseDto,
  GetOrdersByOpenStatusResponseDto,
  GetOrdersByStatusDto,
  GetOrdersCsvDto,
  GetOrdersDto,
  GetTrackShippingDto,
  GetTrackShippingResponseDto,
  ImportOrderFileDto,
  ImportOrderFileResponseDto,
  NoteHistoryDto,
  UpdateOrderDto,
  UpdateOrderResponseDto,
} from '../dtos/get-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  // ----------------- ORDER ON VOLUSION -----------------
  async orderOnVolusion(body: any, res: Response) {
    try {
      // TODO: implement logic
    } catch (error) {
      console.error('Error occurred in orderOnVolusion:', error);
      throw new HttpException(
        'Failed to process order on Volusion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ----------------- SYNC -----------------
  async sync(res: Response) {
    try {
      // TODO: implement logic
    } catch (error) {
      console.error('Error occurred in sync:', error);
      throw new HttpException(
        'Failed to sync orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ----------------- ORDER ON BLUE SKY -----------------
  async orderOnBlueSky(body: any, res: Response) {
    try {
      // TODO: implement logic
    } catch (error) {
      console.error('Error occurred in orderOnBlueSky:', error);
      throw new HttpException(
        'Failed to process order on Blue Sky',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ----------------- ORDER PACKAGES -----------------
  async getOrderPackages(orderId: number) {
    try {
      const packages = await this.prisma.orderPackage.findMany({
        where: { orderId },
      });

      if (packages.length > 0) {
        return packages;
      } else {
        return [{ OrderNotFound: true }];
      }
    } catch (error) {
      console.error('Error in getOrderPackages:', error);
      //   throw new InternalServerErrorException('Failed to fetch order packages');
    }
  }

  // ----------------- ORDER TRACK -----------------
  async getOrderTrack(orderId: number) {
    const tracks = await this.prisma.orderTrackingNo.findMany({
      where: { orderId },
      include: {
        lineItems: {
          select: {
            id: true,
            updatedAt: true,
          },
        },
      },
      // orderBy: {
      //   lineItems: {
      //     _max: {
      //       updatedAt: 'desc',     // orderBy not allowed by using lineItems
      //     },
      //   },
      // },
    });

    if (tracks.length === 0) {
      return [{}];
    }

    return tracks.map((track) => ({
      ...track,
      countOfLineItems: track.lineItems.length,
    }));
  }

  async deleteOrderTrack(id: number) {
    try {
      const result = await this.prisma.orderTrackingNo.delete({
        where: { id },
      });
      return { status: true, msg: 'Deleted.', result };
    } catch (err) {
      console.error('Error deleting record:', err.message);
      return { status: false, msg: err.message };
    }
  }

  // ----------------- LIST ORDERS -----------------
  async getOrdersByOpenStatus(): Promise<GetOrdersByOpenStatusResponseDto[]> {
    try {
      const openStatuses = [
        'Order Placed',
        'Preparing Shipment',
        'HOLD- PO Issue',
        'Ready to Ship',
        'HOLD- Waiting for prepay',
        'HOLD- Waiting PI approval',
        'Waiting for pickup - EXW',
        'Engineering Services Open',
        'Repair in Process',
        'HOLD- Waiting H/W return',
        'Marketing Material',
        'Partially Shipped',
        'Backordered',
        'Processing', // Corrected typos: 'Order Placedaced' -> 'Order Placed', 'Proccessing' -> 'Processing'
      ];

      const orders = await this.prisma.order.findMany({
        where: {
          orderStatus: { in: openStatuses },
        },
        include: {
          customer: true,
          orderedBy: true,
          salesRep: true,
          quote: true,
          orderDetails: true,
        },
        orderBy: { id: 'desc' },
      });

      const formattedData: GetOrdersByOpenStatusResponseDto[] = orders.map(
        (order) => ({
          ProductCode: order.orderDetails?.[0]?.productCode || '', // Take first productCode or empty string
          IsPayed: order.isPayed || false,
          OrderEntrySystem: order.orderEntrySystem || '',
          OrderNotes: order.orderNotes || '',
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
          CancelDate: order.cancelDate ? new Date(order.cancelDate) : undefined,
          ShipFaxNumber: order.shipFaxNumber || '',
          ShipFirstName: order.shipFirstName || '',
          ShipLastName: order.shipLastName || '',
          Shipped: order.shipped || false,
          ShipPhoneNumber: order.shipPhoneNumber || '',
          ShipPostalCode: order.shipPostalCode || '',
          ShipState: order.shipState || '',
          CreatedByBlueFirstName: order.orderedBy?.firstname || '',
          CreatedByBlueLastName: order.orderedBy?.lastname || '',
          CreatedByVoluFirstName: order.salesRep?.firstName || '',
          CreatedByVoluLastName: order.salesRep?.lastName || '',
          OrderSerials: order.orderSerials || '',
          OrderID: order.id,
          QuoteNo: order.quote?.quoteNo || undefined,
          QuoteDate: order.quote?.quoteDate
            ? new Date(order.quote.quoteDate)
            : undefined,
          InvoiceableOn: order.invoiceableOn
            ? new Date(order.invoiceableOn)
            : undefined,
          CustomerID: order.customerId || undefined,
          OrderStatus: order.orderStatus || '',
          PaymentAmount: order.paymentAmount || 0,
          CompanyName: order.billingCompanyName || '',
          FirstName: order.billingFirstName || '',
          LastName: order.billingLastName || '',
          City: order.billingCity || '',
          OrderDate: order.orderDate ? new Date(order.orderDate) : undefined,
          OldOrder: order.oldOrder || false,
        }),
      );

      return formattedData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrders(query: GetOrdersDto): Promise<any> {
    try {
      const where: any = {};

      if (query.duration && query.duration !== 'all') {
        const months = parseInt(query.duration);
        if (isNaN(months)) {
          throw new BadRequestException('Invalid duration value');
        }
        const fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - months);
        where.orderDate = { gte: fromDate };
      } else if (query.startTime && query.endTime) {
        const startDate = new Date(query.startTime);
        const endDate = new Date(query.endTime);
        where.orderDate = {
          gte: startDate,
          lte: new Date(endDate.setDate(endDate.getDate() + 1)),
        };
      } else if (query.openStatus) {
        const openStatuses = [
          'Order Placed',
          'Preparing Shipment',
          'HOLD- PO Issue',
          'HOLD- Waiting for prepay',
          'HOLD- Waiting PI approval',
          'Waiting for pickup - EXW',
          'Engineering Services Open',
          'Repair in Process',
          'HOLD- Waiting H/W return',
          'Partially Returned',
          'Marketing Material',
          'Ready to Ship',
          'Partially Shipped',
          'Backordered',
          'Proccessing', // Note: Likely a typo in original ('Proccessing' should be 'Processing')
        ];
        where.orderStatus = { in: openStatuses };
      }

      const orders = await this.prisma.order.findMany({
        where,
        include: {
          customer: true,
          orderedBy: true,
          salesRep: true,
          quote: true,
        },
        orderBy: { id: 'desc' },
      });

      const formattedData = orders.map((order) => ({
        IsPayed: order.isPayed || false,
        OrderEntrySystem: order.orderEntrySystem || '',
        OrderNotes: order.orderNotes || '',
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
        ShipDate: order.shipDate
          ? new Date(order.shipDate).toISOString().split('T')[0]
          : '',
        CancelDate: order.cancelDate
          ? new Date(order.cancelDate).toISOString().split('T')[0]
          : '',
        ShipFaxNumber: order.shipFaxNumber || '',
        ShipFirstName: order.shipFirstName || '',
        ShipLastName: order.shipLastName || '',
        Shipped: order.shipped || false,
        ShipPhoneNumber: order.shipPhoneNumber || '',
        ShipPostalCode: order.shipPostalCode || '',
        ShipState: order.shipState || '',
        CreatedByBlueFirstName: order.orderedBy?.firstname || '',
        CreatedByBlueLastName: order.orderedBy?.lastname || '',
        CreatedByVoluFirstName: order.salesRep?.firstName || '',
        CreatedByVoluLastName: order.salesRep?.lastName || '',
        OrderSerials: order.orderSerials || '',
        OrderID: order.id,
        QuoteNo: order.quote?.quoteNo || '',
        QuoteDate: order.quote?.quoteDate
          ? new Date(order.quote.quoteDate).toISOString().split('T')[0]
          : '',
        InvoiceableOn: order.invoiceableOn
          ? new Date(order.invoiceableOn).toISOString().split('T')[0]
          : '',
        CustomerID: order.customerId || '',
        OrderStatus: order.orderStatus || '',
        PaymentAmount: order.paymentAmount || 0,
        CompanyName: order.billingCompanyName || '',
        FirstName: order.billingFirstName || '',
        LastName: order.billingLastName || '',
        City: order.billingCity || '',
        OrderDate: order.orderDate
          ? new Date(order.orderDate).toISOString().split('T')[0]
          : '',
        OldOrder: order.oldOrder || false,
      }));

      return formattedData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async listOrdersByDate(body: any, res: Response) {
    try {
      // TODO: implement logic
    } catch (error) {
      console.error('Error occurred in listOrdersByDate:', error);
      throw new HttpException(
        'Failed to fetch orders by date',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrdersByStatus(data: GetOrdersByStatusDto): Promise<any> {
    try {
      const where: any = { id: { gt: 0 } };
      let include = {
        customer: true,
        orderedBy: true,
        shippedBy: data.shippedBy ? true : false,
        tagTables: data.tags
          ? data.tags?.length > 0
          : data.tag_type !== 'all'
            ? { include: { tag: true } }
            : false,
        orderDetails: data.productCode
          ? data.productCode?.length > 0
            ? true
            : false
          : false,
        quote: true,
        salesRep: true,
      };

      const page = data.page || 1;
      const size = data.size || 10;
      const offset = (page - 1) * size;

      // Sorting
      const sortColumnMapping = {
        orderId: 'id',
        orderStatus: 'orderStatus',
        orderDate: 'orderDate',
        shipDate: 'shipDate',
        paymentAmount: 'paymentAmount',
        poNum: 'poNum',
        orderComments: 'orderComments',
        orderNotes: 'orderNotes',
        billingFirstName: 'billingFirstName',
        billingLastName: 'billingLastName',
        shipCountry: 'shipCountry',
        shipCompanyName: 'shipCompanyName',
        billingCompanyName: 'billingCompanyName',
      };

      const orderBy: any = {};
      if (data.sortColumn && data.sortOrder && data.sortOrder !== 'null') {
        const column = sortColumnMapping[data.sortColumn] || 'id';
        orderBy[(column.collision = data.sortOrder === 'asc' ? 'asc' : 'desc')];
      } else {
        orderBy.id = 'desc';
      }

      if (data.isGlobal && data.search) {
        const search = `%${data.search}%`;
        where.OR = [
          { id: { contains: search } },
          { orderComments: { contains: search } },
          { orderNotes: { contains: search } },
          { poNum: { contains: search } },
          { billingLastName: { contains: search } },
          { billingFirstName: { contains: search } },
          { shipCountry: { contains: search } },
          { shipCompanyName: { contains: search } },
          { billingCompanyName: { contains: search } },
          { orderStatus: { contains: search } },
          { paymentAmount: { equals: parseFloat(data.search) || undefined } },
          { customer: { email: { contains: search } } },
          {
            orderedBy: {
              OR: [
                { firstname: { contains: search } },
                { lastname: { contains: search } },
              ],
            },
          },
        ];
      }

      if (data.isIndividual) {
        if (data.id) where.id = { contains: `%${data.id}%` };
        if (data.lastName) {
          where.OR = where.OR || [];
          where.OR.push(
            { billingLastName: { contains: `%${data.lastName}%` } },
            { billingFirstName: { contains: `%${data.lastName}%` } },
          );
        }
        if (data.email)
          where.customer = { email: { contains: `%${data.email}%` } };
        if (data.country) where.shipCountry = { contains: `%${data.country}%` };
        if (data.createdBy) {
          where.orderedBy = {
            OR: [
              { firstname: { contains: `%${data.createdBy}%` } },
              { lastname: { contains: `%${data.createdBy}%` } },
            ],
          };
        }
        if (data.orderStatus)
          where.orderStatus = { contains: `%${data.orderStatus}%` };
        if (data.total)
          where.paymentAmount = { equals: parseFloat(data.total) || undefined };
        if (data.company) {
          where.OR = where.OR || [];
          where.OR.push(
            { shipCompanyName: { contains: `%${data.company}%` } },
            { billingCompanyName: { contains: `%${data.company}%` } },
          );
        }
        if (data.orderDate) {
          const date = new Date(data.orderDate);
          where.orderDate = {
            gte: date,
            lte: new Date(date.setDate(date.getDate() + 1)),
          };
        }
        if (data.shipDate) {
          const date = new Date(data.shipDate);
          where.shipDate = {
            gte: date,
            lte: new Date(date.setDate(date.getDate() + 1)),
          };
        }
        if (data.shippedBy) {
          where.shippedBy = {
            OR: [
              { firstname: { contains: `%${data.shippedBy}%` } },
              { lastname: { contains: `%${data.shippedBy}%` } },
            ],
          };
        }
      }

      if (data.serialNo) {
        where.orderSerials = { contains: `%${data.serialNo}%` };
      }

      if (data.dates?.from && data.dates.to) {
        const fromDate = new Date(data.dates.from);
        fromDate.setDate(fromDate.getDate() - 1);
        where.orderDate = {
          gte: fromDate,
          lte: new Date(data.dates.to),
        };
      }

      const openStatusArray = ['Pending', 'Processing'];
      const allIncludeCancelOrderStatus = [
        'Pending',
        'Processing',
        'Shipped',
        'Partially Shipped',
        'Cancelled',
      ];

      if (data.status === 'open') {
        where.orderStatus = { in: openStatusArray };
      } else if (data.status === 'allIncludeCanceled') {
        where.orderStatus = { in: allIncludeCancelOrderStatus };
      } else if (data.status === 'all') {
        where.orderStatus = { not: 'Cancelled' };
      } else if (data.status === 'PartiallyAndShipped') {
        where.orderStatus = { in: ['Partially Shipped', 'Shipped'] };
      } else if (data.status) {
        where.orderStatus = data.status;
      }

      if (data.country && data.country !== 'all') {
        where.shipCountry = data.country;
      }

      if (data.type && data.type !== 'all') {
        where.orderType = data.type;
      }

      if (data.productCode ? data.productCode?.length > 0 : false) {
        where.orderDetails = { some: { productId: { in: data.productCode } } };
      }

      if (data.tags ? data.tags?.length > 0 : false) {
        where.tagTables = { some: { tagId: { in: data.tags } } };
      }

      if (data.tag_type && data.tag_type !== 'all') {
        where.tagTables = { none: {} };
      }

      // Fetch total count
      const totalCount = await this.prisma.order.count({ where });

      // Fetch total payment amount
      const totalSum = await this.prisma.order.aggregate({
        where,
        _sum: { paymentAmount: true },
      });

      // Fetch orders
      const orders = await this.prisma.order.findMany({
        where,
        include,
        orderBy,
        skip: offset,
        take: size,
      });

      // Process results
      let paymentAmount = 0;
      const formattedData = orders.map((order) => {
        paymentAmount += order.paymentAmount || 0;
        const tagName =
          order.tagTables
            ?.map((tt) => {
              const name = tt.tag?.name || '';
              const changeIndex = name.indexOf('-');
              return changeIndex !== -1
                ? name.substring(changeIndex + 1).trim()
                : name;
            })
            .join(', ') || '';
        return {
          OrderID: order.id,
          OrderStatus: order.orderStatus || '',
          OrderDate: order.orderDate
            ? new Date(order.orderDate).toISOString().split('T')[0]
            : '',
          ShipDate: order.shipDate
            ? new Date(order.shipDate).toISOString().split('T')[0]
            : '',
          CustomerEmail: order.customer?.email || '',
          BillingFirstName: order.billingFirstName || '',
          BillingLastName: order.billingLastName || '',
          ShipCountry: order.shipCountry || '',
          ShipCompanyName: order.shipCompanyName || '',
          BillingCompanyName: order.billingCompanyName || '',
          PaymentAmount: order.paymentAmount || 0,
          PONum: order.poNum || '',
          OrderComments: order.orderComments || '',
          OrderNotes: order.orderNotes || '',
          CreatedBy: order.orderedBy
            ? `${order.orderedBy.firstname} ${order.orderedBy.lastname}`.trim()
            : '',
          ShippedBy: order.shippedBy
            ? `${order.shippedBy.firstname} ${order.shippedBy.lastname}`.trim()
            : '',
          OrderSerials: order.orderSerials || '',
          OrderType: order.orderType || '',
          SalesRep: order.salesRep
            ? `${order.salesRep.firstName} ${order.salesRep.lastName}`.trim()
            : '',
          QuoteNo: order.quote?.quoteNo || '',
          totalAmount: paymentAmount.toFixed(2),
          count: totalCount,
          totalData: totalCount,
          totalPaymentAmount: totalSum._sum.paymentAmount || 0,
        };
      });

      return formattedData;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrdersCSV(req: Request, res: Response, body: any) {
    try {
      // TODO: implement logic
    } catch (error) {
      console.error('Error occurred in getOrdersCSV:', error);
      throw new HttpException(
        'Failed to export orders CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrdersProductCsv(query: GetOrdersCsvDto): Promise<string> {
    try {
      const where: any = { id: { gt: 0 } };
      let include = {
        customer: true,
        orderedBy: true,
        tagTables: query.tags
          ? query.tags?.length > 0
            ? true
            : false
          : query.tag_type !== 'all'
            ? true
            : false,
        orderDetails: query.productCode
          ? query.productCode?.length > 0
            ? { include: { product: true } }
            : false
          : false,
      };

      // Global search
      if (query.isGlobal && query.search) {
        const search = `%${query.search}%`;
        where.OR = [
          { id: { contains: search } },
          { orderComments: { contains: search } },
          { poNum: { contains: search } },
          { billingLastName: { contains: search } },
          { billingFirstName: { contains: search } },
          { shipCountry: { contains: search } },
          { shipCompanyName: { contains: search } },
          { billingCompanyName: { contains: search } },
          { orderStatus: { contains: search } },
          { paymentAmount: { equals: parseFloat(query.search) || undefined } },
          { customer: { email: { contains: search } } },
          {
            orderedBy: {
              OR: [
                { firstname: { contains: search } },
                { lastname: { contains: search } },
              ],
            },
          },
        ];
      }

      // Individual search
      if (query.isIndividual) {
        if (query.id) where.id = { contains: `%${query.id}%` };
        if (query.lastName) {
          where.OR = where.OR || [];
          where.OR.push(
            { billingLastName: { contains: `%${query.lastName}%` } },
            { billingFirstName: { contains: `%${query.lastName}%` } },
          );
        }
        if (query.email)
          where.customer = { email: { contains: `%${query.email}%` } };
        if (query.country)
          where.shipCountry = { contains: `%${query.country}%` };
        if (query.createdBy) {
          where.orderedBy = {
            OR: [
              { firstname: { contains: `%${query.createdBy}%` } },
              { lastname: { contains: `%${query.createdBy}%` } },
            ],
          };
        }
        if (query.orderStatus)
          where.orderStatus = { contains: `%${query.orderStatus}%` };
        if (query.total)
          where.paymentAmount = {
            equals: parseFloat(query.total) || undefined,
          };
        if (query.company) {
          where.OR = where.OR || [];
          where.OR.push(
            { shipCompanyName: { contains: `%${query.company}%` } },
            { billingCompanyName: { contains: `%${query.company}%` } },
          );
        }
        if (query.orderDate) {
          const date = new Date(query.orderDate);
          where.orderDate = {
            gte: date,
            lte: new Date(date.setDate(date.getDate() + 1)),
          };
        }
        if (query.shipDate) {
          const date = new Date(query.shipDate);
          where.shipDate = {
            gte: date,
            lte: new Date(date.setDate(date.getDate() + 1)),
          };
        }
      }

      // Additional filters
      if (query.serialNo) {
        where.orderSerials = { contains: `%${query.serialNo}%` };
      }

      if (query.dates?.from && query.dates.to) {
        const fromDate = new Date(query.dates.from);
        fromDate.setDate(fromDate.getDate() - 1);
        where.orderDate = {
          gte: fromDate,
          lte: new Date(query.dates.to),
        };
      }

      const openStatusArray = ['Pending', 'Processing'];
      const allIncludeCancelOrderStatus = [
        'Pending',
        'Processing',
        'Shipped',
        'Partially Shipped',
        'Cancelled',
      ];

      if (query.status === 'open') {
        where.orderStatus = { in: openStatusArray };
      } else if (query.status === 'allIncludeCanceled') {
        where.orderStatus = { in: allIncludeCancelOrderStatus };
      } else if (query.status === 'all') {
        where.orderStatus = { not: 'Cancelled' };
      } else if (query.status === 'PartiallyAndShipped') {
        where.orderStatus = { in: ['Partially Shipped', 'Shipped'] };
      } else if (query.status) {
        where.orderStatus = query.status;
      }

      if (query.country && query.country !== 'all') {
        where.shipCountry = query.country;
      }

      if (query.type && query.type !== 'all') {
        where.orderType = query.type;
      }

      if (
        query.productCode
          ? query.productCode?.length > 0
            ? true
            : false
          : false
      ) {
        where.orderDetails = { some: { productId: { in: query.productCode } } };
      }

      if (query.tags ? (query.tags?.length > 0 ? true : false) : false) {
        where.tagTables = { some: { tagId: { in: query.tags } } };
      }

      if (query.tag_type && query.tag_type !== 'all') {
        where.tagTables = { none: {} };
      }

      // Fetch orders
      const orders = await this.prisma.order.findMany({
        where,
        include,
        orderBy: { id: 'desc' },
      });

      // Format data for CSV
      const formattedData = orders.map((order) => ({
        OrderID: order.id,
        OrderStatus: order.orderStatus || '',
        OrderDate: order.orderDate
          ? new Date(order.orderDate).toISOString().split('T')[0]
          : '',
        ShipDate: order.shipDate
          ? new Date(order.shipDate).toISOString().split('T')[0]
          : '',
        CustomerEmail: order.customer?.email || '',
        BillingFirstName: order.billingFirstName || '',
        BillingLastName: order.billingLastName || '',
        ShipCountry: order.shipCountry || '',
        ShipCompanyName: order.shipCompanyName || '',
        BillingCompanyName: order.billingCompanyName || '',
        PaymentAmount: order.paymentAmount || 0,
        PONum: order.poNum || '',
        OrderComments: order.orderComments || '',
        CreatedBy: order.orderedBy
          ? `${order.orderedBy.firstname} ${order.orderedBy.lastname}`.trim()
          : '',
        OrderSerials: order.orderSerials || '',
        OrderType: order.orderType || '',
      }));

      // Generate CSV
      const csvStringifier = createObjectCsvStringifier({
        header: [
          { id: 'OrderID', title: 'Order ID' },
          { id: 'OrderStatus', title: 'Order Status' },
          { id: 'OrderDate', title: 'Order Date' },
          { id: 'ShipDate', title: 'Ship Date' },
          { id: 'CustomerEmail', title: 'Customer Email' },
          { id: 'BillingFirstName', title: 'Billing First Name' },
          { id: 'BillingLastName', title: 'Billing Last Name' },
          { id: 'ShipCountry', title: 'Ship Country' },
          { id: 'ShipCompanyName', title: 'Ship Company Name' },
          { id: 'BillingCompanyName', title: 'Billing Company Name' },
          { id: 'PaymentAmount', title: 'Payment Amount' },
          { id: 'PONum', title: 'PO Number' },
          { id: 'OrderComments', title: 'Order Comments' },
          { id: 'CreatedBy', title: 'Created By' },
          { id: 'OrderSerials', title: 'Order Serials' },
          { id: 'OrderType', title: 'Order Type' },
        ],
      });

      const csvContent =
        csvStringifier.getHeaderString() +
        csvStringifier.stringifyRecords(formattedData);
      return csvContent;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------- GET ORDER -----------------
  async getOrder(query: GetOrderDto): Promise<GetOrderResponseDto[]> {
    try {
      const orderId = query.orderId;
      if (typeof orderId !== 'number' || isNaN(orderId)) {
        throw new BadRequestException('Invalid orderId');
      }

      const orders = await this.prisma.order.findMany({
        where: { id: orderId },
        include: {
          customer: true,
          orderedBy: true,
          modifiedBy: true,
          salesRep: true,
          quote: true,
          orderDetails: {
            include: { product: true },
            orderBy: { displayOrder: 'asc' },
          },
          tagTables: true,
          snapshots: {
            include: { modifiedBy: true },
            orderBy: { id: 'desc' },
          },
        },
      });

      if (orders.length === 0) {
        return [{ OrderNotFound: 'OrderNotFound', orderId } as any];
      }

      const notes =
        orders[0].snapshots
          ?.filter((note) => note.orderComments || note.orderNotes)
          .reduce((acc, note, index, arr) => {
            if (
              index === 0 ||
              note.orderComments !== arr[index - 1].orderComments ||
              note.orderNotes !== arr[index - 1].orderNotes
            ) {
              acc.push({
                OrderComments: note.orderComments || '',
                OrderNotes: note.orderNotes || '',
                firstname: note.modifiedBy?.firstname || '',
                lastname: note.modifiedBy?.lastname || '',
                LastModified: note.lastModified
                  ? new Date(note.lastModified)
                  : undefined,
              });
            }
            return acc;
          }, [] as any[]) || [];

      const formattedData = orders.map((order) => {
        const orderDetails = order.orderDetails.map((detail) => ({
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
        }));

        // Compute shippedQty for each detail
        for (const detail of orderDetails) {
          const shippedQty = await this.prisma.productSerial.count({
            where: {
              orderId: orderId,
              productId: detail.productId,
              isSold: true,
            },
          });
          detail.shippedQty = shippedQty;
        }

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
          PrivateNotes: order.privateNotes || '',
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
          InvoiceableOn: order.invoiceableOn
            ? new Date(order.invoiceableOn)
            : undefined,
          OrderStatus: order.orderStatus || '',
          OrderType: order.orderType || '',
          ShippingMethodID: order.shippingMethodId,
          Freight: order.totalShippingCost,
          OldOrder: order.oldOrder || false,
          TaxShipping:
            (order.salesTaxRate1 || 0) +
            (order.salesTaxRate2 || 0) +
            (order.salesTaxRate3 || 0),
          TotalTax:
            (order.salesTax1 || 0) +
            (order.salesTax2 || 0) +
            (order.salesTax3 || 0),
          CustomerID: order.customerId,
          tagIds: order.tagTables?.map((tt) => tt.tagId) || [],
          notesHistory: notes,
          orderDetails: orderDetails,
        };
      });
      return formattedData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAttachedFiles(orderId: number) {
    const files = await this.prisma.attachedFile.findMany({
      where: {
        orderId,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        type: true,
        orderId: true,
        uploadedBy: true,
        uploadedAt: true,
        quoteId: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (files.length === 0) {
      return [{}]; // keeping original behavior
    }
    return files;
  }
  async getAttachedFilesForQuotes(quoteId: number) {
    if (!quoteId) {
      return [];
    }

    const files = await this.prisma.attachedFile.findMany({
      where: {
        quoteId,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        type: true,
        orderId: true,
        uploadedBy: true,
        uploadedAt: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (files.length === 0) {
      return [{}]; // keep original behavior
    }

    return files;
  }

  async saveOrderNoForQuotes(orderId: number, quoteId: number) {
    return this.prisma.attachedFile.updateMany({
      where: { quoteId },
      data: { orderId },
    });
  }

  async getAttachedFile(id: number) {
    return this.prisma.attachedFile.findUnique({
      where: { id },
      select: {
        file: true,
        name: true,
        extension: true,
      },
    });
  }

  async getOrderBySerial(
    query: GetOrderBySerialDto,
  ): Promise<GetOrderBySerialResponseDto[]> {
    try {
      const { serialNo } = query;
      if (!serialNo || typeof serialNo !== 'string') {
        throw new BadRequestException('Invalid serialNo');
      }

      // Find the most recent order with matching serialNo
      const order = await this.prisma.order.findFirst({
        where: {
          orderSerials: { contains: serialNo },
        },
        orderBy: { id: 'desc' },
        include: {
          customer: true,
          orderedBy: true,
          salesRep: true,
          quote: true,
          orderDetails: {
            include: { product: true },
          },
        },
      });

      if (!order) {
        return [{ OrderNotFound: 'OrderNotFound', orderId: serialNo } as any];
      }

      const formattedData: GetOrderBySerialResponseDto[] = [
        {
          OrderEntrySystem: order.orderEntrySystem || '',
          IsPayed: order.isPayed || false,
          TotalPaymentReceived: order.totalPaymentReceived || 0,
          CreatedByBlueFirstName: order.orderedBy?.firstname || '',
          CreatedByBlueLastName: order.orderedBy?.lastname || '',
          CreatedByVoluFirstName: order.salesRep?.firstName || '',
          CreatedByVoluLastName: order.salesRep?.lastName || '',
          OrderSerials: order.orderSerials || '',
          InvoiceableOn: order.invoiceableOn
            ? new Date(order.invoiceableOn)
            : undefined,
          OrderStatus: order.orderStatus || '',
          OrderType: order.orderType || '',
          ShippingMethodID: order.shippingMethodId || 0,
          PrivateNotes: order.privateNotes || '',
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
        },
      ];

      // Compute shippedQty for each detail
      for (const detail of formattedData[0].orderDetails) {
        const shippedQty = await this.prisma.productSerial.count({
          where: {
            orderId: order.id,
            productId: detail.productId,
            isSold: true,
          },
        });
        detail.shippedQty = shippedQty;
      }

      return formattedData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async insertOrder(
    order: CreateOrderDto,
  ): Promise<{ status: boolean; error?: any; data?: { id: number } }> {
    try {
      if (!order || !order.orderDetails) {
        throw new HttpException(
          'Order or order details undefined',
          HttpStatus.NOT_FOUND,
        );
      }

      // Clean orderDate
      if (order.orderDate) {
        order.orderDate = order.orderDate.replace(/\?/g, ' ');
      }

      const userId = order.userId;
      const shippedBy = order.shippedBy;
      const trackingNo = order.trackingNo || 'N/A';
      const tags = order.tagsArray ? [...new Set(order.tagsArray)] : [];
      const parcels = order.parcels || [];
      const orderDetails = order.orderDetails;
      const quoteId = order.quoteNo;

      let toShippedTotal = 0;
      let orderId = order.orderId;

      // Generate OrderID if not provided
      if (!orderId) {
        const maxOrder = await this.prisma.order.findFirst({
          select: { id: true },
          orderBy: { id: 'desc' },
        });
        orderId = maxOrder && maxOrder.id >= 50000 ? maxOrder.id + 1 : 50001;
      }

      // Check product hold status
      if (!order.orderId) {
        for (const detail of orderDetails) {
          if (detail.productId) {
            const product = await this.prisma.product.findUnique({
              where: { id: detail.productId },
              select: { holdForApproval: true },
            });
            if (product?.holdForApproval) {
              order.orderStatus = 'HOLD- Order approval';
            }
          }
        }
      }

      // Delete existing tags
      await this.prisma.tagTable.deleteMany({
        where: { tableId: orderId, tableName: 'orders' },
      });

      // Insert new tags
      if (tags.length > 0) {
        await this.prisma.tagTable.createMany({
          data: tags.map((tagId) => ({
            tableId: orderId,
            tableName: 'orders',
            tagId,
            createdAt: new Date(),
          })),
        });
      }

      // Handle shipping tracking
      if (
        order.orderStatus &&
        ['Shipped', 'Partially Shipped'].includes(order.orderStatus)
      ) {
        toShippedTotal = orderDetails.reduce(
          (sum, detail) => sum + (detail.quantityForTrackToShipped || 0),
          0,
        );

        if (toShippedTotal > 0) {
          let gateway = 'OTHER';
          if (
            order.shippingMethodId &&
            order.shippingMethodId >= 700 &&
            order.shippingMethodId < 800
          ) {
            gateway = 'UPS';
          } else if (
            order.shippingMethodId &&
            order.shippingMethodId >= 400 &&
            order.shippingMethodId < 500
          ) {
            gateway = 'DHL';
          }

          const trackObj = {
            orderId: orderId,
            trackingNo,
            gateway,
            shipDate: order.shipDate ? new Date(order.shipDate) : null,
            shipmentCost: order.totalShippingCost,
            shippingMethodId: order.shippingMethodId || 0,
            orderType: order.orderStatus,
            updatedBy: order.lastModBy,
            createdAt: new Date(),
          };

          const tracking = await this.prisma.orderTrackingNo.upsert({
            where: { orderId: orderId },
            update: trackObj,
            create: trackObj,
          });

          // Insert tracking line items
          await this.prisma.trackingShippingLineItem.createMany({
            data: orderDetails.map((detail, index) => ({
              trackShippingId: tracking.id,
              orderId,
              displayOrder: index,
              quantity: detail.qtyOnPackingSlip,
              productId: detail.productId,
              productCode: detail.productCode,
              productDescription: detail.description,
              isChild: detail.isChild,
              createdAt: new Date(),
              createdBy: userId,
              updatedAt: new Date(),
              updatedBy: order.lastModBy,
            })),
          });
        }
      }

      // Handle ship date
      if (
        order.orderStatus &&
        ['Shipped', 'Partially Shipped'].includes(order.orderStatus) &&
        toShippedTotal <= 0
      ) {
        order.shipDate = undefined;
      } else if (
        order.orderStatus &&
        ['Shipped', 'Partially Shipped'].includes(order.orderStatus)
      ) {
        order.shipDate = new Date().toLocaleString('en-US').replace(',', '');
        order.shippedBy = shippedBy;
      }

      // Insert or update order
      const orderToInsert = {};
      for (const key in order) {
        if (order[key] !== null && order[key] !== undefined) {
          orderToInsert[key] = order[key];
        }
      }

      await this.prisma.order.upsert({
        where: { id: orderId },
        update: {
          ...orderToInsert,
          updatedAt: new Date(),
        },
        create: {
          ...orderToInsert,
          id: orderId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Delete and insert packages
      if (parcels.length > 0) {
        await this.prisma.orderPackage.deleteMany({
          where: { orderId },
        });
        await this.prisma.orderPackage.createMany({
          data: parcels.map((parcel) => ({
            orderId,
            name: parcel.name,
            quantity: parcel.quantity,
            price: parcel.price,
            createdAt: new Date(),
          })),
        });
      }

      // Delete and insert order details
      await this.prisma.orderDetail.deleteMany({
        where: { orderId },
      });

      await this.prisma.orderDetail.createMany({
        data: orderDetails.map((detail, index) => {
          const detailToInsert = {
            orderId,
            displayOrder: index,
            createdAt: new Date(),
          };
          for (const key in detail) {
            if (
              detail[key] !== null &&
              detail[key] !== undefined &&
              ![
                'quantityForTrackToShipped',
                'categoryOptions',
                'availableOptions',
                'isSerialAble',
                'isMultiClassification',
              ].includes(key)
            ) {
              detailToInsert[key] = detail[key];
            }
          }
          return detailToInsert;
        }),
      });

      // Update product serials
      if (
        order.orderStatus &&
        ['Shipped', 'Partially Shipped'].includes(order.orderStatus)
      ) {
        await this.prisma.productSerial.updateMany({
          where: { orderId },
          data: { status: 'shipped', type: 'products' },
        });
      }

      if (
        order.orderStatus &&
        ['Cancelled', 'Returned'].includes(order.orderStatus)
      ) {
        const serials = await this.prisma.productSerial.findMany({
          where: { orderId },
        });
        await Promise.all(
          serials.map((serial) =>
            this.prisma.productSerial.updateMany({
              where: { id: serial.id },
              data: {
                status: 'unAllocated',
                orderId: null,
                type: serial.groupId ? 'groups' : 'products',
                productId: serial.groupId || serial.productId,
              },
            }),
          ),
        );
      }

      // Update quote
      if (quoteId) {
        await this.prisma.quote.update({
          where: { quoteNo: quoteId },
          data: {
            isOrdered: true,
            orderBy: userId,
            orderId,
            updatedAt: new Date(),
          },
        });
      }

      return { status: true, data: { id: orderId } };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getBackOrder(
    query: GetBackOrderDto,
  ): Promise<GetBackOrderResponseDto[]> {
    try {
      const { productCodes } = query;
      if (
        !Array.isArray(productCodes) ||
        productCodes.some((id) => typeof id !== 'number' || isNaN(id))
      ) {
        throw new BadRequestException('Invalid productCodes');
      }

      const whereClause =
        productCodes.length > 1 ? { productId: { in: productCodes } } : {};

      // Fetch unallocated products
      const unAllocatedProducts = await this.prisma.productSerial
        .groupBy({
          by: ['productId'],
          where: {
            status: 'unAllocated',
            ...whereClause,
          },
          _count: { _all: true },
          orderBy: { product: { backlog_priority: 'asc' } },
        })
        .then((results) =>
          Promise.all(
            results.map(async (result) => {
              const product = await this.prisma.product.findUnique({
                where: { id: result.productId },
                include: { productClass: true, productSubClass: true },
              });
              return {
                class: product?.productClass?.Name,
                subclass: product?.productSubClass?.Name,
                ProductCode: product?.gpn || '',
                ProductID: result.productId,
                backlog_show: product?.backlog_show,
                backlog_leadtime: product?.backlog_leadtime
                  ? new Date(product.backlog_leadtime)
                  : new Date(),
                backlog_comments: product?.backlog_comments,
                backlog_priority: product?.backlog_priority,
                updatedDateBacklogComment: product?.updatedDateBacklogComment
                  ? new Date(product.updatedDateBacklogComment)
                  : undefined,
                IsActive: product?.isActive,
                unallocated: result._count._all,
              };
            }),
          ),
        );

      // Fetch allocated products
      const allocatedProducts = await this.prisma.productSerial
        .groupBy({
          by: ['productId'],
          where: {
            status: 'allocated',
            ...whereClause,
          },
          _count: { _all: true },
          orderBy: { product: { backlog_priority: 'asc' } },
        })
        .then((results) =>
          Promise.all(
            results.map(async (result) => {
              const product = await this.prisma.product.findUnique({
                where: { id: result.productId },
                include: { productClass: true, productSubClass: true },
              });
              return {
                class: product?.productClass?.Name,
                subclass: product?.productSubClass?.Name,
                ProductCode: product?.gpn || '',
                ProductID: result.productId,
                backlog_show: product?.backlog_show,
                backlog_leadtime: product?.backlog_leadtime
                  ? new Date(product.backlog_leadtime)
                  : new Date(),
                backlog_comments: product?.backlog_comments,
                backlog_priority: product?.backlog_priority,
                updatedDateBacklogComment: product?.updatedDateBacklogComment
                  ? new Date(product.updatedDateBacklogComment)
                  : undefined,
                IsActive: product?.isActive,
                allocated: result._count._all,
              };
            }),
          ),
        );

      // Fetch open orders
      const openStatuses = [
        'New',
        'Pending',
        'Hold',
        'Accepted',
        'Queue',
        'Partially Shipped',
        'Backordered',
        'Processing',
      ];
      const openProducts = await this.prisma.orderDetail
        .groupBy({
          by: ['productId', 'productCode'],
          where: {
            productId: whereClause.productId,
            order: { orderStatus: { in: openStatuses } },
          },
          _sum: { quantity: true },
          orderBy: { product: { backlog_priority: 'asc' } },
        })
        .then((results) =>
          Promise.all(
            results.map(async (result) => {
              const product = await this.prisma.product.findUnique({
                where: { id: result.productId },
                include: { productClass: true, productSubClass: true },
              });
              const order = await this.prisma.order.findFirst({
                where: {
                  orderDetails: { some: { productId: result.productId } },
                  orderStatus: { in: openStatuses },
                },
              });
              return {
                class: product?.productClass?.Name,
                subclass: product?.productSubClass?.Name,
                ProductCode: result.productCode || '',
                ProductID: result.productId,
                backlog_show: product?.backlog_show,
                backlog_leadtime: product?.backlog_leadtime
                  ? new Date(product.backlog_leadtime)
                  : new Date(),
                backlog_comments: product?.backlog_comments,
                backlog_priority: product?.backlog_priority,
                updatedDateBacklogComment: product?.updatedDateBacklogComment
                  ? new Date(product.updatedDateBacklogComment)
                  : undefined,
                IsActive: product?.isActive,
                open: result._sum.quantity,
                Order_Comments: order?.orderComments,
              };
            }),
          ),
        );

      // Merge products by ProductCode
      const uniqueProducts = new Map<string, GetBackOrderResponseDto>();
      [...unAllocatedProducts, ...allocatedProducts, ...openProducts].forEach(
        (product) => {
          const existing = uniqueProducts.get(product.ProductCode) || {};
          uniqueProducts.set(product.ProductCode, { ...existing, ...product });
        },
      );

      // Convert to array and sort by backlog_priority
      const mergedProducts = Array.from(uniqueProducts.values()).sort(
        (a, b) => (a.backlog_priority || 0) - (b.backlog_priority || 0),
      );

      return mergedProducts;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async uploadFile(reqData: CreateFileDto, url: string, extension: string) {
    let quoteOrderId: number | null = null;

    if (reqData.quoteId) {
      const attachedFile = await this.prisma.attachedFile.findFirst({
        where: { quoteId: reqData.quoteId },
        select: { orderId: true },
      });
      quoteOrderId = attachedFile?.orderId ?? null;
    }

    const data = {
      orderId: reqData.orderId || quoteOrderId || null,
      quoteId: reqData.quoteId || null,
      name: reqData.name,
      type: reqData.fileType,
      file: url,
      uploadedBy: reqData.uploadedBy,
      extension,
    };

    return await this.prisma.attachedFile.create({ data });
  }

  async checkIfQuoteAlreadyAttached(quoteNo: number) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { quoteNo },
        select: { id: true }, // equivalent to SELECT o.OrderID
      });

      return orders;
    } catch (error) {
      console.error('Error in checkIfQuoteAlreadyAttached:', error);
      //   throw new InternalServerErrorException(
      //     'Failed to check quote attachment',
      //   );
    }
  }

  async downloadFile(id: string, res: Response) {
    try {
      // TODO: implement logic
    } catch (error) {
      console.error('Error occurred in downloadFile:', error);
      throw new HttpException(
        'Failed to download file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrackShipping(
    query: GetTrackShippingDto,
  ): Promise<GetTrackShippingResponseDto[]> {
    try {
      const { orderId, shippingId } = query;
      if (
        typeof orderId !== 'number' ||
        isNaN(orderId) ||
        typeof shippingId !== 'number' ||
        isNaN(shippingId)
      ) {
        throw new BadRequestException('Invalid orderId or shippingId');
      }

      const orders = await this.prisma.order.findMany({
        where: { id: orderId },
        include: {
          customer: true,
          orderedBy: true,
          modifiedBy: true,
          salesRep: true,
          quote: true,
          orderDetails: {
            include: { product: true },
          },
          tagTables: true,
          snapshots: {
            include: { modifiedBy: true },
            orderBy: { id: 'desc' },
          },
        },
      });

      if (orders.length === 0) {
        return [{ OrderNotFound: 'OrderNotFound', orderId } as any];
      }

      const trackingItems = await this.prisma.trackingShippingLineItem.findMany(
        {
          where: { orderId, trackShippingId: shippingId },
          orderBy: { displayOrder: 'asc' },
        },
      );

      const notes =
        orders[0].snapshots
          ?.filter((note) => note.orderComments || note.orderNotes)
          .reduce((acc, note, index, arr) => {
            if (
              index === 0 ||
              note.orderComments !== arr[index - 1].orderComments ||
              note.orderNotes !== arr[index - 1].orderNotes
            ) {
              acc.push({
                OrderComments: note.orderComments || '',
                OrderNotes: note.orderNotes || '',
                firstname: note.modifiedBy?.firstname || '',
                lastname: note.modifiedBy?.lastname || '',
                LastModified: note.lastModified
                  ? new Date(note.lastModified)
                  : undefined,
              });
            }
            return acc;
          }, [] as NoteHistoryDto[]) || [];

      const formattedData: GetTrackShippingResponseDto[] = trackingItems.map(
        (tracking) => {
          const matchedOrderDetail = orders[0].orderDetails.find(
            (detail) => detail.productCode === tracking.productCode,
          );
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
            PrivateNotes: orders[0].privateNotes || '',
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
            tagIds: orders[0].tagTables?.map((tt) => tt.tagId) || [],
            notesHistory: notes,
            id: tracking.id,
            trackShippingId: tracking.trackShippingId,
            ProductId: tracking.productId,
            QtyOnPackingSlip: tracking.quantity,
            createdAt: tracking.createdAt
              ? new Date(tracking.createdAt)
              : undefined,
          };
        },
      );

      return formattedData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOpenOrderByProductId(
    query: GetOpenOrderByProductIdDto,
  ): Promise<GetOpenOrderByProductIdResponseDto[]> {
    try {
      const { productId } = query;
      if (typeof productId !== 'number' || isNaN(productId)) {
        throw new BadRequestException('Invalid productId');
      }

      const openStatuses = [
        'Order Placed',
        'Preparing Shipment',
        'Partially Shipped',
        'HOLD- Waiting for prepay',
        'HOLD- Waiting PI approval',
        'Waiting for pickup - EXW',
        'Engineering Services Open',
        'Repair in Process',
        'HOLD- Waiting H/W return',
        'Marketing Material',
        'HOLD- PO Issue',
        'Ready to Ship',
        'Backordered',
        'Proccessing',
      ];

      const orders = await this.prisma.order.findMany({
        where: {
          orderDetails: { some: { productId } },
          orderStatus: { in: openStatuses },
        },
        include: {
          customer: true,
          salesRep: true,
          quote: true,
          orderedBy: true,
          orderDetails: true,
        },
        distinct: ['id'],
        orderBy: { id: 'desc' },
      });

      const formattedData: GetOpenOrderByProductIdResponseDto[] = orders.map(
        (order) => ({
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
          QuoteNo: order.quoteNo || '',
          QuoteDate: order.quote?.quoteDate
            ? new Date(order.quote.quoteDate)
            : undefined,
          InvoiceableOn: order.invoiceableOn
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
          EmailAddress: order.customer?.emailAddress || '',
          OldOrder: order.oldOrder || false,
        }),
      );

      return formattedData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFile(query: DeleteFileDto): Promise<DeleteFileResponseDto> {
    try {
      const { id } = query;
      if (typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('Invalid file ID');
      }

      const result = await this.prisma.attachedFile.updateMany({
        where: { id },
        data: { isDeleted: '1' },
      });

      return {
        success: result.count > 0,
        affectedRows: result.count,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOrder(data: UpdateOrderDto): Promise<UpdateOrderResponseDto> {
    try {
      const { OrderID, ...updateData } = data;
      if (typeof OrderID !== 'number' || isNaN(OrderID)) {
        throw new BadRequestException('Invalid OrderID');
      }

      // Convert Date fields to Date objects if provided
      if (updateData.orderDate)
        updateData.orderDate = new Date(updateData.orderDate);
      if (updateData.shipDate)
        updateData.shipDate = new Date(updateData.shipDate);
      if (updateData.invoiceableOn)
        updateData.invoiceableOn = new Date(updateData.invoiceableOn);
      if (updateData.cancelDate)
        updateData.cancelDate = new Date(updateData.cancelDate);
      if (updateData.lastModified)
        updateData.lastModified = new Date(updateData.lastModified);

      const result = await this.prisma.order.update({
        where: { id: OrderID },
        data: updateData,
      });

      return {
        status: true,
        msg: 'Order Updated.',
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async importOrderFile(
    dto: ImportOrderFileDto,
  ): Promise<ImportOrderFileResponseDto> {
    try {
      if (!Array.isArray(dto.data) || dto.data.length === 0) {
        throw new BadRequestException('Invalid or empty data array');
      }

      // Delete existing imported records
      await this.prisma.orderTrackingNo.deleteMany({
        where: { isImported: true },
      });

      // Process and upsert each record
      let status = true;
      for (const elem of dto.data) {
        try {
          const trackingData = {
            orderId: elem.orderid || 0,
            trackingNo: elem.trackingnumber,
            gateway: elem.gateway,
            shipDate: elem.shipdate ? new Date(elem.shipdate) : undefined,
            shipmentCost: elem.shipment_cost ?? 0,
            shippingMethodId: elem.shippingmethodid,
            Package: elem.package,
            Form: elem.form,
            isImported: true,
          };

          await this.prisma.orderTrackingNo.upsert({
            where: { id: 0 }, // No specific ID for upsert, create new if not found
            update: trackingData,
            create: trackingData,
          });
        } catch (error) {
          status = false;
          // Continue processing other records
        }
      }

      return {
        status,
        msg: status
          ? 'Order tracking data imported successfully.'
          : 'Some records failed to import.',
      };
    } catch (error) {
      return {
        status: false,
        msg: error.message,
        error,
      };
    }
  }
}
