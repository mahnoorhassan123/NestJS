import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { PrismaService } from '../prisma/prisma.service';
import { MailHelper } from './helpers/mail.helper';
import { AuthMiddleware } from '../common/middleware/auth.middleware';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, MailHelper],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UserController);
  }
}
