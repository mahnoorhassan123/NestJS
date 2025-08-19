import { Module } from '@nestjs/common';
import { TagsService } from './tags/services/tags.service';
import { TagsController } from './tags/controllers/tags.controller';
import { TagsModule } from './tags/tags.module';

@Module({
  controllers: [TagsController],
  providers: [TagsService],
  imports: [TagsModule],
})
export class SettingsModule {}
