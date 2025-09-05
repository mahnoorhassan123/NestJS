import { Prisma } from "@prisma/client";

export class ProductLogEntity {
  id: number;
  productId?: number | null;
  operation?: string | null;
  timestamp: Date;
  userId?: number | null;
  oldData?: Prisma.JsonValue | null;
  newData?: Prisma.JsonValue | null;
}