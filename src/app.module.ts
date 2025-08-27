import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { CustomerModule } from './customer/customer.module';
import { EndUserModule } from './endUser/end-user.module';
import { SettingsModule } from './settings/settings.module';
import { ProductModule } from './product/product.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UserModule,
    CustomerModule,
    EndUserModule,
    SettingsModule,
    ProductModule
  ],
})
export class AppModule {}
