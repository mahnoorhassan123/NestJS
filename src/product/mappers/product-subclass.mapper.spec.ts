import { faker } from '@faker-js/faker';
import { ProductSubClassMapper } from '../mappers/product-subclass.mapper';
import { ProductSubClassEntity } from '../entities/product-subclass.entity';
import { ProductSubClass as PrismaProductSubClass } from '@prisma/client';

describe('ProductSubClassMapper', () => {
  let mockPrismaProductSubClass: PrismaProductSubClass;
  let mockProductSubClassEntity: ProductSubClassEntity;

  beforeEach(() => {
    mockPrismaProductSubClass = {
      Id: faker.number.int(),
      Name: faker.commerce.productName(),
    };

    mockProductSubClassEntity = {
      id: mockPrismaProductSubClass.Id,
      name: mockPrismaProductSubClass.Name,
    };
  });

  describe('toDomain', () => {
    it('should map Prisma.ProductSubClass to ProductSubClassEntity correctly', () => {
      const result = ProductSubClassMapper.toDomain(mockPrismaProductSubClass);
      expect(result).toEqual(mockProductSubClassEntity);
    });
  });

  describe('toPersistence', () => {
    it('should map ProductSubClassEntity to Prisma.ProductSubClassCreateInput correctly', () => {
      const result = ProductSubClassMapper.toPersistence(mockProductSubClassEntity);
      expect(result).toEqual({
        Name: mockProductSubClassEntity.name,
      });
    });
  });
});
