import { TableEnum } from "@prisma/client";

export class TagTableEntity {
  id: number;
  tableName?: TableEnum;
  tableId: number;
  tagId: number;
}
