import { HttpStatus, Injectable, Logger, ParseIntPipe } from '@nestjs/common';
import { Prisma, Quote, QuoteLineItem } from '@prisma/client';
import { timeStamp } from 'console';
import moment from 'moment';
import { SlackService } from 'src/common/services/slack.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CloneQuoteDto,
  CreateQuoteDto,
  QuoteSearchBodyDto,
  QuoteSearchParamsDto,
  UpdateQuoteDto,
} from '../dtos/create-quote.dto';
import { QuoteMapper } from '../mappers/quote.mapper';
import {
  GetOrdersByStatusDto,
  GetOrdersDto,
  ImportOrderTrackingDto,
  UpdateOrderDto,
} from '../dtos/orders.dto';
import { OrderEntity } from 'src/order/entities/order.entity';
import { orderMappers } from 'src/order/mappers/orders.mappers';
import { Response } from 'express';
import { format } from 'fast-csv';
import { map } from 'rxjs';
@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name);

  constructor(
    private prisma: PrismaService,
    private readonly slackService: SlackService,
  ) {}

  async cloneQuote(data: CloneQuoteDto) {
    try {
      let userId = data.userId;
      const results = await this.prisma.quote.findMany({
        where: { QuoteNo: data.quoteNo },
      });
      if (results.length > 0) {
        let result: any = results[0];
        delete result.modBy;
        delete result.ValidTill;
        delete result.modifiedOn;
        delete result.createdBy;
        delete result.QuoteNo;
        delete result.QuoteDate;
        delete result.isOrdered;
        result.createdBy = userId;
        result.QuoteDate = new Date();
        result.ValidTill = new Date();
        result.ValidTill.setMonth(result.ValidTill.getMonth() + 1);

        const mappedQuoteToInsert = QuoteMapper.mapQuoteToPrismaModel(result);
        const newQuoteResult = await this.prisma.quote.create({
          data: mappedQuoteToInsert,
        });
        console.log('this is the mappedquoteresult: ', newQuoteResult.QuoteNo);
        result.QuoteNo = newQuoteResult.QuoteNo;

        const lineItems = await this.prisma.quoteLineItem.findMany({
          where: { QuoteNo: data.quoteNo },
          orderBy: { display_order: 'desc' },
        });

        if (lineItems.length > 0) {
          console.log('this is the lineItems: ', lineItems.length);

          // Use for...of to handle async operations
          for (const item of lineItems as any) {
            item.QuoteNo = result.QuoteNo;
            delete item.LineID;

            await this.prisma.quoteLineItem.create({
              data: item,
            });
          }

          // Fetch and return the cloned quote after all line items are created
          const clonedQuote = await this.prisma.quote.findFirst({
            where: {
              QuoteNo: result.QuoteNo,
            },
            include: {
              customer: true,
            },
          });
          console.log('this is the mappedquoteresult: ', clonedQuote?.QuoteNo);
          return clonedQuote;
        } else {
          const clonedQuote = await this.prisma.quote.findFirst({
            where: {
              QuoteNo: result.QuoteNo,
            },
            include: {
              customer: true,
            },
          });
          console.log(
            'came in the else condition and the clonedQuote is this',
            clonedQuote,
          );
          return clonedQuote;
        }
      }
      return { success: true, message: 'No quote with this id exists' };
    } catch (err) {
      console.error('error while cloning quote', err);
      const error = JSON.stringify(err);
      this.slackService.send(
        `File: db.js, \nAction: CloneQuote, \nError ${error}  \n`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      return { error: err.message };
    }
  }

  async GetQuoteNew(orderId: number) {
    try {
      console.log('starting get Quote New');
      const results = await this.prisma.quote.findMany({
        where: {
          QuoteNo: orderId,
        },
        select: {
          QuoteNo: true,
          QuoteDate: true,
          ValidTill: true,

          modifiedOn: true,
          insuranceValue: true,
          quoteComments: true,
          customFieldCarrierAcctNo: true,
          modBy: true,
          endUserId: true,
          isOrdered: true,
          isApproved: true,
          shippingMethodId: true,
          quoteNotes: true,
          totalShippingCost: true,
          salesTaxRate1: true,
          salesTax1: true,
          isCustomerNameShow: true,
          orderId: true,
          customerId: true,
          billingCompanyName: true,
          shipCompanyName: true,
          shipFirstName: true,
          shipLastName: true,
          billingEmailAddress: true,
          billingFirstName: true,
          billingLastName: true,
          billingAddress1: true,
          billingAddress2: true,
          billingCity: true,
          billingCountry: true,
          billingState: true,
          billingPhoneNumber: true,
          isTaxExempt: true,
          billingPostalCode: true,
          shipAddress1: true,
          shipAddress2: true,
          shipCity: true,
          shipCountry: true,
          shipState: true,
          shipPhoneNumber: true,
          shipPostalCode: true,
          isCustomerEmailShow: true,
          shipEmailAddress: true,
          user: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          modifiedBy: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          QuoteLineItem: {
            select: {
              OptionID: true,
              categoryIdOfOption: true,
              Options: true,
              TaxableProduct: true,
              parent: true,
              parentName: true,
              Product_Subclass: true,
              isChild: true,
              isCategoriesOption: true,
              ProductCode: true,
              ProductName: true,
              Discription: true,
              ProductWeight: true,
              Quantity: true,
              ProductPrice: true,
              DiscountValue: true,
              displayOrder: true,
            },
            orderBy: {
              displayOrder: 'asc',
            },
          },
        },
      });

      console.log(results);
      if (results.length > 0) {
        let tagsArray = await this.prisma.tagTable.findMany({
          where: { tableId: orderId },
          select: { tagId: true },
        });

        // await Mysql.query(query);

        const enrichedQuote = {
          ...results,
          tagsArray: tagsArray ? tagsArray.map((elem) => elem.tagId) : null,
          IssueDatePDF: results[0].QuoteDate
            ? moment(new Date(results[0].QuoteDate)).format('YYYY-MM-DD')
            : null,
          ValidTillPDF: results[0].ValidTill
            ? moment(new Date(results[0].ValidTill)).format('YYYY-MM-DD')
            : null,
        };

        results[0] = enrichedQuote as any;
        return results;
      } else {
        return {
          OrderNotFound: 'OrderNotFound',
          orderId: orderId,
        };
      }
    } catch (err) {
      console.error('error while fetching new quote', err);
      const error = JSON.stringify(err.message);
      this.slackService.send(
        `File: quotes.js, \nAction:GetQuote , \nError ${error} \n 
  			`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      console.log(new Date(), error);
      return { status: false, error: error };
      // reject(err);
    }
  }

  async RemoveQuote(quoteId: number, Res: Response) {
    try {
      // Use a transaction to ensure all deletions happen atomically
      const result = await this.prisma.$transaction(async (prisma) => {
        // 1. Delete related QuoteLineItem records
        await prisma.quoteLineItem.deleteMany({
          where: { QuoteNo: quoteId },
        });

        // 2. Delete related AttachedFile records
        await prisma.attachedFile.deleteMany({
          where: { quoteId: quoteId },
        });

        // 3. Delete related TagTable records
        await prisma.tagTable.deleteMany({
          where: { quoteId: quoteId },
        });

        // 4. Check if an Order references this Quote
        const order = await prisma.order.findFirst({
          where: { quoteNo: quoteId },
        });

        if (order) {
          // If an Order exists, you need to handle it (e.g., nullify or delete)
          // Option 1: Nullify the quoteNo in Order (if business logic allows)
          await prisma.order.update({
            where: { id: order.id },
            data: { quoteNo: null },
          });
          // Option 2: Delete the Order (uncomment if this is the desired behavior)
          // await prisma.order.delete({
          //   where: { id: order.id },
          // });
        }

        // 5. Delete the Quote
        const quoteResult = await prisma.quote.delete({
          where: { QuoteNo: quoteId },
        });

        return Res.status(HttpStatus.OK).json({
          success: true,
          data: quoteResult,
        });
      });

      return result;
    } catch (err) {
      console.error('Error while removing quote:', err);
      const error = JSON.stringify(err.message);
      // Uncomment if you want to send to Slack
      // await this.slackService.send(
      //   `File: db.js, \nAction: RemoveQuote, \nError ${error} \n`,
      //   'J.A.R.V.I.S',
      //   'C029PF7DLKE',
      // );
      return Res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        data: err.message,
      });
    }
  }

  async getAllQuotes(
    params: { duration: string; tags: string; products: string },
    query: QuoteSearchParamsDto,
  ) {
    const page = parseInt(query.page ?? '1') || 1;
    const size = parseInt(query.size ?? '10') || 10;
    const isGlobal = query.isGlobal === 'true';
    const isIndividual = query.isIndividual === 'true';
    const offset = (page - 1) * size;

    // Build where conditions
    let where: Prisma.QuoteWhereInput = {
      isApproved: true,
    };

    if (params.duration && params.duration !== 'all') {
      const months = parseInt(params.duration);
      where.QuoteDate = {
        gte: new Date(
          new Date().setMonth(new Date().getMonth() - months),
        ).toISOString(),
      };
    }

    // Global search
    if (isGlobal && query.search) {
      const search = query.search;
      const numericSearch = parseFloat(search);
      where.OR = [
        !isNaN(numericSearch) ? { QuoteNo: { equals: numericSearch } } : {},
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
        { customer: { city: { contains: search, mode: 'insensitive' } } },
        { user: { firstname: { contains: search, mode: 'insensitive' } } },
        { user: { lastname: { contains: search, mode: 'insensitive' } } },
        !isNaN(numericSearch)
          ? { paymentAmount: { equals: numericSearch } }
          : {},
        { shipCompanyName: { contains: search, mode: 'insensitive' } },
        { billingCompanyName: { contains: search, mode: 'insensitive' } },
      ].filter((condition) => Object.keys(condition).length > 0);
    }

    // Individual search
    if (isIndividual) {
      const andConditions: Prisma.QuoteWhereInput[] = [
        query.id && !isNaN(parseInt(query.id))
          ? { QuoteNo: { equals: parseInt(query.id) } }
          : {},
        query.lastName
          ? {
              OR: [
                {
                  customer: {
                    lastName: {
                      contains: query.lastName,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  customer: {
                    firstName: {
                      contains: query.lastName,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            }
          : {},
        query.email
          ? {
              customer: {
                email: { contains: query.email, mode: 'insensitive' },
              },
            }
          : {},
        query.city
          ? {
              customer: {
                city: { contains: query.city, mode: 'insensitive' },
              },
            }
          : {},
        query.createdBy
          ? {
              OR: [
                {
                  user: {
                    lastname: {
                      contains: query.createdBy,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  user: {
                    firstname: {
                      contains: query.createdBy,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            }
          : {},
        query.total && !isNaN(parseFloat(query.total))
          ? { paymentAmount: { equals: parseFloat(query.total) } }
          : {},
        query.company
          ? {
              OR: [
                {
                  shipCompanyName: {
                    contains: query.company,
                    mode: 'insensitive',
                  },
                },
                {
                  billingCompanyName: {
                    contains: query.company,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {},
        query.quoteDate && query.quoteDate !== 'null'
          ? {
              QuoteDate: {
                equals: moment(query.quoteDate, 'MM-DD-YYYY').format(
                  'YYYY-MM-DD',
                ),
              },
            }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0);

      if (andConditions.length > 0) {
        where.AND = andConditions;
      }
    }

    // Tags filter
    if (params.tags && params.tags !== '-1') {
      const tags = params.tags
        .split(',')
        .map(Number)
        .filter((id) => !isNaN(id));
      if (tags.length > 0) {
        where.tagTable = {
          some: {
            tagId: { in: tags },
          },
        };
      }
    }

    // Products filter
    if (params.products && params.products !== 'all') {
      const products = params.products
        .split(',')
        .map(Number)
        .filter((id) => !isNaN(id));
      if (products.length > 0) {
        where.QuoteLineItem = {
          some: {
            ProductID: { in: products },
          },
        };
      }
    }

    // Count query
    const totalCount = await this.prisma.quote.count({
      where,
    });

    // Main query
    const quotes = await this.prisma.quote.findMany({
      where,
      select: {
        QuoteNo: true,
        pdfname: true,
        quoteComments: true,
        quoteNotes: true,
        billingCompanyName: true,
        shipCompanyName: true,
        QuoteDate: true,
        ValidTill: true,
        totalShippingCost: true,
        salesTaxRate1: true,
        paymentAmount: true,
        customer: {
          select: {
            lastName: true,
            firstName: true,
            email: true,
            company: true,
            city: true,
          },
        },
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        QuoteLineItem: {
          select: {
            LineID: true,
            ProductPrice: true,
            DiscountValue: true,
            Quantity: true,
            TaxableProduct: true,
          },
        },
        tagTable: {
          select: {
            tableId: true,
          },
        },
      },
      orderBy: {
        QuoteNo: 'desc',
      },
      skip: offset,
      take: size,
    });

    // Calculate total for each quote
    const results = quotes.map((quote) => {
      const lineItemTotal = quote.QuoteLineItem.reduce((sum, item) => {
        const discountedPrice =
          (item.ProductPrice || 0) -
          ((item.ProductPrice || 0) * (item.DiscountValue || 0)) / 100;
        const tax =
          item.TaxableProduct === 'Y' ? (quote.salesTaxRate1 || 0) / 100 : 0;
        return sum + discountedPrice * (item.Quantity || 0) * (1 + tax);
      }, 0);
      const total = lineItemTotal + (quote.totalShippingCost || 0);

      return {
        ...quote,
        total,
        createdByFirst: quote.user?.firstname ?? null,
        createdByLast: quote.user?.lastname ?? null,
        CompanyName: quote.customer?.company,
      };
    });

    return { totalData: totalCount, ...results };
  }
  async getQuotesCSV(
    query: {
      duration?: string;
      tags?: string;
      products?: string;
      from?: string;
      to?: string;
    },
    res: Response,
  ) {
    try {
      // Build where conditions
      let where: any = { isApproved: true };

      // Duration filter
      if (
        query.duration &&
        query.duration.trim().toLowerCase() === 'custom' &&
        query.from === '1-1-1970' &&
        query.to === '1-1-1970'
      ) {
        query.duration = 'all';
      }

      if (query.duration === 'custom' && query.from && query.to) {
        const fromDate = moment(query.from, 'MM-DD-YYYY')
          .startOf('day')
          .toISOString();
        const toDate = moment(query.to, 'MM-DD-YYYY')
          .endOf('day')
          .toISOString();
        where.QuoteDate = {
          gte: fromDate,
          lte: toDate,
        };
      } else if (query.duration === 'all') {
        where.isApproved = true;
      } else if (query.duration) {
        const months = parseInt(query.duration);
        if (!isNaN(months)) {
          where.QuoteDate = {
            gte: new Date(
              new Date().setMonth(new Date().getMonth() - months),
            ).toISOString(),
          };
        }
      }

      // Tags filter
      if (query.tags && query.tags !== '-1') {
        const tags = query.tags
          .split(',')
          .map(Number)
          .filter((id) => !isNaN(id));
        if (tags.length > 0) {
          where.tagTable = {
            some: { tagId: { in: tags } },
          };
        }
      }

      // Products filter
      if (query.products && query.products !== 'all') {
        const products = query.products
          .split(',')
          .map(Number)
          .filter((id) => !isNaN(id));
        if (products.length > 0) {
          where.QuoteLineItem = {
            some: { ProductID: { in: products } },
          };
        }
      }

      // Main query
      const quotes = await this.prisma.quote.findMany({
        where,
        select: {
          QuoteNo: true,
          pdfname: true,
          quoteComments: true,
          quoteNotes: true,
          billingCompanyName: true,
          shipCompanyName: true,
          QuoteDate: true,
          ValidTill: true,
          totalShippingCost: true,
          salesTaxRate1: true,
          paymentAmount: true,
          customer: {
            select: {
              lastName: true,
              firstName: true,
              email: true,
              company: true,
              city: true,
            },
          },
          user: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          QuoteLineItem: {
            select: {
              LineID: true,
              ProductPrice: true,
              DiscountValue: true,
              Quantity: true,
              TaxableProduct: true,
            },
          },
          tagTable: {
            select: {
              tableId: true,
            },
          },
        },
        orderBy: {
          QuoteNo: 'desc',
        },
      });

      // Calculate total and format results
      const results = quotes.map((quote) => {
        const lineItemTotal = quote.QuoteLineItem.reduce((sum, item) => {
          const discountedPrice =
            (item.ProductPrice || 0) -
            ((item.ProductPrice || 0) * (item.DiscountValue || 0)) / 100;
          const tax =
            item.TaxableProduct === 'Y' ? (quote.salesTaxRate1 || 0) / 100 : 0;
          return sum + discountedPrice * (item.Quantity || 0) * (1 + tax);
        }, 0);
        const total = lineItemTotal + (quote.totalShippingCost || 0);

        return {
          QuoteNo: quote.QuoteNo,
          pdfname: quote.pdfname,
          Quote_Comments: quote.quoteComments,
          QuoteNotes: quote.quoteNotes,
          BillingCompanyName: quote.billingCompanyName,
          ShipCompanyName: quote.shipCompanyName,
          // QuoteDate: quote.QuoteDate
          //   ? moment(quote.QuoteDate).format('MM/DD/YYYY')
          //   : null,
          // ValidTill: quote.ValidTill
          //   ? moment(quote.ValidTill).format('MM/DD/YYYY')
          //   : null,
          TotalShippingCost: quote.totalShippingCost,
          PaymentAmount: quote.paymentAmount,
          LastName: quote.customer?.lastName,
          FirstName: quote.customer?.firstName,
          EmailAddress: quote.customer?.email,
          CompanyName: quote.customer?.company,
          City: quote.customer?.city,
          createdByFirst: quote.user?.firstname ?? null,
          createdByLast: quote.user?.lastname ?? null,
          total,
        };
      });
      console.log(results.length);
      // Set CSV headers
      const writeStream = format({ headers: true });

      // Set response headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=generatedData.csv',
      );

      // Pipe CSV to response
      writeStream.pipe(res);

      // Write data to CSV
      results.forEach((row) => writeStream.write(row));

      // End the stream
      writeStream.end();
    } catch (error) {
      console.error('Error generating CSV:', error);
      res.status(500).send('Internal Server Error');
    }
  }
  async getDateQuote(query: QuoteSearchParamsDto, body: QuoteSearchBodyDto) {
    const page = query.page ? parseInt(query.page) : 1;
    const size = query.size ? parseInt(query.size) : 10;
    const isGlobal = query.isGlobal === 'true';
    const isIndividual = query.isIndividual === 'true';
    const offset = (page - 1) * size;

    // Build where conditions
    let where: Prisma.QuoteWhereInput = {
      isApproved: true,
    };

    // Date range filter from body
    if (body.from && body.to) {
      const fromDate = moment(body.from, 'YYYY-MM-DD')
        .startOf('day')
        .toISOString();
      const toDate = moment(body.to, 'YYYY-MM-DD').endOf('day').toISOString();
      where.QuoteDate = {
        gte: fromDate,
        lte: toDate,
      };
    }

    // Global search
    if (isGlobal && query.search) {
      const search = query.search;
      const numericSearch = parseFloat(search);
      where.OR = [
        !isNaN(numericSearch) ? { QuoteNo: { equals: numericSearch } } : {},
        { customer: { lastName: { contains: search, mode: 'insensitive' } } },
        { customer: { firstName: { contains: search, mode: 'insensitive' } } },
        { customer: { email: { contains: search, mode: 'insensitive' } } },
        { customer: { city: { contains: search, mode: 'insensitive' } } },
        { user: { firstname: { contains: search, mode: 'insensitive' } } },
        { user: { lastname: { contains: search, mode: 'insensitive' } } },
        !isNaN(numericSearch)
          ? { paymentAmount: { equals: numericSearch } }
          : {},
        { shipCompanyName: { contains: search, mode: 'insensitive' } },
        { billingCompanyName: { contains: search, mode: 'insensitive' } },
      ].filter((condition) => Object.keys(condition).length > 0);
    }

    // Individual search
    if (isIndividual) {
      const andConditions: Prisma.QuoteWhereInput[] = [
        query.id && !isNaN(parseInt(query.id))
          ? { QuoteNo: { equals: parseInt(query.id) } }
          : {},
        query.lastName
          ? {
              OR: [
                {
                  customer: {
                    lastName: {
                      contains: query.lastName,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  customer: {
                    firstName: {
                      contains: query.lastName,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            }
          : {},
        query.email
          ? {
              customer: {
                email: { contains: query.email, mode: 'insensitive' },
              },
            }
          : {},
        query.city
          ? {
              customer: {
                city: { contains: query.city, mode: 'insensitive' },
              },
            }
          : {},
        query.createdBy
          ? {
              OR: [
                {
                  user: {
                    lastname: {
                      contains: query.createdBy,
                      mode: 'insensitive',
                    },
                  },
                },
                {
                  user: {
                    firstname: {
                      contains: query.createdBy,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            }
          : {},
        query.total && !isNaN(parseFloat(query.total))
          ? { paymentAmount: { equals: parseFloat(query.total) } }
          : {},
        query.company
          ? {
              OR: [
                {
                  shipCompanyName: {
                    contains: query.company,
                    mode: 'insensitive',
                  },
                },
                {
                  billingCompanyName: {
                    contains: query.company,
                    mode: 'insensitive',
                  },
                },
              ],
            }
          : {},
        query.quoteDate && query.quoteDate !== 'null'
          ? {
              QuoteDate: {
                equals: moment(query.quoteDate, 'MM-DD-YYYY').format(
                  'YYYY-MM-DD',
                ),
              },
            }
          : {},
      ].filter((condition) => Object.keys(condition).length > 0);

      if (andConditions.length > 0) {
        where.AND = andConditions;
      }
    }

    // Tags filter
    if (body.tags && body.tags.length > 0) {
      const tags = body.tags.map((tag) => parseInt(tag));
      if (tags.length > 0) {
        where.tagTable = {
          some: {
            tagId: { in: tags },
          },
        };
      }
    }

    // Products filter
    if (body.products && body.products !== 'all') {
      const products = body.products
        .split(',')
        .map(Number)
        .filter((id) => !isNaN(id));
      if (products.length > 0) {
        where.QuoteLineItem = {
          some: {
            ProductID: { in: products },
          },
        };
      }
    }

    // Count query
    const totalCount = await this.prisma.quote.count({
      where,
    });

    // Main query
    const quotes = await this.prisma.quote.findMany({
      where,
      select: {
        QuoteNo: true,
        pdfname: true,
        quoteComments: true,
        quoteNotes: true,
        billingCompanyName: true,
        shipCompanyName: true,
        QuoteDate: true,
        ValidTill: true,
        totalShippingCost: true,
        salesTaxRate1: true,
        paymentAmount: true,
        customer: {
          select: {
            lastName: true,
            firstName: true,
            email: true,
            company: true,
            city: true,
          },
        },
        user: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        QuoteLineItem: {
          select: {
            LineID: true,
            ProductPrice: true,
            DiscountValue: true,
            Quantity: true,
            TaxableProduct: true,
          },
        },
        tagTable: {
          select: {
            tableId: true,
          },
        },
      },
      orderBy: {
        QuoteNo: 'desc',
      },
      skip: offset,
      take: size,
    });

    // Calculate total for each quote
    const results = quotes.map((quote) => {
      const lineItemTotal = quote.QuoteLineItem.reduce((sum, item) => {
        const discountedPrice =
          (item.ProductPrice || 0) -
          ((item.ProductPrice || 0) * (item.DiscountValue || 0)) / 100;
        const tax =
          item.TaxableProduct === 'Y' ? (quote.salesTaxRate1 || 0) / 100 : 0;
        return sum + discountedPrice * (item.Quantity || 0) * (1 + tax);
      }, 0);
      const total = lineItemTotal + (quote.totalShippingCost || 0);

      return {
        ...quote,
        total,
        createdByFirst: quote.user?.firstname ?? null,
        createdByLast: quote.user?.lastname ?? null,
        CompanyName: quote.customer?.company,
      };
    });
    //   {  "t": null,
    // "QuoteNo": null,
    // "pdfname": null,
    // "Quote_Comments": null,
    // "QuoteNotes": null,
    // "BillingCompanyName": null,
    // "ShipCompanyName": null,
    // "QuoteDate": null,
    // "ValidTill": null,
    // "TotalShippingCost": null,
    // "SalesTaxRate1": null,
    // "PaymentAmount": null,
    // "LastName": null,
    // "FirstName": null,
    // "EmailAddress": null,
    // "CompanyName": null,
    // "City": null,
    // "createdByFirst": null,
    // "createdByLast": null,}

    return { totalData: totalCount, ...results };
  }

  async getAllExternalQuotes() {
    try {
      const quotes = await this.prisma.quote.findMany({
        where: {
          isExternal: true,
          isApproved: false,
        },
        select: {
          QuoteNo: true,
          quoteComments: true,
          quoteNotes: true,
          billingCompanyName: true,
          shipCompanyName: true,
          QuoteDate: true,
          ValidTill: true,
          totalShippingCost: true,
          salesTaxRate1: true,
          paymentAmount: true,
          billingFirstName: true,
          billingLastName: true,
          isExternal: true,
          isApproved: true,
          createdBy: true,
          user: {
            select: {
              firstname: true,
              lastname: true,
            },
          },
          // Include other Quote fields as needed to match q.*
          customerId: true,
          orderId: true,
          modifiedOn: true,
          insuranceValue: true,
          customFieldCarrierAcctNo: true,
          modBy: true,
          endUserId: true,
          isOrdered: true,
          shippingMethodId: true,
          isCustomerNameShow: true,

          billingEmailAddress: true,
          billingAddress1: true,
          billingAddress2: true,
          billingCity: true,
          billingCountry: true,
          billingState: true,
          billingPhoneNumber: true,
          isTaxExempt: true,
          billingPostalCode: true,
          shipAddress1: true,
          shipAddress2: true,
          shipCity: true,
          shipCountry: true,
          shipState: true,
          shipPhoneNumber: true,
          shipPostalCode: true,
          isCustomerEmailShow: true,
          shipEmailAddress: true,
        },
        orderBy: {
          QuoteNo: 'desc',
        },
      });

      // Map results to include concatenated fields
      const results = quotes.map((quote) => ({
        ...quote,
        CustomerName:
          `${quote.billingLastName ?? ''}, ${quote.billingFirstName ?? ''}`.trim(),
        createdByName:
          `${quote.user?.lastname ?? ''}, ${quote.user?.firstname ?? ''}`.trim(),
      }));

      return results;
    } catch (error) {
      this.logger.error(
        `Action: GetAllExternalQuotes, Error: ${JSON.stringify(error.message)}`,
      );
      throw new Error('Internal Server Error');
    }
  }

  async SaveQuote(quote: CreateQuoteDto) {
    let tagsArray = quote.tagsArray;
    delete quote.tagsArray;
    delete quote.QuoteNo;
    try {
      let quoteToInsert = {};
      for (const key in quote) {
        if (quote[key]) {
          quoteToInsert[key] = quote[key];
        }
      }

      const mappedQuoteToInsert =
        QuoteMapper.mapQuoteToPrismaModel(quoteToInsert);
      const insertedQuote = await this.prisma.quote.create({
        data: mappedQuoteToInsert,
      });
      //   Mysql.insert('quotes', quoteToInsert);
      if (!insertedQuote.QuoteNo) {
        this.slackService.send(
          `File: db.js, \nAction: SaveQuote, \nError ${'Error inserting quote'} \n`,
          'J.A.R.V.I.S',
          'C029PF7DLKE',
        );
        return { status: 'error' };
      }
      const quoteID = insertedQuote.QuoteNo;
      // console.log(quote.QuoteLines);
      if (tagsArray ? tagsArray.length > 0 : false) {
        for (let index = 0; index < tagsArray!.length; index++) {
          let tag = {
            // tableId: quoteID,
            tableName: 'quotes',
            // tagId: tagsArray[index],
            quoteId: quoteID,
          };
          try {
            let responseOfTagSave = await this.prisma.tagTable.create({
              data: tag,
            });
            // Mysql.insert('tag_tables', tag);
          } catch (error) {
            console.log(new Date(), error);
            const err = JSON.stringify(error.message);
            //   this.slackService.send(
            //     `File: db.js, \nAction:SaveQuote While insertTags, \nError ${err} \n
            // `,
            //     'J.A.R.V.I.S',
            //     'C029PF7DLKE',
            //   );
          }
        }
      }
      await Promise.all(
        quote.quotelineitems.map(async (lineItem, index) => {
          lineItem.display_order = index;
          lineItem.QuoteNo = quoteID;
          let item = {};
          for (const key in lineItem) {
            if (lineItem[key]) {
              item[key] = lineItem[key];
            }
          }
          const mappedQuoteLineItemToInsert =
            QuoteMapper.mapQuoteLineItemToPrismaModel(item, quoteID, index);
          // console.log(item);
          await this.prisma.quoteLineItem.create({
            data: mappedQuoteLineItemToInsert,
          });
          //  Mysql.insert("quotelineitems", item);
        }),
      );
      return { status: 'ok', quoteNo: quoteID };
    } catch (error) {
      console.log(new Date(), error);
      // this.slackService.send(
      //   `File: db.js, \nAction: SaveQuote, \nError ${JSON.stringify(error)}`,
      //   'J.A.R.V.I.S',
      //   'C029PF7DLKE',
      // );
      return { status: 'error' };
    }
  }
  async UpdateQuote(quote: UpdateQuoteDto) {
    let tagsArray = quote.tagsArray;
    delete quote.tagsArray;
    const where = { QuoteNo: quote.QuoteNo };
    delete quote.QuoteNo;
    const update = quote;

    try {
      // Update the quote
      const mappedQuoteToUpdate = QuoteMapper.mapQuoteToPrismaModel(update);
      const savedQuote = await this.prisma.quote.update({
        where,
        data: mappedQuoteToUpdate,
      });

      // Delete existing tags
      await this.prisma.tagTable.deleteMany({
        where: { tableId: where.QuoteNo },
      });

      // Insert new tags if provided
      if (tagsArray ? tagsArray.length > 0 : false) {
        for (const tagId of tagsArray!) {
          const tag = {
            // tableId: where.QuoteNo,
            quote: { connect: { QuoteNo: where.QuoteNo } },
            tableName: 'quotes',
            // tag: { connect: { id: tagId } },
            // tagid: tagId,
          };
          await this.prisma.tagTable.create({
            data: tag,
          });
        }
      }

      // Delete existing quote line items
      await this.prisma.quoteLineItem.deleteMany({
        where: { QuoteNo: where.QuoteNo },
      });

      // Insert new quote line items
      await Promise.all(
        quote.quotelineitems.map(async (lineItem, index) => {
          lineItem.display_order = index;
          lineItem.QuoteNo = where.QuoteNo ?? 0;
          if (lineItem.Discount === undefined) lineItem.Discount = 0;
          const mappedQuoteLineItemToInsert =
            QuoteMapper.mapQuoteLineItemToPrismaModel(
              lineItem,
              where.QuoteNo,
              index,
            );
          await this.prisma.quoteLineItem.create({
            data: mappedQuoteLineItemToInsert,
          });
        }),
      );

      return { status: 'ok', quoteNo: where.QuoteNo };
    } catch (error) {
      let errorMessage = 'Failed to update quote';
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

      // Handle specific Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          // Record not found
          errorMessage = `Quote with QuoteNo ${where.QuoteNo} not found`;
          statusCode = HttpStatus.NOT_FOUND;
        } else if (error.code === 'P2002') {
          // Unique constraint violation
          errorMessage = `Unique constraint failed: ${error.meta?.target || 'unknown field'}`;
          statusCode = HttpStatus.BAD_REQUEST;
        } else {
          // Other Prisma errors
          errorMessage = `Database error: ${error.message.split('\n').pop()?.trim() || 'Unknown error'}`;
        }
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        // Validation errors
        errorMessage = 'Invalid data provided for quote update';
        statusCode = HttpStatus.BAD_REQUEST;
      }

      // Log the full error for debugging
      const err = JSON.stringify(error.message);
      this.logger.error(
        `Error updating quote with QuoteNo ${where.QuoteNo}: ${err}`,
      );
      await this.slackService.send(
        `File: order.service.ts, \nAction: UpdateQuote, \nError: ${err}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );

      return { status: 'error', message: errorMessage };
    }
  }

  async InsertQuotes(quotes) {
    const response = { status: false, error: undefined, data: undefined };

    if (quotes != undefined && quotes.quotelineitems != undefined) {
      try {
        quotes.QuoteDate =
          quotes?.QuoteDate?.replace(/\?/g, ' ') ||
          new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
        quotes.ValidTill =
          quotes?.ValidTill?.replace(/\?/g, ' ') ||
          new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
        var quotelineitems = quotes.quotelineitems;
        let tags = [];
        let OrderToInsert = {};
        if (quotes.tagsArray) tags = quotes.tagsArray;
        var quoteId = quotes.QuoteNo;
        var userId = quotes.UserId;
        delete quotes.quotelineitems;
        delete quotes.tagsArray;
        delete quotes.InvoiceableOn;
        delete quotes.QuoteTaxExempt;
        delete quotes.CustomerDiscount;

        // Determine QuoteNo
        if (quotes.QuoteNo === undefined) {
          const record = await this.prisma.quote.findFirst({
            select: { QuoteNo: true },
            orderBy: { QuoteNo: 'desc' },
          });
          if (record) {
            var id = record.QuoteNo;
            id = id + 1;
            quotes.QuoteNo = id;
          } else {
            var id = 1;
          }
        } else {
          id = +quotes.QuoteNo;
        }

        // Prepare quote data
        for (const key in quotes) {
          if (quotes[key] || quotes[key] == 0 || quotes[key] == '') {
            OrderToInsert[key] = quotes[key];
          }
        }
        const mappedQuoteToInsert =
          QuoteMapper.mapQuoteToPrismaModel(OrderToInsert);

        // Upsert quote
        await this.prisma.quote.upsert({
          where: { QuoteNo: id },
          create: mappedQuoteToInsert,
          update: mappedQuoteToInsert,
        });

        // Delete existing quote line items
        await this.prisma.quoteLineItem.deleteMany({
          where: { QuoteNo: quotes.QuoteNo },
        });

        // Insert quote line items
        await Promise.all(
          quotelineitems.map(async (OrderDetail, index) => {
            delete OrderDetail.CategoryOptions;
            delete OrderDetail.availableOptions;
            delete OrderDetail.isMultiClassification;
            OrderDetail.displayOrder = index;
            OrderDetail.QuoteNo = id;
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
            const mappedQouteLineItem =
              QuoteMapper.mapQuoteLineItemToPrismaModel(
                OrderDetailToInsert,
                OrderDetail.QuoteNo,
                index,
              );
            await this.prisma.quoteLineItem.create({
              data: mappedQouteLineItem,
            });
          }),
        );

        // Delete existing tags
        await this.prisma.tagTable.deleteMany({
          where: { tableId: quotes.QuoteNo },
        });

        // Insert tags
        if (tags && tags.length > 0) {
          for (let index = 0; index < tags.length; index++) {
            let tag = {
              // tableId: quotes.QuoteNo,
              tableName: 'quotes',
              // tagid: tags[index],
            };
            await this.prisma.tagTable.create({
              data: tag,
            });
          }
        }

        return { status: true, error: undefined, data: { id: id } };
      } catch (error) {
        const err = JSON.stringify(error.message || 'Unknown error');
        await this.slackService.send(
          `File: quotes.js, Action: InsertQuotes, Error: ${err}`,
          'J.A.R.V.I.S',
          'C029PF7DLKE',
        );
        console.log(new Date(), error);
        return { status: false, error: err, data: undefined };
      }
    } else {
      const errorMsg = 'Quotes or quote line items undefined';
      await this.slackService.send(
        `File: quotes.js, Action: InsertQuotes, Error: ${errorMsg}`,
        'J.A.R.V.I.S',
        'C029PF7DLKE',
      );
      console.log(new Date(), errorMsg);
      return { status: false, error: errorMsg, data: undefined };
    }
  }

  async getOrdersByStatus(query: GetOrdersByStatusDto): Promise<any> {
    try {
      const where: Prisma.OrderWhereInput = {};
      let includeTags = false;

      if (query.serialNo) {
        where.orderSerials = { contains: query.serialNo };
      }

      if (query.dates?.from && query.dates?.to) {
        where.orderDate = {
          gte: query.dates.from,
          lte: query.dates.to,
        };
      }

      if (query.status === 'open') {
        where.orderStatus = {
          in: [
            'Order Placed',
            'Preparing Shipment',
            'HOLD- Waiting for prepay',
            'HOLD- Waiting PI approval',
            'Waiting for pickup - EXW',
            'Engineering Services Open',
            'Repair in Process',
            'HOLD- Waiting H/W return',
            'Marketing Material',
            'HOLD- PO Issue',
            'Partially Shipped',
            'Backordered',
          ],
        };
      } else if (query.status !== 'all') {
        where.orderStatus = query.status;
      }

      if (query.country !== 'all') {
        where.shipCountry = query.country;
      }

      if (query.type !== 'all') {
        where.orderType = query.type;
      }

      if (query.tags?.length) {
        includeTags = true;
        where.tagTable = {
          some: { tagId: { in: query.tags } },
        };
      }

      const orders = await this.prisma.order.findMany({
        where,
        include: {
          customer: { select: { email: true } },
          salesRep: { select: { firstName: true, lastName: true } },
          quote: { select: { QuoteDate: true } },
          orderedBy: { select: { firstname: true, lastname: true } },
          tagTable: includeTags ? { select: { tagId: true } } : false,
        },
        orderBy: { id: 'desc' },
      });

      return orders.map((order) => ({
        CreatedByBlueFirstName: order.orderedBy?.firstname,
        CreatedByBlueLastName: order.orderedBy?.lastname,
        CreatedByVoluFirstName: order.salesRep?.firstName,
        CreatedByVoluLastName: order.salesRep?.lastName,
        EmailAddress: order.customer?.email,
        QuoteDate: order.quote?.QuoteDate,
      }));
    } catch (error) {
      await this.slackService.send(
        'C029PF7DLKE',
        `File: order.service.ts, Action: getOrdersByStatus, Error: ${error.message}`,
        'J.A.R.V.I.S',
      );
      throw error;
    }
  }

  async getOrders(query: GetOrdersDto): Promise<any> {
    try {
      const where: Prisma.OrderWhereInput = {};

      if (query.duration && query.duration !== 'all') {
        const months = parseInt(query.duration);
        where.orderDate = {
          gte: moment().subtract(months, 'months').format('YYYY-MM-DD'),
        };
      } else if (query.startTime && query.endTime) {
        where.orderDate = {
          gte: query.startTime,
          lte: query.endTime,
        };
      } else if (query.openStatus) {
        where.orderStatus = {
          in: [
            'Order Placed',
            'Preparing Shipment',
            'HOLD- Waiting for prepay',
            'HOLD- Waiting PI approval',
            'Waiting for pickup - EXW',
            'Engineering Services Open',
            'Repair in Process',
            'HOLD- Waiting H/W return',
            'Marketing Material',
            'HOLD- PO Issue',
            'Partially Shipped',
            'Backordered',
            'Proccessing',
          ],
        };
      }

      const orders = await this.prisma.order.findMany({
        where,
        include: {
          customer: { select: { email: true } },
          salesRep: { select: { firstName: true, lastName: true } },
          quote: { select: { QuoteDate: true } },
          orderedBy: { select: { firstname: true, lastname: true } },
        },
        orderBy: { id: 'desc' },
      });

      return orders.map((order) => ({
        CreatedByBlueFirstName: order.orderedBy?.firstname,
        CreatedByBlueLastName: order.orderedBy?.lastname,
        CreatedByVoluFirstName: order.salesRep?.firstName,
        CreatedByVoluLastName: order.salesRep?.lastName,
        EmailAddress: order.customer?.email,
        QuoteDate: order.quote?.QuoteDate,
      }));
    } catch (error) {
      await this.slackService.send(
        'C029PF7DLKE',
        `File: order.service.ts, Action: getOrders, Error: ${error.message}`,
        'J.A.R.V.I.S',
      );
      throw error;
    }
  }

  async getOrdersByOpenStatus(): Promise<any> {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          orderStatus: {
            in: [
              'Order Placed',
              'Preparing Shipment',
              'HOLD- Waiting for prepay',
              'HOLD- Waiting PI approval',
              'Waiting for pickup - EXW',
              'Engineering Services Open',
              'Repair in Process',
              'HOLD- Waiting H/W return',
              'Marketing Material',
              'HOLD- PO Issue',
              'Partially Shipped',
              'Backordered',
              'Proccessing',
            ],
          },
        },
        include: {
          customer: { select: { email: true } },
          salesRep: { select: { firstName: true, lastName: true } },
          quote: { select: { QuoteDate: true } },
          orderedBy: { select: { firstname: true, lastname: true } },
          orderDetails: { select: { productCode: true } },
        },
        orderBy: { id: 'desc' },
      });

      return orders.map((order) => ({
        ProductCode: order.orderDetails?.[0]?.productCode,
        CreatedByBlueFirstName: order.orderedBy?.firstname,
        CreatedByBlueLastName: order.orderedBy?.lastname,
        CreatedByVoluFirstName: order.salesRep?.firstName,
        CreatedByVoluLastName: order.salesRep?.lastName,
        EmailAddress: order.customer?.email,
        QuoteDate: order.quote?.QuoteDate,
      }));
    } catch (error) {
      await this.slackService.send(
        'C029PF7DLKE',
        `File: order.service.ts, Action: getOrdersByOpenStatus, Error: ${error.message}`,
        'J.A.R.V.I.S',
      );
      throw error;
    }
  }

  async getQuote(orderId: number): Promise<any> {
    try {
      const quotes = await this.prisma.quote.findMany({
        where: { QuoteNo: orderId },
        include: {
          user: { select: { firstname: true, lastname: true } },
          modifiedBy: { select: { firstname: true, lastname: true } },
          QuoteLineItem: true,
          tagTable: { select: { tagId: true } },
        },
        // orderBy: { QuoteLineItem: { displayOrder: 'asc' } },
      });
      console.log(quotes.length);
      if (!(quotes.length > 0)) {
        return [{ QuoteNotFound: 'Quote Not Found', orderId }];
      }

      return quotes.map((quote) => {
        const entity = QuoteMapper.toDomain({
          ...quote,
          quotelineitems: quote.QuoteLineItem,
          tagIds: quote.tagTable.map((t) => t.tagId ?? 0),
        });
        entity.QuoteDate = entity.QuoteDate?.replace(/\?/g, ' ');
        entity.ValidTill = entity.ValidTill?.replace(/\?/g, ' ');

        return entity;
      });
    } catch (error) {
      await this.slackService.send(
        'C029PF7DLKE',
        `File: order.service.ts, Action: getQuote, Error: ${error.message}`,
        'J.A.R.V.I.S',
      );
      throw error;
    }
  }

  async getOrderBySerial(serialNo: string): Promise<any> {
    try {
      const order = await this.prisma.order.findFirst({
        where: { orderSerials: { contains: serialNo } },
        orderBy: { id: 'desc' },
        include: {
          customer: { select: { email: true } },
          salesRep: { select: { firstName: true, lastName: true } },
          quote: { select: { QuoteDate: true } },
          orderedBy: { select: { firstname: true, lastname: true } },
          orderDetails: true,
          productSerials: { where: { isSold: true } },
        },
      });

      if (!order) {
        return [{ OrderNotFound: 'OrderNotFound', orderId: serialNo }];
      }

      const shippedQtyByProduct = await this.prisma.productSerial.groupBy({
        by: ['productId'],
        where: {
          orderId: order.id,
          isSold: true,
        },
        _count: { _all: true },
      });

      return order.orderDetails.map((detail) => ({
        // ...OrderMapper.toDomain(order),
        ProductCode: detail.productCode,
        Options: detail.options,
        QtyOnPackingSlip: detail.qtyOnPackingSlip,
        QtyShipped: detail.qtyShipped,
        QtyOnBackOrder: detail.qtyOnBackOrder,
        shippedQty:
          shippedQtyByProduct.find((sp) => sp.productId === detail.productId)
            ?._count._all || 0,
        parent: detail.parent,
        parentName: detail.parentName,
        ProductSerials: detail.productSerials,
        isChild: detail.isChild,
        isCategoriesOption: detail.isCategoriesOption,
        CreatedByBlueFirstName: order.orderedBy?.firstname,
        CreatedByBlueLastName: order.orderedBy?.lastname,
        CreatedByVoluFirstName: order.salesRep?.firstName,
        CreatedByVoluLastName: order.salesRep?.lastName,
        EmailAddress: order.customer?.email,
        QuoteDate: order.quote?.QuoteDate,
        description: detail.description,
        Quantity: detail.quantity,
        Price: detail.productPrice,
        Discount: detail.discountValue,
      }));
    } catch (error) {
      await this.slackService.send(
        'C029PF7DLKE',
        `File: order.service.ts, Action: getOrderBySerial, Error: ${error.message}`,
        'J.A.R.V.I.S',
      );
      throw error;
    }
  }

  async getOpenOrderByProductId(productId: number): Promise<any> {
    try {
      const orders = await this.prisma.order.findMany({
        where: {
          orderDetails: { some: { productId } },
          orderStatus: {
            in: [
              'Order Placed',
              'Preparing Shipment',
              'HOLD- Waiting for prepay',
              'HOLD- Waiting PI approval',
              'Waiting for pickup - EXW',
              'Engineering Services Open',
              'Repair in Process',
              'HOLD- Waiting H/W return',
              'Marketing Material',
              'HOLD- PO Issue',
              'Partially Shipped',
              'Backordered',
              'Proccessing',
            ],
          },
        },
        include: {
          customer: { select: { email: true } },
          salesRep: { select: { firstName: true, lastName: true } },
          quote: { select: { QuoteDate: true } },
          orderedBy: { select: { firstname: true, lastname: true } },
          orderDetails: { select: { productCode: true } },
        },
        orderBy: { id: 'desc' },
      });

      return orders.map((order) => ({
        // ...OrderMapper.toDomain(order),
        ProductCode: order.orderDetails?.[0]?.productCode,
        CreatedByBlueFirstName: order.orderedBy?.firstname,
        CreatedByBlueLastName: order.orderedBy?.lastname,
        CreatedByVoluFirstName: order.salesRep?.firstName,
        CreatedByVoluLastName: order.salesRep?.lastName,
        EmailAddress: order.customer?.email,
        QuoteDate: order.quote?.QuoteDate,
      }));
    } catch (error) {
      await this.slackService.send(
        'C029PF7DLKE',
        `File: order.service.ts, Action: getOpenOrderByProductId, Error: ${error.message}`,
        'J.A.R.V.I.S',
      );
      throw error;
    }
  }

  async updateOrder(data: UpdateOrderDto): Promise<{ id: number }> {
    try {
      const updatedOrder = await this.prisma.order.update({
        where: { id: data.OrderID },
        data: orderMappers.mapToInsert(data),
      });
      return { id: updatedOrder.id };
    } catch (error) {
      await this.slackService.send(
        'C029PF7DLKE',
        `File: order.service.ts, Action: updateOrder, Error: ${error.message}`,
        'J.A.R.V.I.S',
      );
      throw error;
    }
  }

  async importOrderFile(data: ImportOrderTrackingDto): Promise<boolean> {
    try {
      await this.prisma.orderTrackingNo.deleteMany({
        where: { isImported: true },
      });

      let callbackCount = data.trackingData.length;
      let status = true;

      await Promise.all(
        data.trackingData.map(async (elem) => {
          try {
            const trackingData = {
              orderId: parseInt(elem.orderid[0]),
              trackingNo: elem.trackingnumber[0],
              gateway: elem.gateway[0],
              shipDate: new Date(elem.shipdate[0]),
              shipmentCost: parseFloat(elem.shipment_cost[0] || '0'),
              shippingMethodId: parseInt(elem.shippingmethodid[0]),
              Package: elem.package[0],
              Form: elem.form[0],
              isImported: true,
            };

            await this.prisma.orderTrackingNo.upsert({
              where: { trackingNo: trackingData.trackingNo },
              update: trackingData,
              create: trackingData,
            });

            callbackCount--;
          } catch (error) {
            callbackCount--;
            status = false;
            throw error;
          }
        }),
      );

      return callbackCount === 0 && status;
    } catch (error) {
      await this.slackService.send(
        'C029PF7DLKE',
        `File: order.service.ts, Action: importOrderFile, Error: ${error.message}`,
        'J.A.R.V.I.S',
      );
      throw error;
    }
  }
}
