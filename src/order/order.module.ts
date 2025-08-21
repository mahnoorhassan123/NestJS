import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';

@Module({
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        'order/sync',
        'order/order-on-blue-sky',
        'order/order-packages/:orderId',
        'order/order-track/:orderId',
        'order/lists',
        'order/list/:duration',
        'order/get/:orderId',
        'order/files/:orderId',
        'order/files/for/quotes/:quoteId',
        'order/save/orderNo/for/quotes',
        'order/get-by-serial/:serialNo',
        'order/get-backorder-sheet',
        'order/delete/file/:id',
        'order/upload/:orderId',
        'order/check/quote-already-attached/:QuoteNo',
      );
  }
}
