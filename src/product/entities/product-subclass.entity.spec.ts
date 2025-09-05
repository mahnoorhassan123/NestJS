import { faker } from '@faker-js/faker';
import { ProductSubClassEntity } from '../entities/product-subclass.entity';

describe('ProductSubClassEntity', () => {
  const createProductSubClass = (): ProductSubClassEntity => {
    const entity = new ProductSubClassEntity();
    entity.id = faker.number.int({ min: 1, max: 1000 });
    entity.name = faker.commerce.department();
    return entity;
  };

  it('should create a ProductSubClassEntity with correct properties', () => {
    const entity = createProductSubClass();

    expect(typeof entity.id).toBe('number');
    expect(typeof entity.name).toBe('string');
  });

  it('should allow multiple independent instances', () => {
    const entity1 = createProductSubClass();
    const entity2 = createProductSubClass();

    expect(entity1).not.toEqual(entity2);
  });

  it('should handle array of ProductSubClassEntity', () => {
    const entities: ProductSubClassEntity[] = Array.from({ length: 5 }, () => createProductSubClass());

    expect(entities).toHaveLength(5);
    entities.forEach(e => {
      expect(typeof e.id).toBe('number');
      expect(typeof e.name).toBe('string');
    });
  });
});
