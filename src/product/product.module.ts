import { Module } from '@nestjs/common';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SlackService } from '../common/services/slack.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    UserModule, 
  ],
  controllers: [ProductController],
  providers: [ProductService, PrismaService, SlackService, AuthGuard],
})
export class ProductModule {}
