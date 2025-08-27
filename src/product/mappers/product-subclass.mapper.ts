import { ProductSubClass as PrismaProductSubClass, Prisma } from '@prisma/client';
import { ProductSubClassEntity } from '../entities/product-subclass.entity';

export class ProductSubClassMapper {
  static toDomain(PrismaProductSubClass: PrismaProductSubClass): ProductSubClassEntity {
    return {
      id: PrismaProductSubClass.Id,
      name: PrismaProductSubClass.Name,
    };
  }

  static toPersistence(productSubClass: ProductSubClassEntity): Prisma.ProductSubClassCreateInput {
    return {
      Name: productSubClass.name,
    };
  }
}