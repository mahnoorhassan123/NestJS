import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';

@Module({ controllers: [CustomerController], providers: [CustomerService] })
export class CustomerModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CustomerController);
  }
}
