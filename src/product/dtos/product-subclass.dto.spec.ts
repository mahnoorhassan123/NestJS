import { faker } from '@faker-js/faker';
import { ProductSubClassDto } from '../dtos/product-subclass.dto';

describe('ProductSubClassDto', () => {
  it('should create a ProductSubClassDto with correct types', () => {
    const dto = new ProductSubClassDto();
    dto.id = faker.number.int({ min: 1, max: 1000 });
    dto.name = faker.commerce.department();

    expect(typeof dto.id).toBe('number');
    expect(typeof dto.name).toBe('string');
  });

  it('should create multiple independent instances', () => {
    const dto1 = new ProductSubClassDto();
    dto1.id = faker.number.int({ min: 1, max: 1000 });
    dto1.name = faker.commerce.department();

    const dto2 = new ProductSubClassDto();
    dto2.id = faker.number.int({ min: 1, max: 1000 });
    dto2.name = faker.commerce.department();

    expect(dto1.id).not.toBe(dto2.id);
    expect(dto1.name).not.toBe(dto2.name);
  });

  it('should handle array of ProductSubClassDto', () => {
    const dtos: ProductSubClassDto[] = Array.from({ length: 5 }, () => {
      const dto = new ProductSubClassDto();
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
