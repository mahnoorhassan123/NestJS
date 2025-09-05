import { ProductLog as PrismaProductLog, Prisma } from '@prisma/client';
import { ProductLogEntity } from '../entities/product-log.entity';

export class ProductLogMapper {
  static toDomain(prismaProductLog: PrismaProductLog): ProductLogEntity {
    return {
      id: prismaProductLog.id,
      productId: prismaProductLog.product_id,
      operation: prismaProductLog.operation,
      timestamp: prismaProductLog.timestamp,
      userId: prismaProductLog.user_id,
      oldData: prismaProductLog.old_data,
      newData: prismaProductLog.new_data,
    };
  }

  static toPersistence(productLog: ProductLogEntity): Prisma.ProductLogCreateInput {
    return {
      operation: productLog.operation,
      timestamp: productLog.timestamp,
      old_data: productLog.oldData as Prisma.InputJsonValue,
      new_data: productLog.newData as Prisma.InputJsonValue,
    };
  }
}