import { faker } from '@faker-js/faker';
import { ProductDetailEntity } from '../entities/product-detail.entity';
import { ImageEntity } from '../entities/image.entity';

describe('ProductDetailEntity', () => {
  const createImageEntity = (): ImageEntity => {
    const entity = new ImageEntity();
    entity.id = faker.number.int({ min: 1, max: 1000 });
    entity.tableId = faker.number.int({ min: 1, max: 1000 });
    entity.tableName = faker.helpers.arrayElement(['products', 'categories', 'orders']);
    entity.imageUrl = faker.image.url();
    entity.displayOrder = faker.number.int({ min: 1, max: 10 });
    entity.createdAt = faker.datatype.boolean() ? faker.date.recent() : null;
    entity.isThumb = faker.datatype.boolean() ? true : null;
    return entity;
  };

  const createProductDetailEntity = (): ProductDetailEntity => {
    const entity = new ProductDetailEntity();
    entity.productDetailId = faker.number.int({ min: 1, max: 1000 });
    entity.productId = faker.number.int({ min: 1, max: 1000 });
    entity.name = faker.commerce.productName();
    entity.url = faker.internet.url();
    entity.isActive = faker.datatype.boolean();
    entity.createdAt = faker.datatype.boolean() ? faker.date.recent() : null;
    entity.images = Array.from({ length: 3 }, () => createImageEntity());
    return entity;
  };

  it('should create a ProductDetailEntity with correct types', () => {
    const entity = createProductDetailEntity();

    expect(typeof entity.productDetailId).toBe('number');
    expect(typeof entity.productId).toBe('number');
    expect(typeof entity.name).toBe('string');
    expect(typeof entity.url).toBe('string');
    expect(typeof entity.isActive).toBe('boolean');
    expect(entity.createdAt === null || entity.createdAt instanceof Date).toBe(true);
    expect(Array.isArray(entity.images)).toBe(true);
    entity.images?.forEach(img => {
      expect(typeof img.id).toBe('number');
      expect(typeof img.tableId).toBe('number');
      expect(['products', 'categories', 'orders']).toContain(img.tableName);
      expect(typeof img.imageUrl).toBe('string');
    });
  });

  it('should allow multiple independent instances', () => {
    const entity1 = createProductDetailEntity();
    const entity2 = createProductDetailEntity();

    expect(entity1).not.toEqual(entity2);
  });

  it('should handle an array of ProductDetailEntity', () => {
    const entities: ProductDetailEntity[] = Array.from({ length: 5 }, () => createProductDetailEntity());

    expect(entities).toHaveLength(5);
    entities.forEach(e => {
      expect(typeof e.productDetailId).toBe('number');
      expect(typeof e.productId).toBe('number');
      expect(typeof e.name).toBe('string');
      expect(typeof e.url).toBe('string');
      expect(typeof e.isActive).toBe('boolean');
    });
  });
});
