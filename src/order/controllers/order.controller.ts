import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  Body,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
  Query,
  ParseIntPipe,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response, Request } from 'express';
import { OrderService } from '../services/order.service';
import { CreateFileDto } from '../dtos/create-file.dto';
import { UpdateQuoteFileDto } from '../dtos/update-quote-file.dto';
import { GetOrdersDto } from '../dtos/get-order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // ----------------- ORDER ON VOLUSION -----------------
  @Post('order-on-volusion')
  async orderOnVolusion(@Body() body, @Res() res: Response) {
    return this.orderService.orderOnVolusion(body, res);
  }

  // ----------------- SYNC -----------------
  @Get('sync')
  async sync(@Res() res: Response) {
    return this.orderService.sync(res);
  }

  // ----------------- ORDER ON BLUE SKY -----------------
  @Post('order-on-blue-sky')
  async orderOnBlueSky(@Body() body: any, @Res() res: Response) {
    try {
      // parse InvoiceableOn date
      body.InvoiceableOn = new Date(body.InvoiceableOn);
      const order = { ...body };

      // check for duplicate quote
      if (body.QuoteNo) {
        const response = await this.orderService.checkIfQuoteAlreadyAttached(
          body.QuoteNo,
        );
        if (response ? response.length > 0 : false) {
          return res
            .status(400)
            .json({ error: 'Quote is already attached to an order!' });
        }
      }

      // if OrderID exists → snapshot also
      if (body.OrderID) {
        const result = await this.orderService.insertOrder(body);
        // await this.orderService.addOrderSnapshot(order);
        return res.json(result);
      } else {
        const result = await this.orderService.insertOrder(body);
        return res.json(result);
      }
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ----------------- ORDER PACKAGES -----------------
  @Get('order-packages/:orderId')
  async getOrderPackages(@Param('orderId', ParseIntPipe) orderId: number) {
    return this.orderService.getOrderPackages(orderId);
  }

  // ----------------- ORDER TRACK -----------------
  @Get('order-track/:orderId')
  async getOrderTrack(@Param('orderId') orderId: string) {
    return this.orderService.getOrderTrack(Number(orderId));
  }

  @Delete('delete-order-track')
  async deleteOrderTrack(@Param('id') id: string) {
    return this.orderService.deleteOrderTrack(Number(id));
  }

  // ----------------- LIST ORDERS -----------------
  @Get('lists')
  async listOrders() {
    try {
      const orders = await this.orderService.getOrdersByOpenStatus();
      return orders;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('list/:duration')
  async getOrders(
    @Param('duration') duration: string,
    @Query() query: GetOrdersDto,
  ) {
    try {
      // Merge duration from params with query parameters
      const orderQuery: GetOrdersDto = {
        duration,
        startTime: query.startTime,
        endTime: query.endTime,
        openStatus: query.openStatus,
      };
      const orders = await this.orderService.getOrders(orderQuery);
      return orders;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('list')
  async listOrdersByDate(@Body() body, @Res() res: Response) {
    return this.orderService.listOrdersByDate(body, res);
  }

  @Post('listByStatus')
  async listByStatus(@Body() body) {
    return this.orderService.getOrdersByStatus(body);
  }

  @Post('getOrdersCSV')
  async getOrdersCSV(@Body() body, @Res() res: Response, @Req() req: Request) {
    return this.orderService.getOrdersCSV(req, res, body);
  }

  @Post('getOrdersProductCSV')
  async getOrdersProductCSV(
    @Body() body,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    try {
      const orders = await this.orderService.getOrdersByStatus(body);
      return orders;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // ----------------- GET ORDER -----------------
  @Get('get/:orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrder(orderId);
  }

  @Get('files/:orderId')
  async getOrderFiles(@Param('orderId') orderId: string) {
    return this.orderService.getAttachedFiles(Number(orderId));
  }

  @Get('files/for/quotes/:quoteId')
  async getAttachedFilesForQuotes(@Param('quoteId') quoteId: string) {
    return this.orderService.getAttachedFilesForQuotes(Number(quoteId));
  }

  @Post('save/orderNo/for/quotes')
  async saveOrderNoForQuotes(@Body() dto: UpdateQuoteFileDto) {
    return this.orderService.saveOrderNoForQuotes(dto.orderId, dto.quoteId);
  }

  @Get('get-by-serial/:serialNo')
  async getBySerial(@Req() req: Request) {
    return this.orderService.getOrderBySerial(req.query as any);
  }

  @Get('get-backorder-sheet')
  async getBackOrder(@Req() req: Request, @Res() res: Response) {
    return this.orderService.getBackOrder(req.query as any);
  }

  // ----------------- FILES -----------------
  @Get('delete/file/:id')
  async deleteFile(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    return this.orderService.deleteFile(req.query as any);
  }

  @Post('upload/:orderId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Body() reqData: CreateFileDto,
    @Query('url') url: string,
    @Query('extension') extension: string,
  ) {
    return this.orderService.uploadFile(reqData, url, extension);
  }

  @Get('check/quote-already-attached/:quoteNo')
  async checkIfQuoteAlreadyAttached(
    @Param('quoteNo', ParseIntPipe) quoteNo: number,
  ) {
    return this.orderService.checkIfQuoteAlreadyAttached(quoteNo);
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    return this.orderService.downloadFile(id, res);
  }
}
