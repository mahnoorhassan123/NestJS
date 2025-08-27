import { faker } from '@faker-js/faker';
import { TagMapper } from '../mappers/tag-table.mapper';
import { TagTableEntity } from '../entities/tag-table.entity';
import { TableEnum, TagTable as PrismaTagTable } from '@prisma/client';

describe('TagMapper', () => {
  let mockPrismaTagTable: PrismaTagTable;
  let mockTagEntity: TagTableEntity;

  beforeEach(() => {
    mockPrismaTagTable = {
      id: faker.number.int(),
      tableName: TableEnum.products,
      tableId: faker.number.int(),
      tagid: faker.number.int(),
    };

    mockTagEntity = {
      id: mockPrismaTagTable.id,
      tableName: mockPrismaTagTable.tableName ?? undefined, 
      tableId: mockPrismaTagTable.tableId,
      tagId: mockPrismaTagTable.tagid,
    };
  });

  describe('toDomain', () => {
    it('should map Prisma.TagTable to TagTableEntity correctly', () => {
      const result = TagMapper.toDomain(mockPrismaTagTable);
      expect(result).toEqual(mockTagEntity);
    });

    it('should convert null tableName to undefined', () => {
      const prismaWithNull: PrismaTagTable = {
        ...mockPrismaTagTable,
        tableName: null,
      };
      const entity = TagMapper.toDomain(prismaWithNull);
      expect(entity.tableName).toBeUndefined();
    });
  });

  describe('toPersistence', () => {
    it('should map TagTableEntity to Prisma.TagTableCreateInput correctly', () => {
      const result = TagMapper.toPersistence(mockTagEntity);
      expect(result).toEqual({
        tableName: mockTagEntity.tableName,
        tagid: mockTagEntity.tagId,
        product: {
          connect: { ProductID: mockTagEntity.tableId },
        },
      });
    });
  });
});
