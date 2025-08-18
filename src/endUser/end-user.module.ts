import { Module } from '@nestjs/common';
import { EndUserController } from './controllers/end-user.controller';
import { EndUserService } from './service/end-user.service';

@Module({ controllers: [EndUserController], providers: [EndUserService] })
export class EndUserModule {}
