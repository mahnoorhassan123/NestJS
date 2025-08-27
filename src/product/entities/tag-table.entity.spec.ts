import { faker } from '@faker-js/faker';
import { TagTableEntity } from '../entities/tag-table.entity';

describe('TagTableEntity', () => {
  const tableNames: Array<'customers' | 'orders' | 'quotes' | 'products'> = [
    'customers',
    'orders',
    'quotes',
    'products',
  ];

  const createTagTable = (): TagTableEntity => {
    const entity = new TagTableEntity();
    entity.id = faker.number.int({ min: 1, max: 1000 });
    entity.tableName = faker.helpers.arrayElement(tableNames);
    entity.tableId = faker.number.int({ min: 1, max: 1000 });
    entity.tagId = faker.number.int({ min: 1, max: 1000 });
    return entity;
  };

  it('should create a TagTableEntity with correct properties', () => {
    const entity = createTagTable();

    expect(typeof entity.id).toBe('number');
    expect(tableNames).toContain(entity.tableName);
    expect(typeof entity.tableId).toBe('number');
    expect(typeof entity.tagId).toBe('number');
  });

  it('should allow multiple independent instances', () => {
    const entity1 = createTagTable();
    const entity2 = createTagTable();

    expect(entity1).not.toEqual(entity2);
  });

  it('should handle array of TagTableEntity', () => {
    const entities: TagTableEntity[] = Array.from({ length: 5 }, () => createTagTable());

    expect(entities).toHaveLength(5);
    entities.forEach(e => {
      expect(typeof e.id).toBe('number');
      expect(tableNames).toContain(e.tableName);
      expect(typeof e.tableId).toBe('number');
      expect(typeof e.tagId).toBe('number');
    });
  });
});
