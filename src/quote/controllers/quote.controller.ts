import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { UtilsService } from '../helpers/utils';
import { QuoteService } from '../services/quote.service';
import { GoogleDriveService } from '../helpers/googleDrive';
import { Request, Response } from 'express';
import { CalculateTaxDto, CalculateUsTaxDto } from '../dtos/calculate-tax.dto';
import {
  CloneQuoteDto,
  CreateQuoteDto,
  GetQuoteCSVDto,
  QuoteSearchBodyDto,
  QuoteSearchParamsDto,
  UpdateQuoteDto,
} from '../dtos/create-quote.dto';
import { SearchParamsDto } from 'src/order/dtos/search.dto';

@Controller('quote')
export class QuoteController {
  constructor(
    private readonly utilsService: UtilsService,
    private readonly quoteService: QuoteService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  @Post('get-tax-rate')
  async getTaxRate(@Body() body: CalculateTaxDto) {
    try {
      var data = body;
      return await this.utilsService.calculateTax(data);
    } catch (error) {
      console.error('Error while calculating tax rate:', error);
      throw new HttpException(
        'Error while calculating tax rate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('clone-quote')
  async cloneQuote(@Body() body: CloneQuoteDto) {
    try {
      const quoteNo = body.quoteNo;
      const userId = body.userId;
      const data = { quoteNo, userId };
      return await this.quoteService.cloneQuote(data);
    } catch (error) {
      console.error('Error while cloning quote:', error);
      throw new HttpException(
        'Error while cloning quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('get')
  async get(@Query('quoteId') quoteId: string) {
    try {
      return await this.quoteService.getQuote(+quoteId);
    } catch (error) {
      console.error('Error while getting quote:', error);
      throw new HttpException(
        'Error while getting quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('getQuoteNew/:orderId')
  async getQuoteNewByOrderId(@Param('orderId') orderId: string) {
    try {
      const result = await this.quoteService.GetQuoteNew(+orderId);
      console.log('this is the result of the get quoteorder new : ' + result);

      return result;
    } catch (error) {
      console.error('Error while getting new quote by order ID:', error);
      throw new HttpException(
        'Error while getting new quote by order ID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('remove-quote')
  async removeQuote(@Body() body: { quoteId: number }, @Res() res: Response) {
    try {
      var quoteId = body.quoteId;

      return await this.quoteService.RemoveQuote(quoteId, res);
    } catch (error) {
      console.error('Error while removing quote:', error);
      throw new HttpException(
        'Error while removing quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('driveCallback')
  async driveCallBack(
    @Query('code') code: string,
    @Query('state') state: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const quoteId = state;
      const callbackUrl = 'http://localhost:3000/quote/driveCallback';
      await this.googleDriveService.retrieveNewToken(
        code,
        callbackUrl,
        () => {},
      );
      const url =
        this.utilsService.getProtocol(req) +
        this.utilsService.getBaseUrl(req) +
        '/quote/get/' +
        quoteId;
      res.redirect(url);
    } catch (error) {
      console.error('Error in drive callback:', error);
      if (!res.headersSent) {
        throw new HttpException(
          'Error in drive callback',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Get('list/:duration/:tags/:products')
  async listByDurationTagsProducts(
    @Param('duration') duration: string,
    @Param('tags') tags: string,
    @Param('products') products: string,
    @Query() query: QuoteSearchParamsDto,
  ) {
    try {
      const params = { duration, tags, products };
      return await this.quoteService.getAllQuotes( params ,query);
    } catch (error) {
      console.error(
        'Error while listing quotes by duration, tags, and products:',
        error,
      );
      throw new HttpException(
        'Error while listing quotes by duration, tags, and products',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('getQuotesCSV/:duration/:tags/:products')
  async getQuoteCSV(
    @Param('duration') duration: string,
    @Param('tags') tags: string,
    @Param('products') products: string,
    @Body() body: GetQuoteCSVDto,
    @Res() res: Response,
  ) {
    try {
      const query = { duration, tags, products, ...body };
      await this.quoteService.getQuotesCSV(query, res);
    } catch (error) {
      console.error('Error while getting quotes CSV:', error);
      throw new HttpException(
        'Error while getting quotes CSV',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('list-filter')
  async listFilter(
    @Body() body: QuoteSearchBodyDto,
    @Query() query: QuoteSearchParamsDto,
  ) {
    try {
      return await this.quoteService.getDateQuote(query, body);
    } catch (error) {
      console.error('Error while listing filtered quotes:', error);
      throw new HttpException(
        'Error while listing filtered quotes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('listExternal')
  async listExternal() {
    try {
      return await this.quoteService.getAllExternalQuotes();
    } catch (error) {
      console.error('Error while listing external quotes:', error);
      throw new HttpException(
        'Error while listing external quotes',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('get-us-tax-rate')
  async getUsTaxRate(@Body() body: CalculateUsTaxDto, @Res() res: Response) {
    try {
      const result = await this.utilsService.calculateUsTax(body);
      const status = result.status
        ? HttpStatus.OK
        : HttpStatus.INTERNAL_SERVER_ERROR;
      res.status(status).json(result);
    } catch (error) {
      console.error('Error while calculating US tax rate:', error);
      throw new HttpException(
        'Error while calculating US tax rate',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('save')
  async save(@Body() body: CreateQuoteDto) {
    try {
      return await this.quoteService.SaveQuote(body);
    } catch (error) {
      console.error('Error while saving quote:', error);
      throw new HttpException(
        'Error while saving quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('update')
  async update(@Body() body: UpdateQuoteDto) {
    try {
      const result = await this.quoteService.UpdateQuote(body);
      return result;
    } catch (error) {
      console.error('Error while updating quote:', error);
      throw new HttpException(
        'Error while updating quote',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('quote-on-blue-sky')
  async quoteOnBlueSky(@Body() body: CreateQuoteDto) {
    try {
      if (body.InvoiceableOn) {
        body.InvoiceableOn = new Date(body.InvoiceableOn as string);
      }
      return await this.quoteService.InsertQuotes(body);
    } catch (error) {
      console.error('Error while inserting quote on Blue Sky:', error);
      throw new HttpException(
        'Error while inserting quote on Blue Sky',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
