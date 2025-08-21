import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EndUserController } from './controllers/end-user.controller';
import { EndUserService } from './service/end-user.service';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';

@Module({ controllers: [EndUserController], providers: [EndUserService] })
export class EndUserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(EndUserController);
  }
}
