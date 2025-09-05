import { faker } from '@faker-js/faker';
import { ProductClassMapper } from '../mappers/product-class.mapper';
import { ProductClassEntity } from '../entities/product-class.entity';
import { ProductClass as PrismaProductClass } from '@prisma/client';

describe('ProductClassMapper', () => {
  let mockPrismaProductClass: PrismaProductClass;
  let mockProductClassEntity: ProductClassEntity;

  beforeEach(() => {
    mockPrismaProductClass = {
      Id: faker.number.int(),
      Name: faker.commerce.productName(),
    };

    mockProductClassEntity = {
      id: mockPrismaProductClass.Id,
      name: mockPrismaProductClass.Name,
    };
  });

  describe('toDomain', () => {
    it('should map Prisma.ProductClass to ProductClassEntity correctly', () => {
      const result = ProductClassMapper.toDomain(mockPrismaProductClass);
      expect(result).toEqual(mockProductClassEntity);
    });
  });

  describe('toPersistence', () => {
    it('should map ProductClassEntity to Prisma.ProductClassCreateInput correctly', () => {
      const result = ProductClassMapper.toPersistence(mockProductClassEntity);
      expect(result).toEqual({
        Name: mockProductClassEntity.name,
      });
    });
  });
});
