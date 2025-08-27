import { faker } from '@faker-js/faker';
import { ProductLogMapper } from '../mappers/product-log.mapper';
import { ProductLogEntity } from '../entities/product-log.entity';
import { ProductLog as PrismaProductLog } from '@prisma/client';

describe('ProductLogMapper', () => {
    let mockPrismaProductLog: PrismaProductLog;
    let mockProductLogEntity: ProductLogEntity;

    beforeEach(() => {
        mockPrismaProductLog = {
            id: faker.number.int(),
            product_id: faker.number.int(),
            operation: faker.lorem.word(),
            timestamp: faker.date.recent(),
            user_id: faker.number.int(),
            old_data: { field1: faker.string.alphanumeric(5), field2: faker.number.int() },
            new_data: { field1: faker.string.alphanumeric(5), field2: faker.number.int() },
        };

        mockProductLogEntity = {
            id: mockPrismaProductLog.id,
            productId: mockPrismaProductLog.product_id,
            operation: mockPrismaProductLog.operation,
            timestamp: mockPrismaProductLog.timestamp,
            userId: mockPrismaProductLog.user_id,
            oldData: mockPrismaProductLog.old_data,
            newData: mockPrismaProductLog.new_data,
        };
    });

    describe('toDomain', () => {
        it('should map Prisma.ProductLog to ProductLogEntity correctly', () => {
            const result = ProductLogMapper.toDomain(mockPrismaProductLog);
            expect(result).toEqual(mockProductLogEntity);
        });
    });

    describe('toPersistence', () => {
        it('should map ProductLogEntity to Prisma.ProductLogCreateInput correctly', () => {
            const result = ProductLogMapper.toPersistence(mockProductLogEntity);
            expect(result).toEqual({
                operation: mockProductLogEntity.operation,
                timestamp: mockProductLogEntity.timestamp,
                old_data: mockProductLogEntity.oldData,
                new_data: mockProductLogEntity.newData,
            });
        });
    });
});
