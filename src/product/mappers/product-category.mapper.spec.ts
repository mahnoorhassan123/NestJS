import { faker } from '@faker-js/faker';
import { ProductCategoryMapper } from '../mappers/product-category.mapper';
import { ProductCategoryEntity } from '../entities/product-category.entity';
import { ProductCategory as PrismaProductCategory } from '@prisma/client';

describe('ProductCategoryMapper', () => {
  let mockPrismaProductCategory: PrismaProductCategory;
  let mockProductCategoryEntity: ProductCategoryEntity;

  beforeEach(() => {
    mockPrismaProductCategory = {
      ID: faker.number.int(),
      CategoryID: faker.number.int(),
      ProductID: faker.number.int(),
      CreatedAt: faker.date.past(),
      storeCat: faker.number.int({ min: 0, max: 10 }),
    };

    mockProductCategoryEntity = {
      id: mockPrismaProductCategory.ID,
      categoryId: mockPrismaProductCategory.CategoryID,
      productId: mockPrismaProductCategory.ProductID,
      createdAt: mockPrismaProductCategory.CreatedAt,
      storeCat: mockPrismaProductCategory.storeCat,
    };
  });

  describe('toDomain', () => {
    it('should map Prisma.ProductCategory to ProductCategoryEntity correctly', () => {
      const result = ProductCategoryMapper.toDomain(mockPrismaProductCategory);

      expect(result).toEqual(mockProductCategoryEntity);
    });
  });

  describe('toPersistence', () => {
    it('should map ProductCategoryEntity to Prisma.ProductCategoryCreateInput correctly when createdAt and storeCat exist', () => {
      const result = ProductCategoryMapper.toPersistence(mockProductCategoryEntity);

      expect(result).toEqual({
        CategoryID: mockProductCategoryEntity.categoryId,
        ProductID: mockProductCategoryEntity.productId,
        CreatedAt: mockProductCategoryEntity.createdAt,
        storeCat: mockProductCategoryEntity.storeCat,
      });
    });

    it('should set default values if createdAt or storeCat are undefined', () => {
      const entityWithUndefined = { ...mockProductCategoryEntity, createdAt: new Date(),  storeCat: 0 };
      const result = ProductCategoryMapper.toPersistence(entityWithUndefined);

      expect(result.CreatedAt).toBeInstanceOf(Date);
      expect(result.storeCat).toBe(0);
      expect(result.CategoryID).toBe(entityWithUndefined.categoryId);
      expect(result.ProductID).toBe(entityWithUndefined.productId);
    });
  });
});
