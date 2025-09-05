import { ProductClassDto } from '../dtos/product-class.dto';
import { faker } from '@faker-js/faker';

describe('ProductClassDto', () => {
  it('should create a ProductClassDto with correct properties', () => {
    const dto = new ProductClassDto();
    dto.id = faker.number.int({ min: 1, max: 1000 });
    dto.name = faker.commerce.department();

    expect(typeof dto.id).toBe('number');
    expect(typeof dto.name).toBe('string');
  });

  it('should ensure multiple instances have independent values', () => {
    const dto1 = new ProductClassDto();
    dto1.id = faker.number.int({ min: 1, max: 1000 });
    dto1.name = faker.commerce.department();

    const dto2 = new ProductClassDto();
    dto2.id = faker.number.int({ min: 1, max: 1000 });
    dto2.name = faker.commerce.department();

    expect(dto1.id).not.toBe(dto2.id);
    expect(dto1.name).not.toBe(dto2.name);
  });

  it('should handle array of ProductClassDto', () => {
    const dtos: ProductClassDto[] = Array.from({ length: 5 }, () => {
      const dto = new ProductClassDto();
      dto.id = faker.number.int({ min: 1, max: 1000 });
      dto.name = faker.commerce.department();
      return dto;
    });

    expect(dtos).toHaveLength(5);
    dtos.forEach(d => {
      expect(typeof d.id).toBe('number');
      expect(typeof d.name).toBe('string');
    });
  });
});
