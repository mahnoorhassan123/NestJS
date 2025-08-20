import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { RmaController } from './controllers/rma.controller';
import { RmaService } from './services/rma.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [RmaController],
  providers: [RmaService],
})
export class RmaModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(RmaController);
  }
}
