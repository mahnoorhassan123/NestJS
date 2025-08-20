import { Module } from '@nestjs/common';
import { RmaController } from './controllers/rma.controller';
import { RmaService } from './services/rma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RmaController],
  providers: [RmaService],
})
export class RmaModule {}
