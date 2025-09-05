import { faker } from '@faker-js/faker';
import { ProductClassEntity } from '../entities/product-class.entity';

describe('ProductClassEntity', () => {
  const createProductClassEntity = (): ProductClassEntity => {
    const entity = new ProductClassEntity();
    entity.id = faker.number.int({ min: 1, max: 1000 });
    entity.name = faker.commerce.department();
    return entity;
  };

  it('should create a ProductClassEntity with correct types', () => {
    const entity = createProductClassEntity();

    expect(typeof entity.id).toBe('number');
    expect(typeof entity.name).toBe('string');
  });

  it('should allow multiple independent instances', () => {
    const entity1 = createProductClassEntity();
    const entity2 = createProductClassEntity();

    expect(entity1).not.toEqual(entity2);
  });

  it('should handle an array of ProductClassEntity', () => {
    const entities: ProductClassEntity[] = Array.from({ length: 5 }, () => createProductClassEntity());

    expect(entities).toHaveLength(5);
    entities.forEach(e => {
      expect(typeof e.id).toBe('number');
      expect(typeof e.name).toBe('string');
    });
  });
});
