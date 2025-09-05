import { ProductCategory as PrismaProductCategory, Prisma } from '@prisma/client';
import { ProductCategoryEntity } from '../entities/product-category.entity';

export class ProductCategoryMapper {
  static toDomain(prismaProductCategory: PrismaProductCategory): ProductCategoryEntity {
    return {
      id: prismaProductCategory.ID,
      categoryId: prismaProductCategory.CategoryID,
      productId: prismaProductCategory.ProductID,
      createdAt: prismaProductCategory.CreatedAt,
      storeCat: prismaProductCategory.storeCat,
    };
  }

  static toPersistence(productCategory: ProductCategoryEntity): Prisma.ProductCategoryCreateInput {
    return {
      CategoryID: productCategory.categoryId,
      ProductID: productCategory.productId,
      CreatedAt: productCategory.createdAt ?? new Date(),
      storeCat: productCategory.storeCat ?? 0,
    };
  }
}