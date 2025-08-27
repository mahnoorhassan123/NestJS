import { faker } from '@faker-js/faker';
import { ProductDetailDto } from '../dtos/product-detail.dto';

describe('ProductDetailDto', () => {
  it('should create a valid ProductDetailDto with correct properties', () => {
    const dto = new ProductDetailDto();
    dto.productDetailID = faker.number.int({ min: 1, max: 1000 });
    dto.productID = faker.number.int({ min: 1, max: 100 });
    dto.name = faker.commerce.productName();
    dto.url = faker.internet.url();
    dto.isActive = faker.datatype.boolean();
    dto.createdAt = faker.date.recent();

    expect(typeof dto.productDetailID).toBe('number');
    expect(typeof dto.productID).toBe('number');
    expect(typeof dto.name).toBe('string');
    expect(typeof dto.url).toBe('string');
    expect(typeof dto.isActive).toBe('boolean');
    expect(dto.createdAt).toBeInstanceOf(Date);
  });

  it('should allow nullable createdAt', () => {
    const dto = new ProductDetailDto();
    dto.productDetailID = faker.number.int({ min: 1, max: 1000 });
    dto.productID = faker.number.int({ min: 1, max: 100 });
    dto.name = faker.commerce.productName();
    dto.url = faker.internet.url();
    dto.isActive = faker.datatype.boolean();
    dto.createdAt = null;

    expect(dto.createdAt).toBeNull();
  });

  it('should create multiple instances independently', () => {
    const dto1 = new ProductDetailDto();
    const dto2 = new ProductDetailDto();

    dto1.productDetailID = faker.number.int({ min: 1, max: 1000 });
    dto2.productDetailID = faker.number.int({ min: 1, max: 1000 });

    expect(dto1.productDetailID).not.toBe(dto2.productDetailID);
  });
});
