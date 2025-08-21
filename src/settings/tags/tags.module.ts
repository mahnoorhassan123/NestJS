import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TagsService } from './services/tags.service';
import { TagsController } from './controllers/tags.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthMiddleware } from 'src/common/middleware/auth.middleware';

@Module({
  imports: [PrismaModule],
  controllers: [TagsController],
  providers: [TagsService],
})
export class TagsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(TagsController);
  }
}
