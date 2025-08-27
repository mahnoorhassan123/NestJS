import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
  ConsoleLogger,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateFileDto } from '../dtos/create-file.dto';
import { format } from '@fast-csv/format';
import { createObjectCsvStringifier } from 'csv-writer';
import {
  DeleteFileDto,
  DeleteFileResponseDto,
  GetBackOrderDto,
  GetBackOrderResponseDto,
  GetOpenOrderByProductIdDto,
  GetOrderBySerialDto,
  GetOrderBySerialResponseDto,
  GetOrdersByOpenStatusResponseDto,
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

import axios, { AxiosResponse } from 'axios';
import { parseString } from 'xml2js';
import { request } from 'request';

import { Order, OrderDetail } from '@prisma/client';
import { GetOrdersByStatusDto } from '../dtos/get-orders-by-status.dto';
import { GetOrdersCSVDto } from '../dtos/get-orders-csv.dto';
import { customHeadersMapping, shortHeaders } from '../constants';
import { GetOrdersProductCSVDto } from '../dtos/get-orders-products-csv/dto';
import {
  mapGetOpenOrdersByProductId,
  mapGetOrder,
  mapGetOrderBySerial,
  mapGetOrders,
  mapGetOrdersCSV,
  mapGetOrdersProductsCSV,
  mapGetTrackShipping,
  mapOrderDetails,
  mapOrderDetailToInsert,
  mapOrdersByOpenStatus,
  mapOrdersByStatus,
  mapToInsert,
} from '../mappers/orders.mappers';
import { SlackService } from 'src/common/services/slack.service';
@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private prisma: PrismaService,
    private readonly slackService: SlackService,
  ) {}
  private async waterfall<T>(
    tasks: Array<(result: any) => Promise<any>>,
    initialResult?: any,
  ): Promise<T> {
    let result = initialResult;
    for (const task of tasks) {
      try {
        result = await task(result);
      } catch (err) {
        throw err;
      }
    }
    return result;
  }

  async orderOnVolusion(data: any, res: Response) {
    try {
      var xmlData = data;
      var args = {
        headers: {
          'MIME-Version': '1.0',
          'Content-type': 'text/xml; charset=utf-8',
          'Content-length': xmlData.length.toString(),
          'Content-transfer-encoding': 'text',
          'Request-number': '1',
          'Document-type': 'Request',
          'Interface-Version': 'Test 1.4',
          Connection: 'close',
        },
        data: xmlData,
      };
      const response: AxiosResponse = await axios.post(
        'http://quggv.lmprq.servertrust.com/net/WebService.aspx?Login=developer@intrepidcs.com&EncryptedPassword=' +
          process.env.VOLUSION_PASSWORD +
          '&Import=Insert',
        args,
      );
      return response.data;
    } catch (error) {
      console.error('Error occurred in orderOnVolusion:', error);
      throw new HttpException(
        'Failed to process order on Volusion',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async fileUpload(reqData, url, extension) {
    const { name, fileType, orderId, quoteId, uploadedBy } = reqData;
    const res = quoteId
      ? await this.prisma.attachedFile.findMany({ where: { quoteId: quoteId } })
      : null;
    //  Mysql.query("SELECT orderId FROM attached_files where quoteId = " + quoteId)
    const quoteOrderId = res && res[0] && res[0].orderId;
    return new Promise(async (resolve, reject) => {
      try {
        const id = {
          orderId: orderId || quoteOrderId || null,
          quoteId: quoteId || null,
        };
        const data = {
          name: name,
          type: fileType,
          file: url,
          uploadedBy: uploadedBy,
          extension: extension,
          ...id,
        };
        let response = await this.prisma.attachedFile.create({ data });
        //  Mysql.insert('attached_files', data)
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }

  async sync(res: Response) {
    try {
      var orderUrl =
        'http://quggv.lmprq.servertrust.com/net/WebService.aspx?Login=developer@intrepidcs.com&EncryptedPassword=' +
        process.env.VOLUSION_PASSWORD +
        '&EDI_Name=Generic\\Orders&SELECT_Columns=*';
      var opt = {
        url: orderUrl,
      };
      function callback(error, result, body) {
        parseString(body, function (err, result) {
          if (!err && result && result.xmldata != undefined) {
            if (
              result.xmldata.Orders != undefined &&
              result.xmldata.Orders.length > 0
            ) {
              this.SyncOrders(result.xmldata.Orders, function () {
                res.send(
                  JSON.stringify({
                    status: 'updated',
                    length: result.xmldata.Orders.length,
                  }),
                );
              });
            } else {
              res.send(
                JSON.stringify({
                  status: 'already updated',
                }),
              );
            }
          } else {
            // mailHelper.errorReport({
            // 	subject: "RMA Import Status",
            // 	error: uttils.ERROR_STRING()
            // });
            res.send(
              JSON.stringify({
                status: 'volusion password expired',
              }),
            );
          }
        });
      }
      request(opt, callback);
    } catch (error) {
      console.error('Error occurred in sync:', error);
      throw new HttpException(
        'Failed to sync orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async SyncOrders(orders, insertEndCallback) {
    try {
      if (orders != undefined && orders[0].OrderDetails != undefined) {
        let orderCounter = 0;
        let callbackCount = orders.length;
        const insertOrder = async (order: any) => {
          try {
            await this.waterfall([
              async () => {
                const orderDetails = order.OrderDetails;
                order.SalesTaxRate1 = order.SalesTaxRate1 * 100;
                order.SalesTaxRate2 = order.SalesTaxRate2 * 100;
                order.SalesTaxRate3 = order.SalesTaxRate3 * 100;
                delete order.OrderDetails;

                const upsertResult = await this.prisma.order.upsert({
                  where: { id: order.OrderID },
                  create: {
                    id: order.OrderID,
                    salesTaxRate1: order.SalesTaxRate1,
                    salesTaxRate2: order.SalesTaxRate2,
                    salesTaxRate3: order.SalesTaxRate3,
                    // Add other fields as needed based on your Prisma schema
                  },
                  update: {
                    salesTaxRate1: order.SalesTaxRate1,
                    salesTaxRate2: order.SalesTaxRate2,
                    salesTaxRate3: order.SalesTaxRate3,
                    // Add other fields as needed
                  },
                });

                this.logger.log(
                  `${new Date()} order Info *+*+*+*+**+*+*+*+* affectedRows: ${upsertResult ? 1 : 0}`,
                );
                return orderDetails;
              },
              // Step 2: Process order details
              async (orderDetails: any) => {
                if (orderDetails && orderDetails.length > 0) {
                  await this.prisma.orderDetail.deleteMany({
                    where: { orderId: orderDetails[0].OrderID },
                  });

                  let count = orderDetails.length;
                  for (let j = 0; j < orderDetails.length; j++) {
                    delete orderDetails[j].OrderDetailID;
                    orderDetails[j].displayOrder = j;

                    try {
                      const detailResult = await this.prisma.orderDetail.upsert(
                        {
                          where: {
                            // Adjust unique constraint based on your schema
                            id: orderDetails[0].id,
                          },
                          create: {
                            orderId: orderDetails[j].OrderID,
                            productId: orderDetails[j].ProductID || 0,
                            displayOrder: orderDetails[j].displayOrder,
                            // Add other fields from orderDetails[j]
                          },
                          update: {
                            productId: orderDetails[j].ProductID || 0,
                            displayOrder: orderDetails[j].displayOrder,
                            // Add other fields
                          },
                        },
                      );
                      this.logger.log(
                        `${new Date()} detail Info *+*+*+*+**+*+*+*+* affectedRows: ${detailResult ? 1 : 0}`,
                      );
                    } catch (err) {
                      this.logger.error(
                        `${new Date()} detail Err ================== ${JSON.stringify(err)}`,
                      );
                    } finally {
                      count--;
                    }
                  }

                  if (count !== 0) {
                    throw new Error('Not all order details were processed');
                  }
                }
                return orderDetails;
              },
              // Step 3: Handle recursion
              async () => {
                callbackCount--;
                if (callbackCount === 0) {
                  insertEndCallback();
                } else {
                  orderCounter++;
                  await insertOrder(orders[orderCounter]);
                }
                return null;
              },
            ]);
          } catch (err) {
            this.logger.error(
              `${new Date()} File: order.service.ts, Action: SyncOrders, Error: ${JSON.stringify(err)}`,
            );
            await this.slackService.send(
              `File: order.js, \nAction:SyncOrders , \nError ${err} \n 
							`,
              'J.A.R.V.I.S',
              'C029PF7DLKE',
            );
            console.log(new Date(), 'order Err ================== ', err);

            callbackCount--;
            if (callbackCount === 0) {
              insertEndCallback();
            } else {
              orderCounter++;
              await insertOrder(orders[orderCounter]);
            }
          }
        };
        await insertOrder(orders[orderCounter]);
      } else {
      }
    } catch (err) {
      const error = JSON.stringify(err);
      await this.slackService.send(
        `File: order.js, \nAction:SyncOrders , \nError orders undefined \n
      `,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      console.log(new Date(), 'orders undefined');
    }
  }

  // TESTED WORKS

  async orderOnBlueSky(body: any, res: Response) {
    try {
      body.invoiceableOn = new Date(body.invoiceableOn);
      const order = { ...body };
      if (body.QuoteNo) {
        const response = await this.checkIfQuoteAlreadyAttached(body.QuoteNo);
        if (response ? response.length > 0 : false) {
          return res
            .status(400)
            .json({ error: 'Quote is already attached to an order!' });
        }
      }
      if (body.OrderID) {
        this.InsertOrders(order);
      } else {
        this.InsertOrders(order);
      }
    } catch (error) {
      console.error('Error occurred in orderOnBlueSky:', error);
      throw new HttpException(
        'Failed to process order on Blue Sky',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TESTED WORKS

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
      throw new HttpException(
        'Failed to fetch order packages',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TESTED WORKS

  // TESTED WORKS
  async GetOrderTrack(orderId: number) {
    try {
      const query = `
      SELECT ot.*, COUNT(ts.id) as countOfLineItems, MAX(ts.updatedAt) as latestUpdatedAt
      FROM order_tracking_no ot
      LEFT JOIN tracking_shipping_lineitems ts ON ts.trackShippingId = ot.id
      WHERE ot.OrderID = ${orderId}
      GROUP BY ot.id
      ORDER BY latestUpdatedAt DESC
    `;

      const results: any = await this.prisma.$queryRawUnsafe(query);
      return results && results.length > 0 ? results : [{}];
    } catch (error) {
      console.log(new Date(), error);
      throw new HttpException(
        'failed to get order track',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteOrderTrack(id: number) {
    try {
      const result = await this.prisma.orderTrackingNo.delete({
        where: { id },
      });
      return { status: true, msg: 'Deleted.', result };
    } catch (err) {
      console.error('Error deleting record:', err);
      return { status: false, msg: err.message };
    }
  }

  // TESTED WORKS

  async GetOrdersByStatus(query: GetOrdersByStatusDto) {
    const where: any = { id: { gt: 0 } }; // Base condition: OrderID > 0
    const include: any = {
      customer: { select: { email: true } },
      orderedBy: { select: { firstname: true, lastname: true } },
      salesRep: { select: { firstName: true, lastName: true } },
      quote: { select: { quoteDate: true } },
      orderDetails: { select: { productCode: true } },
      tagTables: { select: { tag: { select: { tagName: true } } } },
    };

    // Constants for status arrays
    const openStatusArray = [
      'Order Placed',
      'Preparing Shipment',
      'HOLD- PO Issue',
      'HOLD- Waiting for prepay',
      'HOLD- Waiting PI approval',
      'Waiting for pickup - EXW',
      'Engineering Services Open',
      'Repair in Process',
      'HOLD- Waiting H/W return',
      'Marketing Material',
      'Ready to Ship',
      'Partially Shipped',
      'Backordered',
      'Processing',
    ];
    const allIncludeCancelOrderStatus = openStatusArray.concat([
      'Cancelled',
      'Shipped',
    ]); // Adjust as needed

    // Global search
    if (query.isGlobal && query.search) {
      const searchTerm = `${query.search}`;
      where.OR = [
        // { id: { contains: typeof(query.search)==='number'? parseInt(query.search) :1 } },
        { orderComments: { contains: searchTerm } },
        { orderNotes: { contains: searchTerm } },
        { poNum: { contains: searchTerm } },
        { billingLastName: { contains: searchTerm } },
        { billingFirstName: { contains: searchTerm } },
        { orderedBy: { firstname: { contains: searchTerm } } },
        { orderedBy: { lastname: { contains: searchTerm } } },
        { customer: { email: { contains: searchTerm } } },
        { shipCountry: { contains: searchTerm } },
        { orderStatus: { contains: searchTerm } },
        // { paymentAmount: { equals: parseFloat(query.search) || undefined } },
        { shipCompanyName: { contains: searchTerm } },
        { billingCompanyName: { contains: searchTerm } },
      ].filter((condition) => condition !== undefined);
    }

    // Individual search
    if (query.isIndividual) {
      where.AND = [
        query.lastName
          ? {
              OR: [
                { billingLastName: { contains: query.lastName } },
                { billingFirstName: { contains: query.lastName } },
              ],
            }
          : undefined,
        query.email
          ? { customer: { email: { contains: query.email } } }
          : undefined,
        query.country
          ? { shipCountry: { contains: query.country } }
          : undefined,
        query.createdBy
          ? {
              OR: [
                { orderedBy: { lastname: { contains: query.createdBy } } },
                { orderedBy: { firstname: { contains: query.createdBy } } },
              ],
            }
          : undefined,
        query.orderStatus
          ? { orderStatus: { contains: query.orderStatus } }
          : undefined,
        query.total
          ? { paymentAmount: { equals: parseFloat(query.total) || undefined } }
          : undefined,
        query.company
          ? {
              OR: [
                { shipCompanyName: { contains: query.company } },
                { billingCompanyName: { contains: query.company } },
              ],
            }
          : undefined,
        query.orderDate
          ? {
              orderDate: {
                equals: new Date(query.orderDate).toISOString().split('T')[0],
              },
            }
          : undefined,
        query.shipDate
          ? {
              shipDate: {
                equals: new Date(query.shipDate).toISOString().split('T')[0],
              },
            }
          : undefined,
      ].filter((condition) => condition !== undefined);
    }

    // Additional filters
    if (query.serialNo) {
      where.orderSerials = { contains: query.serialNo };
    }

    if (query.datesFrom && query.datesTo) {
      const fromDate = new Date(query.datesFrom);
      fromDate.setDate(fromDate.getDate() - 1);
      where.orderDate = {
        gte: fromDate.toISOString(),
        lte: new Date(query.datesTo).toISOString(),
      };
    }

    if (query.status === 'open') {
      where.orderStatus = { in: openStatusArray };
    } else if (query.status === 'allIncludeCanceled') {
      where.orderStatus = { in: allIncludeCancelOrderStatus };
    } else if (query.status === 'PartiallyAndShipped') {
      where.orderStatus = { in: ['Partially Shipped', 'Shipped'] };
    } else if (query.status === 'all') {
      where.orderStatus = { not: 'Cancelled' };
    } else if (query.status) {
      where.orderStatus = { equals: query.status };
    }

    if (query.country && query.country !== 'all') {
      where.shipCountry = { equals: query.country };
    }

    if (query.type && query.type !== 'all') {
      where.orderType = { equals: query.type };
    }

    if (query.productCode && query.productCode.length > 0) {
      where.orderDetails = { some: { productId: { in: query.productCode } } };
    }

    if (query.tags && query.tags.length > 0) {
      where.tagTable = { some: { tagId: { in: query.tags } } };
    }

    if (query.tag_type && query.tag_type !== 'all') {
      where.tagTable = { none: {} };
    }

    // ShippedBy filter (assumed to be salesRep or orderedBy)
    let shippedByFilter = false;
    if (query.shippedBy) {
      shippedByFilter = true;
      where.OR = where.OR || [];
      where.OR.push(
        { salesRep: { firstName: { contains: query.shippedBy } } },
        { salesRep: { lastName: { contains: query.shippedBy } } },
        { orderedBy: { firstname: { contains: query.shippedBy } } },
        { orderedBy: { lastname: { contains: query.shippedBy } } },
      );
    }

    // Sorting
    const orderBy: any =
      query.sortColumn && query.sortOrder && query.sortOrder !== 'null'
        ? {
            [this.mapSortColumn(query.sortColumn)]:
              query.sortOrder.toLowerCase(),
          }
        : { id: 'desc' };

    // Pagination
    const take =
      query.size && !isNaN(query.size) && query.size > 0
        ? query.size
        : undefined;
    const skip =
      query.page && query.size && !isNaN(query.page)
        ? (query.page - 1) * query.size
        : undefined;
    this.printObjectProperties(where.orderDate);
    try {
      // Main query
      const orders = await this.prisma.order.findMany({
        where,
        select: {
          isPayed: true,
          orderNotes: true,
          billingAddress1: true,
          billingAddress2: true,
          poNum: true,
          billingCity: true,
          billingCompanyName: true,
          billingCountry: true,
          billingFaxNumber: true,
          billingFirstName: true,
          billingLastName: true,
          billingPhoneNumber: true,
          billingPostalCode: true,
          billingState: true,
          orderComments: true,
          shipAddress1: true,
          shipAddress2: true,
          shipCity: true,
          shipCompanyName: true,
          shipCountry: true,
          shipDate: true,
          cancelDate: true,
          shipFaxNumber: true,
          shipFirstName: true,
          shipLastName: true,
          shipped: true,
          shipPhoneNumber: true,
          shipPostalCode: true,
          shipState: true,
          orderEntrySystem: true,
          orderSerials: true,
          id: true,
          quoteNo: true,
          invoiceableOn: true,
          customerId: true,
          orderStatus: true,
          paymentAmount: true,
          oldOrder: true,
          orderDate: true,
          customer: { select: { email: true } },
          orderedBy: { select: { firstname: true, lastname: true } },
          salesRep: { select: { firstName: true, lastName: true } },
          quote: { select: { quoteDate: true } },
          orderDetails: { select: { productCode: true } },
          tagTable: { select: { tag: { select: { title: true } } } },
        },
        orderBy,
        take,
        skip,
      });

      // Count query
      const totalCount = await this.prisma.order.count({ where });

      // Sum query
      const totalSumResult = await this.prisma.order.aggregate({
        where,
        _sum: { paymentAmount: true },
      });
      const totalPaymentAmount = totalSumResult._sum.paymentAmount || 0;

      // Transform response
      let paymentAmountSum = 0;
      const transformedOrders = orders.map((order) => {
        paymentAmountSum += order.paymentAmount || 0;
        const tagName = order.tagTable
          .map((tt) => {
            let name = tt.tag?.title || '';
            const changeText = name.indexOf('-');
            if (changeText !== -1) {
              name = name.substring(changeText + 1).trim();
            }
            return name;
          })
          .join(',');
        return mapOrdersByStatus(order, totalCount, tagName, paymentAmountSum);
      });

      // Add totalData and totalPaymentAmount
      return [
        { ...transformedOrders },
        { totalData: totalCount },
        { totalPaymentAmount },
      ];
    } catch (error) {
      console.log(new Date(), 'Error fetching orders:', error.message);
      throw new HttpException(
        `Failed to fetch orders: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private mapSortColumn(column: string): string {
    const orderSortMappings: { [key: string]: string } = {
      orderId: 'id',
      orderStatus: 'orderStatus',
      paymentAmount: 'paymentAmount',
      // Add more mappings as needed
    };
    return orderSortMappings[column] || 'id';
  }

  // TESTED WORKS

  async GetOrdersByOpenStatus() {
    const where: any = {};

    // Apply open status filter if openStatus is true or undefined

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
      'Marketing Material',
      'Ready to Ship',
      'Partially Shipped',
      'Backordered',
      'Processing', // Corrected typos
    ];
    where.orderStatus = { in: openStatuses };

    try {
      const orders = await this.prisma.order.findMany({
        where,
        select: {
          isPayed: true,
          orderNotes: true,
          billingAddress1: true,
          billingAddress2: true,
          poNum: true,
          billingCity: true,
          billingCompanyName: true,
          billingCountry: true,
          billingFaxNumber: true,
          billingFirstName: true,
          billingLastName: true,
          billingPhoneNumber: true,
          billingPostalCode: true,
          billingState: true,
          orderComments: true,
          shipAddress1: true,
          shipAddress2: true,
          shipCity: true,
          shipCompanyName: true,
          shipCountry: true,
          shipDate: true,
          cancelDate: true,
          shipFaxNumber: true,
          shipFirstName: true,
          shipLastName: true,
          shipped: true,
          shipPhoneNumber: true,
          shipPostalCode: true,
          shipState: true,
          orderEntrySystem: true,
          orderSerials: true,
          id: true,
          quoteNo: true,
          invoiceableOn: true,
          customerId: true,
          orderStatus: true,
          paymentAmount: true,
          oldOrder: true,
          orderDate: true,
          customer: {
            select: {
              email: true,
            },
          },
          orderedBy: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          salesRep: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          quote: {
            select: {
              quoteDate: true,
            },
          },
          orderDetails: {
            select: {
              productCode: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      // Transform the response to match the original query's structure
      return orders.map((order) => mapOrdersByOpenStatus(order));
    } catch (error) {
      console.log(new Date(), 'Error fetching orders:', error.message);
      throw new HttpException(
        `Failed to fetch orders: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listOrdersByDate(body: any, res: Response) {
    try {
    } catch (error) {
      console.error('Error occurred in listOrdersByDate:', error);
      throw new HttpException(
        'Failed to fetch orders by date',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TESTED WORKS
  async GetOrders(query: GetOrdersDto) {
    const where: any = {};

    // Handle duration filter
    if (query.duration && query.duration !== 'all') {
      const months = parseInt(query.duration);
      if (isNaN(months)) {
        throw new BadRequestException('Invalid duration value');
      }
      const fromDate = new Date();
      fromDate.setMonth(fromDate.getMonth() - months);
      where.orderDate = { gte: fromDate.toISOString() }; // Convert to ISO string
    }
    // Handle startTime and endTime filter
    else if (query.startTime && query.endTime) {
      const startDate = new Date(query.startTime);
      const endDate = new Date(query.endTime);
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new BadRequestException(
          'Invalid date format for startTime or endTime',
        );
      }
      where.orderDate = {
        gte: startDate.toISOString(), // Convert to ISO string
        lte: new Date(endDate.setDate(endDate.getDate() + 1)).toISOString(), // Include end date
      };
    }
    // Handle openStatus filter
    else if (query.openStatus) {
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
        'Processing', // Corrected typo
      ];
      where.orderStatus = { in: openStatuses };
    }

    try {
      const orders = await this.prisma.order.findMany({
        where,
        select: {
          isPayed: true,
          orderNotes: true,
          billingAddress1: true,
          billingAddress2: true,
          poNum: true,
          billingCity: true,
          billingCompanyName: true,
          billingCountry: true,
          billingFaxNumber: true,
          billingFirstName: true,
          orderDetails: true,
          billingLastName: true,
          billingPhoneNumber: true,
          billingPostalCode: true,
          billingState: true,
          orderComments: true,
          shipAddress1: true,
          shipAddress2: true,
          shipCity: true,
          shipCompanyName: true,
          shipCountry: true,
          shipDate: true,
          cancelDate: true,
          shipFaxNumber: true,
          shipFirstName: true,
          shipLastName: true,
          shipped: true,
          shipPhoneNumber: true,
          shipPostalCode: true,
          shipState: true,
          orderEntrySystem: true,
          orderSerials: true,
          id: true,
          quoteNo: true,
          invoiceableOn: true,
          customerId: true,
          orderStatus: true,
          paymentAmount: true,
          oldOrder: true,
          orderDate: true,
          customer: {
            select: {
              email: true,
            },
          },
          orderedBy: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          salesRep: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          quote: {
            select: {
              quoteDate: true,
            },
          },
        },
        orderBy: { id: 'desc' },
      });

      // Transform the response to match the original query's structure
      return orders.map((order) => mapGetOrders(order));
    } catch (error) {
      console.error('error while fetching orders in getorders function', error);
      throw new HttpException(
        `Failed to fetch orders: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // TESTED WORKS

  async getOrdersCSV(query: GetOrdersCSVDto, res: Response) {
    const where: any = { id: { gt: 0 } };
    const include: any = {
      customer: { select: { email: true } },
      orderedBy: { select: { firstname: true, lastname: true } },
      salesRep: { select: { firstName: true, lastName: true } },
      quote: { select: { quoteDate: true } },
      orderDetails: { select: { productCode: true } },
      tagTable: { select: { tag: { select: { tagName: true } } } },
    };

    // Constants for status arrays
    const openStatusArray = [
      'Order Placed',
      'Preparing Shipment',
      'HOLD- PO Issue',
      'HOLD- Waiting for prepay',
      'HOLD- Waiting PI approval',
      'Waiting for pickup - EXW',
      'Engineering Services Open',
      'Repair in Process',
      'HOLD- Waiting H/W return',
      'Marketing Material',
      'Ready to Ship',
      'Partially Shipped',
      'Backordered',
      'Processing',
    ];
    const allIncludeCancelOrderStatus = openStatusArray.concat([
      'Cancelled',
      'Shipped',
    ]);

    // Global search
    if (query.isGlobal && query.search) {
      const searchTerm = `%${query.search}%`;
      where.OR = [
        // { id: { contains: query.search } },
        { orderComments: { contains: searchTerm } },
        { poNum: { contains: searchTerm } },
        { billingLastName: { contains: searchTerm } },
        { billingFirstName: { contains: searchTerm } },
        { orderedBy: { firstname: { contains: searchTerm } } },
        { orderedBy: { lastname: { contains: searchTerm } } },
        { customer: { email: { contains: searchTerm } } },
        { shipCountry: { contains: searchTerm } },
        { orderStatus: { contains: searchTerm } },
        // { paymentAmount: { equals: parseFloat(query.search) || undefined } },
        { shipCompanyName: { contains: searchTerm } },
        { billingCompanyName: { contains: searchTerm } },
      ].filter((condition) => condition !== undefined);
    }

    // Individual search
    if (query.isIndividual) {
      where.AND = [
        // query.id ? { id: { contains: query.id } } : undefined,
        query.lastName
          ? {
              OR: [
                { billingLastName: { contains: query.lastName } },
                { billingFirstName: { contains: query.lastName } },
              ],
            }
          : undefined,
        query.email
          ? { customer: { email: { contains: query.email } } }
          : undefined,
        query.country
          ? { shipCountry: { contains: query.country } }
          : undefined,
        query.createdBy
          ? {
              OR: [
                { orderedBy: { lastname: { contains: query.createdBy } } },
                { orderedBy: { firstname: { contains: query.createdBy } } },
              ],
            }
          : undefined,
        query.orderStatus
          ? { orderStatus: { contains: query.orderStatus } }
          : undefined,
        query.total
          ? { paymentAmount: { equals: parseFloat(query.total) || undefined } }
          : undefined,
        query.company
          ? {
              OR: [
                { shipCompanyName: { contains: query.company } },
                { billingCompanyName: { contains: query.company } },
              ],
            }
          : undefined,
        query.orderDate
          ? {
              orderDate: {
                equals: new Date(query.orderDate).toISOString().split('T')[0],
              },
            }
          : undefined,
        query.shipDate
          ? {
              shipDate: {
                equals: new Date(query.shipDate).toISOString().split('T')[0],
              },
            }
          : undefined,
      ].filter((condition) => condition !== undefined);
    }

    // Additional filters
    if (query.serialNo) {
      where.orderSerials = { contains: query.serialNo };
    }

    if (query.datesFrom && query.datesTo) {
      const fromDate = new Date(query.datesFrom);
      fromDate.setDate(fromDate.getDate() - 1);
      where.orderDate = {
        gte: fromDate.toISOString(),
        lte: new Date(query.datesTo).toISOString(),
      };
    }

    if (query.status === 'open') {
      where.orderStatus = { in: openStatusArray };
    } else if (query.status === 'allIncludeCanceled') {
      where.orderStatus = { in: allIncludeCancelOrderStatus };
    } else if (query.status === 'PartiallyAndShipped') {
      where.orderStatus = { in: ['Partially Shipped', 'Shipped'] };
    } else if (query.status === 'all') {
      where.orderStatus = { not: 'Cancelled' };
    } else if (query.status) {
      where.orderStatus = { equals: query.status };
    }

    if (query.country && query.country !== 'all') {
      where.shipCountry = { equals: query.country };
    }

    if (query.type && query.type !== 'all') {
      where.orderType = { equals: query.type };
    }

    if (query.productCode && query.productCode.length > 0) {
      where.orderDetails = { some: { productId: { in: query.productCode } } };
    }

    if (query.tags && query.tags.length > 0) {
      where.tagTable = { some: { tagId: { in: query.tags } } };
    }

    if (query.tag_type && query.tag_type !== 'all') {
      where.tagTable = { none: {} };
    }

    try {
      // Query orders
      const orders = await this.prisma.order.findMany({
        where,
        select: {
          isPayed: true,
          orderNotes: true,
          billingAddress1: true,
          billingAddress2: true,
          poNum: true,
          billingCity: true,
          billingCompanyName: true,
          billingCountry: true,
          billingFaxNumber: true,
          billingFirstName: true,
          billingLastName: true,
          billingPhoneNumber: true,
          billingPostalCode: true,
          billingState: true,
          orderComments: true,
          shipAddress1: true,
          shipAddress2: true,
          shipCity: true,
          shipCompanyName: true,
          shipCountry: true,
          shipDate: true,
          cancelDate: true,
          shipFaxNumber: true,
          shipFirstName: true,
          shipLastName: true,
          shipped: true,
          shipPhoneNumber: true,
          shipPostalCode: true,
          shipState: true,
          orderEntrySystem: true,
          orderSerials: true,
          id: true,
          quoteNo: true,
          invoiceableOn: true,
          customerId: true,
          orderStatus: true,
          paymentAmount: true,
          oldOrder: true,
          orderDate: true,
          customer: { select: { email: true } },
          orderedBy: { select: { firstname: true, lastname: true } },
          salesRep: { select: { firstName: true, lastName: true } },
          quote: { select: { quoteDate: true } },
          orderDetails: { select: { productCode: true } },
          tagTable: { select: { tag: { select: { title: true } } } },
        },
        orderBy: { id: 'desc' },
      });

      // Format data
      const formattedResult = orders.map((order) => mapGetOrdersCSV(order));

      // Set CSV headers
      const headers = query.isSmallReport ? shortHeaders : true;
      const writeStream = format({ headers });

      // Set response headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=generatedData.csv',
      );

      // Pipe CSV to response
      writeStream.pipe(res);

      // Write data
      formattedResult.forEach((row) => {
        if (query.isSmallReport) {
          const formattedRow: { [key: string]: any } = {};
          for (const header of shortHeaders) {
            const key = customHeadersMapping[header] || header;
            formattedRow[header] = row[key] || '';
          }
          writeStream.write(formattedRow);
        } else {
          writeStream.write(row);
        }
      });

      writeStream.end();
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrdersProductCSV(query: GetOrdersProductCSVDto, res: Response) {
    const where: any = { id: { gt: 0 } };
    const include: any = {
      customer: { select: { email: true } },
      orderedBy: { select: { firstname: true, lastname: true } },
      salesRep: { select: { firstName: true, lastName: true } },
      quote: { select: { quoteDate: true } },
      orderDetails: { select: { productId: true, productCode: true } }, // Include productId
      tagTable: { select: { tag: { select: { title: true } } } },
    };

    // Constants for status arrays
    const openStatusArray = [
      'Order Placed',
      'Preparing Shipment',
      'HOLD- PO Issue',
      'HOLD- Waiting for prepay',
      'HOLD- Waiting PI approval',
      'Waiting for pickup - EXW',
      'Engineering Services Open',
      'Repair in Process',
      'HOLD- Waiting H/W return',
      'Marketing Material',
      'Ready to Ship',
      'Partially Shipped',
      'Backordered',
      'Processing',
    ];
    const allIncludeCancelOrderStatus = openStatusArray.concat([
      'Cancelled',
      'Shipped',
    ]);

    // Global search
    if (query.isGlobal && query.search) {
      const searchTerm = `%${query.search}%`;
      where.OR = [
        // { id: { contains: query.search } },
        { orderComments: { contains: searchTerm } },
        { poNum: { contains: searchTerm } },
        { billingLastName: { contains: searchTerm } },
        { billingFirstName: { contains: searchTerm } },
        { orderedBy: { firstname: { contains: searchTerm } } },
        { orderedBy: { lastname: { contains: searchTerm } } },
        { customer: { email: { contains: searchTerm } } },
        { shipCountry: { contains: searchTerm } },
        { orderStatus: { contains: searchTerm } },
        // { paymentAmount: { equals: parseFloat(query.search) || undefined } },
        { shipCompanyName: { contains: searchTerm } },
        { billingCompanyName: { contains: searchTerm } },
      ].filter((condition) => condition !== undefined);
    }

    // Individual search
    if (query.isIndividual) {
      where.AND = [
        query.id ? { id: { contains: query.id } } : undefined,
        query.lastName
          ? {
              OR: [
                { billingLastName: { contains: query.lastName } },
                { billingFirstName: { contains: query.lastName } },
              ],
            }
          : undefined,
        query.email
          ? { customer: { email: { contains: query.email } } }
          : undefined,
        query.country
          ? { shipCountry: { contains: query.country } }
          : undefined,
        query.createdBy
          ? {
              OR: [
                { orderedBy: { lastname: { contains: query.createdBy } } },
                { orderedBy: { firstname: { contains: query.createdBy } } },
              ],
            }
          : undefined,
        query.orderStatus
          ? { orderStatus: { contains: query.orderStatus } }
          : undefined,
        query.total
          ? { paymentAmount: { equals: parseFloat(query.total) || undefined } }
          : undefined,
        query.company
          ? {
              OR: [
                { shipCompanyName: { contains: query.company } },
                { billingCompanyName: { contains: query.company } },
              ],
            }
          : undefined,
        query.orderDate
          ? {
              orderDate: {
                equals: new Date(query.orderDate).toISOString().split('T')[0],
              },
            }
          : undefined,
        query.shipDate
          ? {
              shipDate: {
                equals: new Date(query.shipDate).toISOString().split('T')[0],
              },
            }
          : undefined,
      ].filter((condition) => condition !== undefined);
    }

    // Additional filters
    if (query.serialNo) {
      where.orderSerials = { contains: query.serialNo };
    }

    if (query.datesFrom && query.datesTo) {
      const fromDate = new Date(query.datesFrom);
      fromDate.setDate(fromDate.getDate() - 1);
      where.orderDate = {
        gte: fromDate.toISOString(),
        lte: new Date(query.datesTo).toISOString(),
      };
    }

    if (query.status === 'open') {
      where.orderStatus = { in: openStatusArray };
    } else if (query.status === 'allIncludeCanceled') {
      where.orderStatus = { in: allIncludeCancelOrderStatus };
    } else if (query.status === 'PartiallyAndShipped') {
      where.orderStatus = { in: ['Partially Shipped', 'Shipped'] };
    } else if (query.status === 'all') {
      where.orderStatus = { not: 'Cancelled' };
    } else if (query.status) {
      where.orderStatus = { equals: query.status };
    }

    if (query.country && query.country !== 'all') {
      where.shipCountry = { equals: query.country };
    }

    if (query.type && query.type !== 'all') {
      where.orderType = { equals: query.type };
    }

    if (query.productCode && query.productCode.length > 0) {
      where.orderDetails = { some: { productId: { in: query.productCode } } };
    }

    if (query.tags && query.tags.length > 0) {
      where.tagTable = { some: { tagId: { in: query.tags } } };
    }

    if (query.tag_type && query.tag_type !== 'all') {
      where.tagTable = { none: {} };
    }

    try {
      // Query orders
      const orders = await this.prisma.order.findMany({
        where,
        select: {
          isPayed: true,
          orderNotes: true,
          billingAddress1: true,
          billingAddress2: true,
          poNum: true,
          billingCity: true,
          billingCompanyName: true,
          billingCountry: true,
          billingFaxNumber: true,
          billingFirstName: true,
          billingLastName: true,
          billingPhoneNumber: true,
          billingPostalCode: true,
          billingState: true,
          orderComments: true,
          shipAddress1: true,
          shipAddress2: true,
          shipCity: true,
          shipCompanyName: true,
          shipCountry: true,
          shipDate: true,
          cancelDate: true,
          shipFaxNumber: true,
          shipFirstName: true,
          shipLastName: true,
          shipped: true,
          shipPhoneNumber: true,
          shipPostalCode: true,
          shipState: true,
          orderEntrySystem: true,
          orderSerials: true,
          id: true,
          quoteNo: true,
          invoiceableOn: true,
          customerId: true,
          orderStatus: true,
          paymentAmount: true,
          oldOrder: true,
          orderDate: true,
          customer: { select: { email: true } },
          orderedBy: { select: { firstname: true, lastname: true } },
          salesRep: { select: { firstName: true, lastName: true } },
          quote: { select: { quoteDate: true } },
          orderDetails: { select: { productId: true, productCode: true } },
          tagTable: { select: { tag: { select: { title: true } } } },
        },
        orderBy: { id: 'desc' },
      });

      // Format data
      const formattedResult = orders.map((order) =>
        mapGetOrdersProductsCSV(order),
      );

      // Set CSV headers
      const writeStream = format({ headers: true });

      // Set response headers
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=generatedData.csv',
      );

      // Pipe CSV to response
      writeStream.pipe(res);

      // Write data
      formattedResult.forEach((row) => writeStream.write(row));

      writeStream.end();
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // ----------------- GET ORDER -----------------
  async getOrder(id: number) {
    try {
      const orderId = id;
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
          tagTable: true,
          snapshots: {
            include: { modifiedBy: true },
            orderBy: { id: 'desc' },
          },
        },
      });

      if (orders.length === 0) {
        return [{ OrderNotFound: 'OrderNotFound', orderId } as any];
      }

      console.log('this is the length of the orders found', orders.length);
      console.log(orders[0].poNum);

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

      const formattedData = await Promise.all(
        orders.map(async (order) => {
          const orderDetails = order.orderDetails.map((detail) =>
            mapOrderDetails(detail),
          );

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

          return mapGetOrder(order, notes, orderDetails);
        }),
      );

      return formattedData;
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAttachedFiles(orderId: number) {
    try {
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
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getAttachedFilesForQuotes(quoteId: number) {
    try {
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
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async saveOrderNoForQuotes(orderId: number, quoteId: number) {
    try {
      return await this.prisma.attachedFile.updateMany({
        where: { quoteId },
        data: { orderId },
      });
    } catch (error) {
      console.error('error while updating attachedFile', error);
      throw new HttpException(
        'Error while updating attached files',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAttachedFile(id: number) {
    try {
      return this.prisma.attachedFile.findUnique({
        where: { id },
        select: {
          file: true,
          name: true,
          extension: true,
        },
      });
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOrderBySerial(query: GetOrderBySerialDto) {
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

      const formattedData = [mapGetOrderBySerial(order)];

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
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getBackOrder(productCodes: number[]) {
    try {
      // Unallocated products
      const unAllocatedProducts = await this.prisma.productSerial
        .groupBy({
          by: ['productId'],
          where: {
            status: 'unAllocated',
            productId:
              productCodes.length > 1 ? { in: productCodes } : undefined,
            product: {
              isActive: true, // Assuming active products only
            },
          },
          _count: {
            _all: true,
          },
        })
        .then(async (results) => {
          const productIds = results.map((r) => r.productId);
          const products = await this.prisma.product.findMany({
            where: { productId: { in: productIds as any } },
            select: {
              productId: true,
              productCode: true,
              backlogShow: true,
              backlogLeadtime: true,
              backlogComments: true,
              backlogPriority: true,
              updatedDateBacklogComment: true,
              isActive: true,
              productClass: { select: { name: true } },
              productSubClass: { select: { name: true } },
            },
          });

          return results.map((result) => {
            const product = products.find(
              (p) => p.productId === result.productId,
            );
            return {
              class: product?.productClass?.name,
              subclass: product?.productSubClass?.name,
              ProductCode: product?.productCode,
              ProductID: result.productId,
              backlog_show: product?.backlogShow,
              backlog_leadtime: product?.backlogLeadtime
                ? new Date(product.backlogLeadtime)
                : new Date(),
              backlog_comments: product?.backlogComments,
              backlog_priority: product?.backlogPriority,
              updatedDateBacklogComment: product?.updatedDateBacklogComment,
              IsActive: product?.isActive,
              unallocated: result._count._all,
            };
          });
        });

      // Allocated products
      const allocatedProducts = await this.prisma.productSerial
        .groupBy({
          by: ['productId'],
          where: {
            status: 'allocated',
            productId:
              productCodes.length > 1 ? { in: productCodes } : undefined,
            product: {
              isActive: true,
            },
          },
          _count: {
            _all: true,
          },
        })
        .then(async (results) => {
          const productIds = results.map((r) => r.productId);
          const products = await this.prisma.product.findMany({
            where: { productId: { in: productIds as [] } },
            select: {
              productId: true,
              productCode: true,
              backlogShow: true,
              backlogLeadtime: true,
              backlogComments: true,
              backlogPriority: true,
              updatedDateBacklogComment: true,
              isActive: true,
              productClass: { select: { name: true } },
              productSubClass: { select: { name: true } },
            },
          });

          return results.map((result) => {
            const product = products.find(
              (p) => p.productId === result.productId,
            );
            return {
              class: product?.productClass?.name,
              subclass: product?.productSubClass?.name,
              ProductCode: product?.productCode,
              ProductID: result.productId,
              backlog_show: product?.backlogShow,
              backlog_leadtime: product?.backlogLeadtime
                ? new Date(product.backlogLeadtime)
                : new Date(),
              backlog_comments: product?.backlogComments,
              backlog_priority: product?.backlogPriority,
              updatedDateBacklogComment: product?.updatedDateBacklogComment,
              IsActive: product?.isActive,
              allocated: result._count._all,
            };
          });
        });

      // Open products (orders with specific statuses)
      const openProducts = await this.prisma.orderDetail
        .groupBy({
          by: ['productId', 'productCode'],
          where: {
            productId:
              productCodes.length > 1 ? { in: productCodes } : undefined,
            order: {
              orderStatus: {
                in: [
                  'New',
                  'Pending',
                  'Hold',
                  'Accepted',
                  'Queue',
                  'Partially Shipped',
                  'Backordered',
                  'Processing',
                ],
              },
            },
          },
          _sum: {
            quantity: true,
          },
        })
        .then(async (results) => {
          const productIds = results
            .map((r) => r.productId)
            .filter((id) => id !== null);
          const products = await this.prisma.product.findMany({
            where: { productId: { in: productIds as number[] } },
            select: {
              productId: true,
              productCode: true,
              backlogShow: true,
              backlogLeadtime: true,
              backlogComments: true,
              backlogPriority: true,
              updatedDateBacklogComment: true,
              isActive: true,
              productClass: { select: { name: true } },
              productSubClass: { select: { name: true } },
            },
          });

          return results.map((result) => {
            const product = products.find(
              (p) => p.productId === result.productId,
            );
            return {
              class: product?.productClass?.name,
              subclass: product?.productSubClass?.name,
              ProductCode: result.productCode,
              ProductID: result.productId,
              backlog_show: product?.backlogShow,
              backlog_leadtime: product?.backlogLeadtime
                ? new Date(product.backlogLeadtime)
                : new Date(),
              backlog_comments: product?.backlogComments,
              backlog_priority: product?.backlogPriority,
              updatedDateBacklogComment: product?.updatedDateBacklogComment,
              IsActive: product?.isActive,
              open: result._sum.quantity,
              Order_Comments: '', // Not fetched; adjust if needed
            };
          });
        });

      // Merge products by ProductCode
      const arrayOfProducts = [
        ...unAllocatedProducts,
        ...allocatedProducts,
        ...openProducts,
      ];
      const uniqueProducts: { [key: string]: any } = {};

      arrayOfProducts.forEach((elem) => {
        uniqueProducts[elem.ProductCode ?? -1] =
          uniqueProducts[elem.ProductCode ?? -1] || {};
        uniqueProducts[elem.ProductCode ?? -1] = {
          ...uniqueProducts[elem.ProductCode ?? -1],
          ...elem,
        };
      });

      const mergedProducts = Object.keys(uniqueProducts)
        .map((productCode) => uniqueProducts[productCode])
        .sort((a, b) => (a.backlog_priority || 0) - (b.backlog_priority || 0));

      return mergedProducts;
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async uploadFile(reqData: CreateFileDto, url: string, extension: string) {
    try {
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
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async checkIfQuoteAlreadyAttached(quoteNo: number) {
    try {
      const orders = await this.prisma.order.findMany({
        where: { quote: { quoteNo } },
        select: { id: true }, // equivalent to SELECT o.OrderID
      });

      return orders;
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTrackShipping(query: GetTrackShippingDto): Promise<any[]> {
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
          tagTable: true,
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

      const formattedData = trackingItems.map((tracking) => {
        const matchedOrderDetail = orders[0].orderDetails.find(
          (detail) => detail.productCode === tracking.productCode,
        );
        return mapGetTrackShipping(tracking, orders, matchedOrderDetail, notes);
      });

      return formattedData;
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getOpenOrderByProductId(productId: number): Promise<any[]> {
    try {
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

      const formattedData = orders.map((order) =>
        mapGetOpenOrdersByProductId(order),
      );

      return formattedData;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteFile(id: number): Promise<DeleteFileResponseDto> {
    try {
      if (typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('Invalid file ID');
      }

      const result = await this.prisma.attachedFile.updateMany({
        where: { id },
        data: { isDeleted: true },
      });

      return {
        success: result.count > 0,
        affectedRows: result.count,
      };
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrder(data: any): Promise<UpdateOrderResponseDto> {
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
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
            trackingNo: elem.trackingnumber ?? '',
            gateway: elem.gateway,
            shipDate: elem.shipdate ? new Date(elem.shipdate) : undefined,
            shipmentCost: elem.shipment_cost ?? 0,
            shippingMethodId: elem.shippingmethodid,
            Package: elem.package,
            Form: elem.form,
            isImported: true,
          };

          await this.prisma.orderTrackingNo.upsert({
            where: { id: 0 },
            update: trackingData,
            create: trackingData,
          });
        } catch (error) {
          status = false;
        }
      }

      return {
        status,
        msg: status
          ? 'Order tracking data imported successfully.'
          : 'Some records failed to import.',
      };
    } catch (error) {
      console.error(new Date(), 'Error generating CSV:', error.message);
      throw new HttpException(
        'failed to get orders products csv',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  printObjectProperties(obj) {
    console.log('going to print the object :');
    for (const property in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, property)) {
        console.log(`${property}: ${obj[property]}`);
      }
    }
  }

  //      TESTED WORKS
  async InsertOrders(order) {
    try {
      if (order && order.OrderDetails) {
        order.OrderDate = order.OrderDate.replace(/\?/g, ' ');
        var dataForEmail = JSON.parse(JSON.stringify(order));
        var OrderDetails = order.OrderDetails;
        let tags: number[] = [];
        if (order.TagsArray) {
          tags = [...new Set(order.tagsArray)] as number[];
        }
        var quoteId = order.QuoteNo;
        let toShippedTotal = 0;
        var userId = order.UserId;
        var shippedBy = order.ShippedBy;
        delete order.ShippedBy;
        let TrackingNo = 'N/A';
        if (order.TrackingNo) {
          TrackingNo = order.TrackingNo;
        }
        if (order.Parcels && order.OrderID) {
          var parcels = order.Parcels;
          parcels.map((elem) => {
            if (elem.OrderNotFound) delete elem.OrderNotFound;
            else delete elem.OrderNotFound;
            elem.orderId = order.OrderID;
          });
          delete order.Parcels;
        }
        delete order.OrderDetails;
        delete order.TagsArray;
        try {
          if (!order.OrderID) {
            await Promise.all(
              OrderDetails.map(async (orderDetail) => {
                const productID = orderDetail.ProductID;
                const productHoldStatus =
                  productID &&
                  (await this.prisma.product.findMany({
                    where: { productId: productID },
                  }));
                if (productHoldStatus && productHoldStatus[0].holdForApproval) {
                  order.OrderStatus = 'HOLD- Order approval';
                }
              }),
            );
          }
        } catch (error) {
          console.error('error while inserting orders', error);
          // err = JSON.stringify(error.message)
          // slack(`File: order.js, \nAction:InsertOrders While checking hold status, \nError ${err} \n
          // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
          return {
            status: false,
            error: error,
            data: undefined,
          };
        }
        try {
          if (!order.OrderID) {
            console.log('id was undefined');
            const record = await this.prisma.order.aggregate({
              _max: {
                id: true, // Select the maximum value of the `id` field
              },
            });

            console.log('this was the max id', record._max.id ?? '00');

            if (record._max.id ? record._max.id > 0 : false) {
              console.log('this was the max id', record._max.id ?? '00');
              var id = record._max.id ? record._max.id : 0;
              if (!id || id < 50000) {
                id = 50001;
              } else {
                id = id + 1;
              }
              order.OrderID = id;
            } else {
              var id = 1;
              order.OrderID = 1;
            }
          } else {
            var id: number = order.OrderID;
          }
        } catch (error) {
          console.log(
            new Date(),
            error,
            ' error while adding orders in insert orders',
          );
          // err = JSON.stringify(error.message)
          // slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n
          // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
          return {
            status: false,
            error: error,
            data: undefined,
          };
        }

        console.log('this is the new orderid now', order.OrderID);
        //shipping track
        try {
          let orderStatus = await this.prisma.tagTable.deleteMany({
            where: {
              tableId: order.OrderID,
            },
          });
        } catch (error) {
          console.log(error.message, 'tag_tables error');
        }
        if (tags && tags.length > 0) {
          for (let index = 0; index < tags.length; index++) {
            let tag = {
              tableId: order.OrderID,
              tableName: 'orders',
              tagId: tags[index],
            };
            try {
              let responseOfTagSave = await this.prisma.tagTable.create({
                data: tag,
              });
            } catch (error) {
              console.error(new Date(), error, ' error while adding tags');
              // err = JSON.stringify(error.message)
              // slack(`File: order.js, \nAction:InsertOrders While insertTags, \nError ${err} \n
              // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
              return {
                status: false,
                error: error,
                data: undefined,
              };
            }
          }
        }
        try {
          OrderDetails.map(async (OrderDetail, index) => {
            toShippedTotal += OrderDetail.qutantityForTrackToShipped
              ? OrderDetail.qutantityForTrackToShipped
              : 0;
            delete OrderDetail.qutantityForTrackToShipped;
          });
          if (
            order.OrderStatus != undefined &&
            (order.OrderStatus == 'Shipped' ||
              order.OrderStatus == 'Partially Shipped') &&
            toShippedTotal > 0
          ) {
            let Gateway = 'OTHER';
            if (
              order.ShippingMethodID &&
              order.ShippingMethodID >= 700 &&
              order.ShippingMethodID < 800
            )
              Gateway = 'UPS';
            else if (
              order.ShippingMethodID &&
              order.ShippingMethodID >= 400 &&
              order.ShippingMethodID < 500
            )
              Gateway = 'DHL';
            let trackObj = {
              trackingNo: TrackingNo, // String
              gateway: Gateway, // String
              shipDate: order.ShipDate, // String (needs to be converted to DateTime)
              orderId: order.OrderID, // Int
              shipmentCost: order.TotalShippingCost, // Float
              shippingMethodID: order.ShippingMethodID
                ? order.ShippingMethodID
                : 0, // Int
              orderType: order.OrderStatus, // String
              updatedBy: order.LastModBy, // Int
            };
            let result = await this.prisma.orderTrackingNo.upsert({
              where: {
                trackingNo: TrackingNo,
              },
              create: trackObj,
              update: trackObj,
            });
            //  Mysql.insertUpdate('order_tracking_no', trackObj, trackObj)
            try {
              await Promise.all(
                OrderDetails.map(async (OrderDetail, index) => {
                  let trackLineItemObject = {
                    trackShippingId: result.id,
                    orderId: id,
                    displayOrder: index,
                    quantity: OrderDetail.QtyOnPackingSlip,
                    productId: OrderDetail.ProductID,
                    productCode: OrderDetail.ProductCode,
                    productDescription: OrderDetail.Discription,
                    isChild: OrderDetail.isChild,
                    createdAt: new Date(),
                    createdBy: userId,
                    updatedAt: new Date(),
                    updatedBy: order.LastModBy,
                  };
                  try {
                    const responseOfTrackingShippingLineItems =
                      await this.prisma.trackingShippingLineItem.create({
                        data: trackLineItemObject,
                      });
                  } catch (error) {
                    console.log(error);
                    return {
                      status: false,
                      error: error,
                      data: undefined,
                    };
                  }
                }),
              );
            } catch (error) {
              console.log(error);
              return {
                status: false,
                error: error,
                data: undefined,
              };
            }
          }
        } catch (e) {
          console.log(e);
          return {
            status: false,
            error: e,
            data: undefined,
          };
        }
        //shipping track

        try {
          if (
            order.OrderStatus != undefined &&
            (order.OrderStatus == 'Shipped' ||
              order.OrderStatus == 'Partially Shipped') &&
            toShippedTotal <= 0
          )
            delete order.ShipDate;
          else {
            if (
              order.OrderStatus != undefined &&
              (order.OrderStatus == 'Shipped' ||
                order.OrderStatus == 'Partially Shipped')
            ) {
              order.ShipDate = new Date();
              order.ShipDate = new Date(order.ShipDate)
                .toLocaleString('en-US')
                .replace(',', '');
              order.ShippedBy = shippedBy;
            }
          }
          let OrderToInsert = {};
          for (const key in order) {
            if (order[key] || order[key] == 0 || order[key] == '') {
              OrderToInsert[key] = order[key];
            }
          }
          const mappedToInsert = mapToInsert(OrderToInsert);
          await this.prisma.order.upsert({
            where: { id: id }, // ORDER.ORDERID WAS BEING USED HERE
            create: mappedToInsert as Order,
            update: mappedToInsert,
          });
          var orderStatus = await this.prisma.order.findMany({
            where: { id: id }, // ORDER.ORDERID WAS BEING USED HERE
          });
          // if (orderStatus[0].Order_Entry_System == 'ONLINE') {
          // 	if (orderStatus != undefined
          // 		&&
          // 		order.OrderStatus == 'Shipped' ||
          // 		order.OrderStatus == 'Partially Shipped' ||
          // 		order.OrderStatus == 'Preparing Shipment') {
          // 		var shippingMethod = []
          // 		var customerEmail = await Mysql.query("select * from customers where CustomerID = " + order.CustomerID)
          // 		if (orderStatus[0].ShippingMethodID)
          // 			shippingMethod = await Mysql.query("select * from shipping_methods where id = " + orderStatus[0].ShippingMethodID)
          // 		dataForEmail.EmailAddress = customerEmail[0].EmailAddress
          // 		dataForEmail.OrderStatus = order.OrderStatus
          // 		dataForEmail.CurrencyCode = '$';
          // 		dataForEmail.CC_Last4 = orderStatus[0].CC_Last4 ? orderStatus[0].CC_Last4 : "N/A";
          // 		dataForEmail.Service = shippingMethod[0] ? shippingMethod[0].name : 'N/A';
          // 		sendOrderStatusMail(dataForEmail);
          // 	}
          // }
        } catch (error) {
          // err = JSON.stringify(error.message)
          console.error(new Date(), error, ' error while inserting order');
          // slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n
          // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
          console.log(
            new Date(),
            'order Err ================== ',
            error,
            ' error while inserting order',
          );
          return {
            status: false,
            error: error,
            data: undefined,
          };
        }
        //packages
        if (parcels && order.OrderID) {
          try {
            await this.prisma.orderPackage.deleteMany({
              where: { orderId: order.OrderID },
            });
            // Mysql.query("Delete from order_packages where OrderID = " + order.OrderID)
          } catch (error) {
            // err = JSON.stringify(error.message)
            console.error(new Date(), error);
            // slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n
            // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
            console.error(new Date(), error);
            return {
              status: false,
              error: error,
              data: undefined,
            };
            return;
          }

          try {
            parcels.forEach(async (elem) => {
              try {
                await this.prisma.orderPackage.create({ data: elem });
                //  Mysql.insert('order_packages', elem)
              } catch (e) {
                console.log('order_packages', e);
                return {
                  status: false,
                  error: e,
                  data: undefined,
                };
              }
            });
          } catch (e) {
            console.log('order_packages', e);
            return {
              status: false,
              error: e,
              data: undefined,
            };
          }
        }
        //packages
        try {
          await this.prisma.orderDetail.deleteMany({
            where: { orderId: order.OrderID },
          });
          // Mysql.query("Delete from order_details where OrderID = " + id)
        } catch (error) {
          // err = JSON.stringify(error.message)
          console.log(new Date(), error, 'error while inserting order');
          // slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n
          // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
          console.log(new Date(), error, ' error while inserting order');
          return {
            status: false,
            error: error,
            data: undefined,
          };
        }
        try {
          if (
            orderStatus != undefined &&
            (order.OrderStatus == 'Partially Shipped' ||
              order.OrderStatus == 'Shipped')
          ) {
            await this.prisma.productSerial.updateMany({
              where: { orderId: id },
              data: { status: 'shipped', orderId: id, type: 'products' },
            });
            //  Mysql.update('product_serials', { OrderID: id }, { status: "shipped", OrderID: id,type:"products" })
          }
          if (
            orderStatus != undefined &&
            (order.OrderStatus == 'Cancelled' ||
              order.OrderStatus == 'Returned')
          ) {
            const response = await this.prisma.productSerial.findMany({
              where: { orderId: id },
            });
            // Mysql.query("select * from product_serials where OrderID = " + id);
            if (response.length) {
              Promise.all(
                response.map(async (serial) => {
                  await this.prisma.productSerial.updateMany({
                    where: { productId: serial.productId },
                    data: {
                      status: 'unAllocated',
                      orderId: null,
                      type: serial.groupId === null ? 'products' : 'groups',
                      productId:
                        serial.groupId === null
                          ? serial.productId
                          : serial.groupId,
                    },
                  });
                  //  Mysql.update('product_serials', { ProductID: serial.ProductID }, { status: "unAllocated", OrderID: null,type: serial.groupId === null ? "products" : "groups" , ProductID : serial.groupId === null ? serial.ProductID : serial.groupId })
                }),
              );
            }
          }
        } catch (error) {
          // err = JSON.stringify(error.message)
          console.log(new Date(), error, ' error while inserting order');
          // slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n
          // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
          console.log(
            new Date(),
            'Error updating product_serials by order, mysql error:',
            error,
          );
          return {
            status: false,
            error: error,
            data: undefined,
          };
        }
        try {
          if (quoteId) {
            await this.prisma.quote.updateMany({
              where: { quoteNo: quoteId },
              data: { isOrdered: true, orderBy: userId, orderId: id },
            });
          }
          // Mysql.update('quotes', {
          // 	QuoteNo: quoteId
          // }, {
          // 	isOrdered: true,
          // 	orderBy: userId,
          // 	orderId: id
          // })
        } catch (error) {
          // err = JSON.stringify(error.message)
          console.log(new Date(), error, ' error while inserting order');
          // slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n
          // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
          console.log(
            new Date(),
            'Error updating quote for order, mysql error:',
            error,
          );
          return {
            status: false,
            error: error,
            data: undefined,
          };
        }
        try {
          await Promise.all(
            OrderDetails.map(async (OrderDetail, index) => {
              delete OrderDetail.CategoryOptions;
              delete OrderDetail.availableOptions;
              delete OrderDetail.isSerialAble;
              delete OrderDetail.isMultiClassification;
              OrderDetail.displayOrder = index;
              OrderDetail.OrderID = id;
              const OrderDetailToInsert = {};
              for (const key in OrderDetail) {
                if (
                  OrderDetail[key] ||
                  OrderDetail[key] == 0 ||
                  OrderDetail[key] == ''
                ) {
                  OrderDetailToInsert[key] = OrderDetail[key];
                }
              }
              const mappedOrderDetail =
                mapOrderDetailToInsert(OrderDetailToInsert);
              this.printObjectProperties(OrderDetailToInsert);
              await this.prisma.orderDetail.create({
                data: mappedOrderDetail as OrderDetail,
              });
              return {
                status: true,
                msg: 'Orders Inserted',
                result: {
                  fieldCount: 0,
                  affectedRows: 1,
                  // "insertId": 1781,
                  serverStatus: 2,
                  warningCount: 0,
                  message: '',
                  protocol41: true,
                  changedRows: 0,
                },
              };
              //  Mysql.insert('order_details', OrderDetailToInsert)
            }),
          );
        } catch (error) {
          // err = JSON.stringify(error.message)
          console.log(new Date(), error, ' error while inserting order');
          // slack(`File: order.js, \nAction:InsertOrders , \nError ${err} \n
          // `, 'J.A.R.V.I.S', 'C029PF7DLKE')
          console.log(new Date(), 'detail Err ================== ', error);
          return {
            status: false,
            error: error,
            data: undefined,
          };
        }
        return { status: true, error: undefined, data: { id: id } };

        // Mysql.query("Delete FROM orders where OrderID = " + id, {}).then(function (records) {
        // 	Mysql.query("Delete FROM order_details where OrderID = " + id, {}).then(function (records) {
        // 		insertEndCallback({
        // 			status: false,
        // 			error: err,
        // 		});
        // 	}).catch(function (err) {
        // 		console.log(new Date(), 'Error fetching record, mysql error:', err.message);
        // 	});
        // }).catch(function (err) {
        // 	console.log(new Date(), 'Error fetching record, mysql error:', err.message);
        // });
      } else {
        // slack(`File: order.js, \nAction:InsertOrders , \nError orders or order details undefined \n`, 'J.A.R.V.I.S', 'C029PF7DLKE')
        console.log(new Date(), 'order undefined');
      }
    } catch (error) {
      // err = JSON.stringify(error.message)
      console.log(new Date(), error);
      await this.slackService.send(
        `File: order.js, \nAction:InsertOrders , \nError ${error} \n
      `,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      console.log(
        new Date(),
        'detail Err asdsadsadasdas================== ',
        error,
      );
      return {
        status: false,
        error: error,
        data: undefined,
      };
    }
  }

  async update(data) {
    const where = {
      id: data.OrderID,
    };

    try {
      await this.prisma.order.updateMany({ where, data });
    } catch (err) {
      const error = JSON.stringify(err.message);
      await this.slackService.send(
        `File: order.js, \nAction:update , \nError ${error} \n
      `,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      console.log(new Date(), err.message);
    }
  }
}
