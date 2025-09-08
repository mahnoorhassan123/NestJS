import { Module } from '@nestjs/common';
import { QuoteController } from './controllers/quote.controller';
import { QuoteService } from './services/quote.service';
import { UtilsService } from './helpers/utils';
import { PrismaClient } from '@prisma/client';
import { SlackService } from 'src/common/services/slack.service';
import { GoogleDriveService } from './helpers/googleDrive';

@Module({
  controllers: [QuoteController],
  providers: [
    QuoteService,
    UtilsService,
    PrismaClient,
    SlackService,
    GoogleDriveService,
  ],
})
export class QuoteModule {}
