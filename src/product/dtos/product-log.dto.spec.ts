import { faker } from '@faker-js/faker';
import { ProductLogDto } from '../dtos/product-log.dto';

describe('ProductLogDto', () => {
  it('should create a valid ProductLogDto with required and optional properties', () => {
    const dto = new ProductLogDto();
    dto.id = faker.number.int({ min: 1, max: 1000 });
    dto.productId = faker.number.int({ min: 1, max: 100 });
    dto.operation = faker.lorem.word();
    dto.timestamp = faker.date.recent();
    dto.userId = faker.number.int({ min: 1, max: 50 });
    dto.oldData = { name: faker.commerce.productName(), price: faker.commerce.price() };
    dto.newData = { name: faker.commerce.productName(), price: faker.commerce.price() };

    expect(typeof dto.id).toBe('number');
    expect(typeof dto.productId).toBe('number');
    expect(typeof dto.operation).toBe('string');
    expect(dto.timestamp).toBeInstanceOf(Date);
    expect(typeof dto.userId).toBe('number');
    expect(typeof dto.oldData).toBe('object');
    expect(typeof dto.newData).toBe('object');
  });

  it('should allow optional properties to be undefined', () => {
    const dto = new ProductLogDto();
    dto.id = faker.number.int({ min: 1, max: 1000 });
    dto.timestamp = faker.date.recent();

    expect(dto.productId).toBeUndefined();
    expect(dto.operation).toBeUndefined();
    expect(dto.userId).toBeUndefined();
    expect(dto.oldData).toBeUndefined();
    expect(dto.newData).toBeUndefined();
  });

  it('should create multiple independent instances', () => {
    const dto1 = new ProductLogDto();
    const dto2 = new ProductLogDto();

    dto1.id = faker.number.int({ min: 1, max: 1000 });
    dto2.id = faker.number.int({ min: 1, max: 1000 });

    expect(dto1.id).not.toBe(dto2.id);
  });
});
