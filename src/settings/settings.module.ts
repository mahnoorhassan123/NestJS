import { Module } from '@nestjs/common';
import { TagsModule } from './tags/tags.module';
import { RmaModule } from './rma/rma.module';

@Module({
  imports: [TagsModule, RmaModule],
  controllers: [],
  providers: [],
})
export class SettingsModule {}
