import { ProductCategoryDto } from '../dtos/product-category.dto';
import { faker } from '@faker-js/faker';

describe('ProductCategoryDto', () => {
  it('should create a ProductCategoryDto with correct properties', () => {
    const dto = new ProductCategoryDto();
    dto.id = faker.number.int({ min: 1, max: 1000 });
    dto.categoryId = faker.number.int({ min: 1, max: 1000 });
    dto.productId = faker.number.int({ min: 1, max: 1000 });
    dto.createdAt = faker.date.recent();
    dto.storeCat = faker.number.int({ min: 1, max: 100 });

    expect(typeof dto.categoryId).toBe('number');
    expect(typeof dto.productId).toBe('number');
    expect(typeof dto.id).toBe('number');
    expect(dto.createdAt).toBeInstanceOf(Date);
    expect(typeof dto.storeCat).toBe('number');
  });

  it('should allow optional properties to be undefined', () => {
    const dto = new ProductCategoryDto();
    dto.categoryId = faker.number.int({ min: 1, max: 1000 });
    dto.productId = faker.number.int({ min: 1, max: 1000 });

    expect(dto.id).toBeUndefined();
    expect(dto.createdAt).toBeUndefined();
    expect(dto.storeCat).toBeUndefined();
  });

  it('should create multiple independent instances', () => {
    const dto1 = new ProductCategoryDto();
    dto1.id = faker.number.int({ min: 1, max: 1000 });
    dto1.categoryId = faker.number.int({ min: 1, max: 1000 });
    dto1.productId = faker.number.int({ min: 1, max: 1000 });

    const dto2 = new ProductCategoryDto();
    dto2.id = faker.number.int({ min: 1, max: 1000 });
    dto2.categoryId = faker.number.int({ min: 1, max: 1000 });
    dto2.productId = faker.number.int({ min: 1, max: 1000 });

    expect(dto1.id).not.toBe(dto2.id);
    expect(dto1.categoryId).not.toBe(dto2.categoryId);
    expect(dto1.productId).not.toBe(dto2.productId);
  });

  it('should handle an array of ProductCategoryDto', () => {
    const dtos: ProductCategoryDto[] = Array.from({ length: 5 }, () => {
      const dto = new ProductCategoryDto();
      dto.id = faker.number.int({ min: 1, max: 1000 });
      dto.categoryId = faker.number.int({ min: 1, max: 1000 });
      dto.productId = faker.number.int({ min: 1, max: 1000 });
      return dto;
    });

    expect(dtos).toHaveLength(5);
    dtos.forEach(d => {
      expect(typeof d.id).toBe('number');
      expect(typeof d.categoryId).toBe('number');
      expect(typeof d.productId).toBe('number');
    });
  });
});
