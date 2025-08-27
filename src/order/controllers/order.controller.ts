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
import { GetBackOrderDto, GetOrdersDto } from '../dtos/get-order.dto';
import path from 'path';
import { S3Service } from '../helpers/s3-upload-service';
import { GetOrdersCSVDto } from '../dtos/get-orders-csv.dto';
import { GetOrdersProductCSVDto } from '../dtos/get-orders-products-csv/dto';
import axios from 'axios';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly s3Service: S3Service,
    private readonly s3Client: S3Client,
    readonly defaultBucket: string,
    private configService: ConfigService
  ) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_KEY_ID') || '',
        secretAccessKey: this.configService.get<string>('AWS_SECRET') || '',
      },
      region:
        this.configService.get<string>('AWS_BUCKET_REGION') || 'us-east-1',
    });
    this.defaultBucket =
      this.configService.get<string>('AWS_DEFAULT_BUCKET') || 'bluesky-stage';
  }

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

  @Get('/list/open/:productId')
  async getOpenOrderByProductId(@Param('productId') productId: string) {
    return this.orderService.getOpenOrderByProductId(+productId);
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
        const result = await this.orderService.InsertOrders(order);
        // await this.orderService.addOrderSnapshot(order);
        return res.json(result);
      } else {
        const result = await this.orderService.InsertOrders(order);
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
    return this.orderService.GetOrderTrack(Number(orderId));
  }

  @Delete('delete-order-track/:id')
  async deleteOrderTrack(@Param('id') id: string) {
    return this.orderService.deleteOrderTrack(+id);
  }

  // ----------------- LIST ORDERS -----------------
  @Get('lists')
  async listOrders() {
    try {
      const orders = await this.orderService.GetOrdersByOpenStatus();
      return orders;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('list/:duration')
  async getOrders(@Param('duration') duration: string, @Query() query) {
    try {
      // Merge duration from params with query parameters
      const orderQuery: GetOrdersDto = {
        duration,
        startTime: query.startTime,
        endTime: query.endTime,
        openStatus: query.openStatus === 'true' ? true : false,
      };
      const orders = await this.orderService.GetOrders(orderQuery);
      return orders;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('list')
  async listOrdersByDate(@Body() body, @Res() res: Response) {
    let startDate = new Date(body.startDate.split('T')[0]);
    let endDate = new Date(body.endDate.split('T')[0]);
    let startTime =
      startDate.getFullYear() +
      '/' +
      (startDate.getMonth() + 1) +
      '/' +
      startDate.getDate() +
      ' 12:00:00 AM';
    let endTime =
      endDate.getFullYear() +
      '/' +
      (endDate.getMonth() + 1) +
      '/' +
      endDate.getDate() +
      ' 11:59:59 PM';
    let query = { startTime: startTime, endTime: endTime };
    return this.orderService.GetOrders(query);
  }

  @Post('listByStatus')
  async listByStatus(@Body() body) {
    return this.orderService.GetOrdersByStatus(body);
  }

  @Post('getOrdersCSV')
  async getOrdersCSV(@Body() body: GetOrdersCSVDto, @Res() res: Response) {
    try {
      await this.orderService.getOrdersCSV(body, res);
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Post('getOrdersProductCSV')
  async getOrdersProductCSV(
    @Body() body: GetOrdersProductCSVDto,
    @Res() res: Response,
  ) {
    try {
      await this.orderService.getOrdersProductCSV(body, res);
    } catch (error) {
      console.error('get orders product csv', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  // @Post('getOrdersProductCSV')
  // async getOrdersProductCSV(
  //   @Body() body,
  //   @Res() res: Response,
  //   @Req() req: Request,
  // ) {
  //   try {
  //     const orders = await this.orderService.GetOrdersByStatus(body);
  //     return orders;
  //   } catch (error) {
  //     throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
  //   }
  // }

  // ----------------- GET ORDER -----------------
  @Get('get/:orderId')
  async getOrder(@Param('orderId') orderId: string) {
    return this.orderService.getOrder(+orderId);
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
  async getBySerial(@Param('serialNo') serialNo: string) {
    return this.orderService.getOrderBySerial({ serialNo });
  }

  @Get('get-backorder-sheet')
  async getBackOrder(@Query() query: GetBackOrderDto) {
    try {
      const result = await this.orderService.getBackOrder(query.productCodes);
      return {
        response: result,
        message: 'successful',
        status: true,
      };
    } catch (error) {
      return {
        response: error,
        message: error.message,
        status: false,
      };
    }
  }

  // ----------------- FILES -----------------
  @Get('delete/file/:id')
  async deleteFile(@Param('id') id: string) {
    return this.orderService.deleteFile(+id);
  }

  @Post('upload/:orderId')
  @UseInterceptors(FileInterceptor('file')) // 'file' matches the form-data key
  async uploadFile(
    @Param('orderId') orderId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() fileUploadDto,
    @Res() res: Response,
  ) {
    try {
      // Check if file is provided
      if (!file) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'No file provided' });
      }

      // Validate required DTO fields
      if (!fileUploadDto.name || !fileUploadDto.fileType) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: 'Name and fileType are required' });
      }

      // Upload file to S3
      const bucketName = 'bluesky-stage';
      const key = file.originalname;
      // console.log('File Object:', JSON.stringify(file, null, 2));
      // console.log(file.filename, ', ', file.buffer);
      const { url, extension } = await this.s3Service.uploadFileToS3(
        bucketName,
        key,
        file.buffer,
        orderId,
      );

      // Prepare data for fileUpload method
      const reqData: CreateFileDto = {
        name: fileUploadDto.name,
        fileType: fileUploadDto.fileType,
        orderId: +orderId, // Convert to BigInt
        quoteId: fileUploadDto.quoteId ? fileUploadDto.quoteId : undefined,
        uploadedBy: fileUploadDto.uploadedBy, // Adjust based on your auth setup
      };

      // Call fileUpload method
      if (url) {
        const response = await this.orderService.uploadFile(
          reqData,
          url,
          extension,
        );
        return res
          .status(HttpStatus.OK)
          .json({ message: 'File uploaded successfully', url });
      } else {
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'S3 upload failed' });
      }
    } catch (error) {
      console.error('Error uploading file:', error.message);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: 'File upload failed' });
    }
  }

  @Get('check/quote-already-attached/:quoteNo')
  async checkIfQuoteAlreadyAttached(
    @Param('quoteNo', ParseIntPipe) quoteNo: number,
  ) {
    return this.orderService.checkIfQuoteAlreadyAttached(quoteNo);
  }

  @Get('download/:id')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    try {
      const urlResponse = await this.orderService.getAttachedFile(+id);
      if (!urlResponse || !urlResponse[0]) {
        res.status(HttpStatus.NOT_FOUND).send('File not found.');
        return;
      }

      const {
        file: s3Key,
        extension: fileExtension,
        name: fileName,
      } = urlResponse[0];
      const params = {
        Bucket: this.defaultBucket,
        Key: s3Key,
      };

      // Generate pre-signed URL using AWS SDK v3
      const command = new GetObjectCommand(params);
      const url = await getSignedUrl(this.s3Client, command, {
        expiresIn: 180,
      });

      // Fetch file using axios
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
      });

      // Set response headers
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}.${fileExtension}"`,
      });

      // Stream file to response
      response.data.pipe(res);
    } catch (error) {
      console.error(
        'Error downloading file from S3:',
        error.message,
        error.stack,
      );
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send(`Error downloading file: ${error.message}`);
    }
  }
}
