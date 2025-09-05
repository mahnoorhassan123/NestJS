import { faker } from '@faker-js/faker';
import { ProductDetailMapper } from '../mappers/product-detail.mapper';
import { ProductDetailEntity } from '../entities/product-detail.entity';
import { ProductDetail as PrismaProductDetail } from '@prisma/client';

describe('ProductDetailMapper', () => {
  let mockPrismaProductDetail: PrismaProductDetail;
  let mockProductDetailEntity: ProductDetailEntity;

  beforeEach(() => {
    mockPrismaProductDetail = {
      ProductDetailID: faker.number.int(),
      ProductID: faker.number.int(),
      Name: faker.commerce.productName(),
      URL: faker.internet.url(),
      isActive: faker.datatype.boolean(),
      CreatedAt: faker.date.past(),
    };

    mockProductDetailEntity = {
      productDetailId: mockPrismaProductDetail.ProductDetailID,
      productId: mockPrismaProductDetail.ProductID,
      name: mockPrismaProductDetail.Name,
      url: mockPrismaProductDetail.URL,
      isActive: mockPrismaProductDetail.isActive,
      createdAt: mockPrismaProductDetail.CreatedAt,
    };
  });

  describe('toDomain', () => {
    it('should map Prisma.ProductDetail to ProductDetailEntity correctly', () => {
      const result = ProductDetailMapper.toDomain(mockPrismaProductDetail);
      expect(result).toEqual(mockProductDetailEntity);
    });
  });

  describe('toPersistence', () => {
    it('should map ProductDetailEntity to Prisma.ProductDetailCreateInput correctly', () => {
      const result = ProductDetailMapper.toPersistence(mockProductDetailEntity);
      expect(result).toEqual({
        Name: mockProductDetailEntity.name,
        URL: mockProductDetailEntity.url,
        isActive: mockProductDetailEntity.isActive,
        CreatedAt: mockProductDetailEntity.createdAt,
        product: { connect: { ProductID: mockProductDetailEntity.productId } },
      });
    });

    it('should set CreatedAt as undefined if it is null', () => {
      const entityWithNull = { ...mockProductDetailEntity, createdAt: null };
      const result = ProductDetailMapper.toPersistence(entityWithNull);
      expect(result.CreatedAt).toBeUndefined();
    });
  });
});
