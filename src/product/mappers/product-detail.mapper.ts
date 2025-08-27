import { ProductDetail as PrismaProductDetail, Prisma } from '@prisma/client';
import { ProductDetailEntity } from '../entities/product-detail.entity';

export class ProductDetailMapper {
  static toDomain(prismaProduct: PrismaProductDetail): ProductDetailEntity {
    return {
      productDetailId: prismaProduct.ProductDetailID,
      productId: prismaProduct.ProductID,
      name: prismaProduct.Name,
      url: prismaProduct.URL,
      isActive: prismaProduct.isActive,
      createdAt: prismaProduct.CreatedAt,
    };
  }

  static toPersistence(productDetail: ProductDetailEntity): Prisma.ProductDetailCreateInput {
  return {
    Name: productDetail.name,
    URL: productDetail.url,
    isActive: productDetail.isActive,
    CreatedAt: productDetail.createdAt ?? undefined,
    product: { connect: { ProductID: productDetail.productId } }, 
  };
}

}