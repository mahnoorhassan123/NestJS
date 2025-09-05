import { faker } from '@faker-js/faker';
import { ImageMapper } from '../mappers/image.mapper';
import { ImageEntity } from '../entities/image.entity';
import { Image as PrismaImage } from '@prisma/client';


describe('ImageMapper', () => {

    let mockPrismaImage: PrismaImage;
    let mockImageEntity: ImageEntity;

    beforeEach(() => {
        mockPrismaImage = {
            ID: faker.number.int(),
            TableID: faker.number.int(),
            TableName: faker.commerce.productName(),
            ImageURL: faker.image.url(),
            DisplayOrder: faker.number.int({ min: 1, max: 10 }),
            CreatedAt: faker.date.past(),
            isThumb: faker.datatype.boolean(),
        };

        mockImageEntity = {
            id: mockPrismaImage.ID,
            tableId: mockPrismaImage.TableID,
            tableName: mockPrismaImage.TableName,
            imageUrl: mockPrismaImage.ImageURL,
            displayOrder: mockPrismaImage.DisplayOrder,
            createdAt: mockPrismaImage.CreatedAt,
            isThumb: mockPrismaImage.isThumb,
        };
    });

    describe('toDomain', () => {
        it('should map Prisma.Image to ImageEntity correctly', () => {
            const result = ImageMapper.toDomain(mockPrismaImage);

            expect(result).toEqual(mockImageEntity);
        });
    });

    describe('toPersistence', () => {
        it('should map ImageEntity to Prisma.ImageCreateInput correctly when tableId exists', () => {
            const result = ImageMapper.toPersistence(mockImageEntity);

            expect(result).toEqual({
                TableName: mockImageEntity.tableName,
                ImageURL: mockImageEntity.imageUrl,
                DisplayOrder: mockImageEntity.displayOrder,
                CreatedAt: mockImageEntity.createdAt,
                isThumb: mockImageEntity.isThumb,
                productDetail: { connect: { ProductDetailID: mockImageEntity.tableId } },
            });
        });

        it('should map ImageEntity to Prisma.ImageCreateInput correctly when tableId is undefined', () => {
            const entityWithoutTableId = { ...mockImageEntity, tableId: 0 };
            const result = ImageMapper.toPersistence(entityWithoutTableId);

            expect(result).toEqual({
                TableName: entityWithoutTableId.tableName,
                ImageURL: entityWithoutTableId.imageUrl,
                DisplayOrder: entityWithoutTableId.displayOrder,
                CreatedAt: entityWithoutTableId.createdAt,
                isThumb: entityWithoutTableId.isThumb,
                productDetail: undefined,
            });
        });

        it('should set CreatedAt and isThumb as undefined if they are null', () => {
            const entityWithNulls = { ...mockImageEntity, createdAt: null, isThumb: null };
            const result = ImageMapper.toPersistence(entityWithNulls);

            expect(result.CreatedAt).toBeUndefined();
            expect(result.isThumb).toBeUndefined();
        });
    });
});
