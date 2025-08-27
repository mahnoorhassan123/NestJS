import { faker } from '@faker-js/faker';
import { ImageDto } from '../dtos/image.dto';

describe('ImageDto', () => {
  it('should create a valid ImageDto with correct properties', () => {
    const dto = new ImageDto();
    dto.id = faker.number.int({ min: 1, max: 1000 });
    dto.tableId = faker.number.int({ min: 1, max: 100 });
    dto.tableName = faker.word.words(2);
    dto.imageUrl = faker.image.url();
    dto.displayOrder = faker.number.int({ min: 1, max: 10 });
    dto.createdAt = faker.date.recent();
    dto.isThumb = faker.datatype.boolean();

    expect(typeof dto.id).toBe('number');
    expect(typeof dto.tableId).toBe('number');
    expect(typeof dto.tableName).toBe('string');
    expect(typeof dto.imageUrl).toBe('string');
    expect(typeof dto.displayOrder).toBe('number');
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(typeof dto.isThumb).toBe('boolean');
  });

  it('should allow null values for optional fields', () => {
    const dto = new ImageDto();
    dto.id = faker.number.int({ min: 1, max: 1000 });
    dto.tableId = faker.number.int({ min: 1, max: 100 });
    dto.tableName = faker.word.words(2);
    dto.imageUrl = faker.image.url();
    dto.displayOrder = faker.number.int({ min: 1, max: 10 });
    dto.createdAt = null;
    dto.isThumb = null;

    expect(dto.createdAt).toBeNull();
    expect(dto.isThumb).toBeNull();
  });

  it('should create multiple instances independently', () => {
    const dto1 = new ImageDto();
    const dto2 = new ImageDto();

    dto1.id = faker.number.int({ min: 1, max: 1000 });
    dto2.id = faker.number.int({ min: 1, max: 1000 });

    expect(dto1.id).not.toBe(dto2.id);
  });
});
