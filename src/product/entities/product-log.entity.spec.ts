import { faker } from '@faker-js/faker';
import { ProductLogEntity } from '../entities/product-log.entity';

describe('ProductLogEntity', () => {
  const createProductLogEntity = (): ProductLogEntity => {
    const entity = new ProductLogEntity();
    entity.id = faker.number.int({ min: 1, max: 1000 });
    entity.productId = faker.datatype.boolean() ? faker.number.int({ min: 1, max: 1000 }) : null;
    entity.operation = faker.datatype.boolean() ? faker.helpers.arrayElement(['CREATE', 'UPDATE', 'DELETE']) : null;
    entity.timestamp = faker.date.recent();
    entity.userId = faker.datatype.boolean() ? faker.number.int({ min: 1, max: 1000 }) : null;
    entity.oldData = faker.datatype.boolean() ? { oldField: faker.commerce.productName() } : null;
    entity.newData = faker.datatype.boolean() ? { newField: faker.commerce.productName() } : null;
    return entity;
  };

  it('should create a ProductLogEntity with correct properties', () => {
    const entity = createProductLogEntity();

    expect(typeof entity.id).toBe('number');
    expect(entity.productId === null || typeof entity.productId === 'number').toBe(true);
    expect(entity.operation === null || typeof entity.operation === 'string').toBe(true);
    expect(entity.timestamp instanceof Date).toBe(true);
    expect(entity.userId === null || typeof entity.userId === 'number').toBe(true);
    expect(entity.oldData === null || typeof entity.oldData === 'object').toBe(true);
    expect(entity.newData === null || typeof entity.newData === 'object').toBe(true);
  });

  it('should allow multiple independent instances', () => {
    const log1 = createProductLogEntity();
    const log2 = createProductLogEntity();

    expect(log1).not.toEqual(log2);
  });

  it('should handle array of ProductLogEntity', () => {
    const logs: ProductLogEntity[] = Array.from({ length: 5 }, () => createProductLogEntity());

    expect(logs).toHaveLength(5);
    logs.forEach(log => {
      expect(typeof log.id).toBe('number');
      expect(log.timestamp instanceof Date).toBe(true);
    });
  });
});
