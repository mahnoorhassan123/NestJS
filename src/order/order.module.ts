import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';
import { S3Service } from '../common/services/s3-upload.service';
import { S3Client } from '@aws-sdk/client-s3';
import { SlackService } from 'src/common/services/slack.service';
import { OrderSnapshotService } from './services/order-snapshot.service';

@Module({
  controllers: [OrderController],
  providers: [
    OrderService,
    S3Service,
    S3Client,
    String,
    SlackService,
    OrderSnapshotService,
  ],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes
      // 'order/sync',
      // 'order/order-on-blue-sky',
      // 'order/order-packages/:orderId',
      // 'order/order-track/:orderId',
      // 'order/lists',
      // 'order/list/:duration',
      // 'order/get/:orderId',
      // 'order/files/:orderId',
      // 'order/files/for/quotes/:quoteId',
      // 'order/save/orderNo/for/quotes',
      // 'order/get-by-serial/:serialNo',
      // 'order/get-backorder-sheet',
      // 'order/delete/file/:id',
      // 'order/upload/:orderId',
      // 'order/check/quote-already-attached/:QuoteNo',
      ();
  }
}
