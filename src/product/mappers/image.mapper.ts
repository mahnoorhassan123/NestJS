import { Image as PrismaImage, Prisma } from '@prisma/client';
import { ImageEntity } from '../entities/image.entity';

export class ImageMapper {
  static toDomain(prismaImage: PrismaImage): ImageEntity {
    return {
      id: prismaImage.ID,
      tableId: prismaImage.TableID,
      tableName: prismaImage.TableName,
      imageUrl: prismaImage.ImageURL,
      displayOrder: prismaImage.DisplayOrder,
      createdAt: prismaImage.CreatedAt,
      isThumb: prismaImage.isThumb,
    };
  }

 static toPersistence(image: ImageEntity): Prisma.ImageCreateInput {
  return {
    TableName: image.tableName,
    ImageURL: image.imageUrl,
    DisplayOrder: image.displayOrder,
    CreatedAt: image.createdAt ?? undefined,
    isThumb: image.isThumb ?? undefined,
    productDetail: image.tableId
      ? { connect: { ProductDetailID: image.tableId } }
      : undefined,
  };
}
}