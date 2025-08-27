import { faker } from '@faker-js/faker';
import { CreateTagTableDto } from '../dtos/tag-table.dto';

describe('CreateTagTableDto', () => {
  it('should create a CreateTagTableDto with correct properties', () => {
    const dto = new CreateTagTableDto();
    dto.tableName = faker.helpers.arrayElement(['customers', 'orders', 'quotes', 'products']);
    dto.tableId = faker.number.int({ min: 1, max: 1000 });
    dto.tagId = faker.number.int({ min: 1, max: 1000 });

    expect(['customers', 'orders', 'quotes', 'products']).toContain(dto.tableName);
    expect(typeof dto.tableId).toBe('number');
    expect(typeof dto.tagId).toBe('number');
  });

  it('should allow multiple independent instances', () => {
    const dto1 = new CreateTagTableDto();
    dto1.tableName = faker.helpers.arrayElement(['customers', 'orders', 'quotes', 'products']);
    dto1.tableId = faker.number.int({ min: 1, max: 1000 });
    dto1.tagId = faker.number.int({ min: 1, max: 1000 });

    const dto2 = new CreateTagTableDto();
    dto2.tableName = faker.helpers.arrayElement(['customers', 'orders', 'quotes', 'products']);
    dto2.tableId = faker.number.int({ min: 1, max: 1000 });
    dto2.tagId = faker.number.int({ min: 1, max: 1000 });

    expect(dto1).not.toEqual(dto2);
  });

  it('should handle array of CreateTagTableDto', () => {
    const dtos: CreateTagTableDto[] = Array.from({ length: 5 }, () => {
      const dto = new CreateTagTableDto();
      dto.tableName = faker.helpers.arrayElement(['customers', 'orders', 'quotes', 'products']);
      dto.tableId = faker.number.int({ min: 1, max: 1000 });
      dto.tagId = faker.number.int({ min: 1, max: 1000 });
      return dto;
    });

    expect(dtos).toHaveLength(5);
    dtos.forEach(d => {
      expect(['customers', 'orders', 'quotes', 'products']).toContain(d.tableName);
      expect(typeof d.tableId).toBe('number');
      expect(typeof d.tagId).toBe('number');
    });
  });
});
