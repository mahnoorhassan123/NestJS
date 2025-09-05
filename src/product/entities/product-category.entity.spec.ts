import { faker } from '@faker-js/faker';
import { ProductCategoryEntity } from '../entities/product-category.entity';

describe('ProductCategoryEntity', () => {
  const createProductCategoryEntity = (): ProductCategoryEntity => {
    const entity = new ProductCategoryEntity();
    entity.id = faker.number.int({ min: 1, max: 1000 });
    entity.categoryId = faker.number.int({ min: 1, max: 1000 });
    entity.productId = faker.number.int({ min: 1, max: 1000 });
    entity.createdAt = faker.date.past();
    entity.storeCat = faker.number.int({ min: 1, max: 100 });
    return entity;
  };

  it('should create a ProductCategoryEntity with correct types', () => {
    const entity = createProductCategoryEntity();

    expect(typeof entity.id).toBe('number');
    expect(typeof entity.categoryId).toBe('number');
    expect(typeof entity.productId).toBe('number');
    expect(entity.createdAt instanceof Date).toBe(true);
    expect(typeof entity.storeCat).toBe('number');
  });

  it('should allow multiple independent instances', () => {
    const entity1 = createProductCategoryEntity();
    const entity2 = createProductCategoryEntity();
    expect(entity1).not.toEqual(entity2);
  });

  it('should handle an array of ProductCategoryEntity', () => {
    const entities: ProductCategoryEntity[] = Array.from({ length: 5 }, () => createProductCategoryEntity());
    expect(entities).toHaveLength(5);
    entities.forEach(e => {
      expect(typeof e.id).toBe('number');
      expect(typeof e.categoryId).toBe('number');
      expect(typeof e.productId).toBe('number');
      expect(e.createdAt instanceof Date).toBe(true);
      expect(typeof e.storeCat).toBe('number');
    });
  });
});
