import { Module } from '@nestjs/common';
import { TagsModule } from './tags/tags.module';
import { RmaModule } from './rma/rma.module';
import { FileModule } from './files/files.module';

@Module({
  imports: [TagsModule, RmaModule, FileModule],
  controllers: [],
  providers: [],
})
export class SettingsModule {}
