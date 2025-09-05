import { TagTable as PrismaTagTable, Prisma } from '@prisma/client';
import { TagTableEntity } from '../entities/tag-table.entity';

export class TagMapper {
  static toDomain(prismaTagTable: PrismaTagTable): TagTableEntity {
    return {
      id: prismaTagTable.id,
      tableName: prismaTagTable.tableName ?? undefined,
      tableId: prismaTagTable.tableId,
      tagId: prismaTagTable.tagid,
    };
  }

  static toPersistence(tagTable: TagTableEntity): Prisma.TagTableCreateInput {
    return {
      tableName: tagTable.tableName,
      tagid: tagTable.tagId,
      product: {
        connect: { ProductID: tagTable.tableId },
      },
    };
  }
}
