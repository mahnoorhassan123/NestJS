import { ProductClass as PrismaProductClass, Prisma } from '@prisma/client';
import { ProductClassEntity } from '../entities/product-class.entity';

export class ProductClassMapper {
  static toDomain(PrismaProductClass: PrismaProductClass): ProductClassEntity {
    return {
      id: PrismaProductClass.Id,
      name: PrismaProductClass.Name,
    };
  }

  static toPersistence(productClass: ProductClassEntity): Prisma.ProductClassCreateInput {
    return {
      Name: productClass.name,
    };
  }
}