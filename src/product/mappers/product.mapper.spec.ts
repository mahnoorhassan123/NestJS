import { faker } from '@faker-js/faker';
import { ProductMapper } from '../mappers/product.mapper';
import { ProductEntity } from '../entities/product.entity';
import { Product as PrismaProduct } from '@prisma/client';

describe('ProductMapper', () => {
    let mockPrismaProduct: PrismaProduct;
    let mockProductEntity: ProductEntity;

    beforeEach(() => {
        mockPrismaProduct = {
            ProductID: faker.number.int(),
            ProductCode: faker.string.alphanumeric(10),
            ProductName: faker.commerce.productName(),
            ProductDescriptionShort: faker.lorem.sentence(),
            ProductDescription: faker.lorem.paragraph(),
            ProductNameShort: faker.lorem.word(),
            ProductPrice: faker.number.int({ min: 1, max: 1000 }),
            ProductPriceYuan: faker.number.int({ min: 1, max: 1000 }),
            ProductPriceYen: faker.number.int({ min: 1, max: 1000 }),
            ProductPriceEuro: faker.number.int({ min: 1, max: 1000 }),
            ProductPricePound: faker.number.int({ min: 1, max: 1000 }),
            ProductPriceWON: faker.number.int({ min: 1, max: 1000 }),
            ProductPriceINR: faker.number.int({ min: 1, max: 1000 }),
            ProductWeight: faker.number.int({ min: 1, max: 100 }),
            FreeShippingItem: faker.datatype.boolean(),
            Photo_AltText: faker.lorem.word(),
            Hide_FreeAccessories: faker.datatype.boolean(),
            TaxableProduct: faker.datatype.boolean(),
            TechSpecs: faker.lorem.sentence(),
            HideProduct: faker.datatype.boolean(),
            ModifyOn: faker.date.recent(),
            CreatedOn: faker.date.past(),
            StockStatus: faker.lorem.word(),
            Availability: faker.lorem.word(),
            ProductPrice_Name: faker.lorem.word(),
            ProductManufacturer: faker.company.name(),
            SalePrice_Name: faker.lorem.word(),
            Accessories: faker.lorem.words(),
            OptionIDs: faker.string.alphanumeric(10),
            FreeAccessories: faker.lorem.words(),
            ProductDetailURL: faker.internet.url(),
            ExtInfo: faker.lorem.sentence(),
            ProductDescription_AbovePricing: faker.lorem.sentence(),
            ProductPhotoURL: faker.image.url(),
            Discount: faker.number.int(),
            METATAG_Description: faker.lorem.sentence(),
            METATAG_Keywords: faker.lorem.words(),
            PriorityIndex: faker.number.int(),
            HideWhenOutOfStock: faker.datatype.boolean(),
            isActive: faker.datatype.boolean(),
            isCompleted: faker.datatype.boolean(),
            isDeleted: faker.datatype.boolean(),
            isFeatured: faker.datatype.boolean(),
            TitleImage: faker.image.url(),
            isSerialAble: faker.datatype.boolean(),
            isFreeProduct: faker.datatype.boolean(),
            HarmonizedCode: faker.string.alphanumeric(10),
            ExportControlClassificationNumber: faker.string.alphanumeric(10),
            UnitOfMeasure: faker.lorem.word(),
            CountryOfOrigin: faker.address.country(),
            ExportDescription: faker.lorem.sentence(),
            GroupId: faker.number.int(),
            backlog_leadtime: faker.string.alphanumeric(),
            backlog_comments: faker.lorem.sentence(),
            backlog_priority: faker.number.int(),
            backlog_show: faker.datatype.boolean(),
            updatedDateBacklogComment: faker.date.recent(),
            holdForApproval: faker.datatype.boolean(),
            Accessory: faker.datatype.boolean(),
            Maintenance: faker.datatype.boolean(),
            Upgrade: faker.datatype.boolean(),
            Resale: faker.datatype.boolean(),
            productClassId: faker.number.int(),
            productSubClassId: faker.number.int(),
            gpn: faker.string.alphanumeric(10),
            StoreCategory: faker.number.int(),
            isMultiClassification: faker.datatype.boolean(),
            CreatedBy: faker.string.alphanumeric(10),
            ModifiedBy: faker.string.alphanumeric(10),
        };

        mockProductEntity = ProductMapper.toDomain(mockPrismaProduct);
    });

    describe('toDomain', () => {
        it('should map Prisma.Product to ProductEntity correctly', () => {
            const result = ProductMapper.toDomain(mockPrismaProduct);
            expect(result).toEqual(mockProductEntity);
        });
    });

    describe('toPersistence', () => {
        it('should map ProductEntity to Prisma.ProductCreateInput correctly', () => {
            const result = ProductMapper.toPersistence(mockProductEntity);
            expect(result.ProductCode).toEqual(mockProductEntity.productCode);
            expect(result.ProductName).toEqual(mockProductEntity.productName);
            expect(result.productClass?.connect?.Id).toEqual(mockProductEntity.productClassId);
            expect(result.productSubClass?.connect?.Id).toEqual(mockProductEntity.productSubClassId);

        });

        it('should handle undefined productClassId and productSubClassId', () => {
            const entity = { ...mockProductEntity, productClassId: undefined, productSubClassId: undefined };
            const result = ProductMapper.toPersistence(entity);
            expect(result.productClass).toBeUndefined();
            expect(result.productSubClass).toBeUndefined();
        });
    });

    describe('toSummary', () => {
        it('should map raw summary object to ProductEntity correctly', () => {
            const raw = {
                ProductID: faker.number.int(),
                ProductCode: faker.string.alphanumeric(10),
                isFeatured: faker.datatype.boolean(),
                HideProduct: faker.datatype.boolean(),
            };
            const result = ProductMapper.toSummary(raw);
            expect(result.productId).toEqual(raw.ProductID);
            expect(result.productCode).toEqual(raw.ProductCode);
            expect(result.isFeatured).toEqual(raw.isFeatured);
            expect(result.hideProduct).toEqual(raw.HideProduct);
        });
    });
});
