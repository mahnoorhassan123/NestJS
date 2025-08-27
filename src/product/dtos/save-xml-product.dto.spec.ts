import { faker } from '@faker-js/faker';
import { SaveXmlProductDto } from '../dtos/save-xml-product.dto';

describe('SaveXmlProductDto', () => {
  it('should create a SaveXmlProductDto with correct properties', () => {
    const dto = new SaveXmlProductDto();
    dto.path = faker.system.filePath(); 

    expect(typeof dto.path).toBe('string');
    expect(dto.path).toContain('/');
  });

  it('should allow multiple independent instances', () => {
    const dto1 = new SaveXmlProductDto();
    dto1.path = faker.system.filePath();

    const dto2 = new SaveXmlProductDto();
    dto2.path = faker.system.filePath();

    expect(dto1.path).not.toBe(dto2.path);
  });

  it('should handle array of SaveXmlProductDto', () => {
    const dtos: SaveXmlProductDto[] = Array.from({ length: 5 }, () => {
      const dto = new SaveXmlProductDto();
      dto.path = faker.system.filePath();
      return dto;
    });

    expect(dtos).toHaveLength(5);
    dtos.forEach(d => {
      expect(typeof d.path).toBe('string');
      expect(d.path).toContain('/');
    });
  });
});
