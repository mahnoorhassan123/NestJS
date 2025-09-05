import { faker } from '@faker-js/faker';
import { ImageEntity } from '../entities/image.entity';

describe('ImageEntity', () => {
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

  it('should create an ImageEntity with correct properties', () => {
    const entity = createImageEntity();

    expect(typeof entity.id).toBe('number');
    expect(typeof entity.tableId).toBe('number');
    expect(['products', 'categories', 'orders']).toContain(entity.tableName);
    expect(typeof entity.imageUrl).toBe('string');
    expect(typeof entity.displayOrder).toBe('number');
    expect(entity.createdAt === null || entity.createdAt instanceof Date).toBe(true);
    expect(entity.isThumb === null || typeof entity.isThumb === 'boolean').toBe(true);
  });

  it('should allow multiple independent instances', () => {
    const entity1 = createImageEntity();
    const entity2 = createImageEntity();

    expect(entity1).not.toEqual(entity2);
  });

  it('should handle array of ImageEntity', () => {
    const entities: ImageEntity[] = Array.from({ length: 5 }, () => createImageEntity());

    expect(entities).toHaveLength(5);
    entities.forEach(e => {
      expect(typeof e.id).toBe('number');
      expect(typeof e.tableId).toBe('number');
      expect(['products', 'categories', 'orders']).toContain(e.tableName);
      expect(typeof e.imageUrl).toBe('string');
      expect(typeof e.displayOrder).toBe('number');
      expect(e.createdAt === null || e.createdAt instanceof Date).toBe(true);
      expect(e.isThumb === null || typeof e.isThumb === 'boolean').toBe(true);
    });
  });
});
