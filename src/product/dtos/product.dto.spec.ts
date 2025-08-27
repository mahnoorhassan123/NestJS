import { faker } from '@faker-js/faker';
import { ProductDto } from '../dtos/product.dto';

describe('ProductDto', () => {
  it('should create a ProductDto with correct types', () => {
    const dto = new ProductDto();

    dto.productId = faker.number.int({ min: 1, max: 10000 });
    dto.productCode = faker.string.alphanumeric(10);
    dto.productName = faker.commerce.productName();
    dto.productDescriptionShort = faker.commerce.productDescription();
    dto.productDescription = faker.commerce.productDescription();
    dto.productPrice = faker.number.float({ min: 1, max: 1000 });
    dto.productPriceYuan = faker.number.float({ min: 1, max: 1000 });
    dto.productPriceYen = faker.number.float({ min: 1, max: 1000 });
    dto.productPriceEuro = faker.number.float({ min: 1, max: 1000 });
    dto.productPricePound = faker.number.float({ min: 1, max: 1000 });
    dto.productPriceWon = faker.number.float({ min: 1, max: 1000 });
    dto.productPriceInr = faker.number.float({ min: 1, max: 1000 });
    dto.discount = faker.number.float({ min: 0, max: 100 });
    dto.priorityIndex = faker.number.int({ min: 1, max: 10 });
    dto.hideWhenOutOfStock = faker.datatype.boolean();
    dto.isActive = faker.datatype.boolean();
    dto.isDeleted = faker.datatype.boolean();
    dto.isFeatured = faker.datatype.boolean();
    dto.isSerialAble = faker.datatype.boolean();
    dto.isFreeProduct = faker.datatype.boolean();
    dto.backlogPriority = faker.number.int({ min: 1, max: 5 });
    dto.backlogShow = faker.datatype.boolean();
    dto.holdForApproval = faker.datatype.boolean();
    dto.accessory = faker.datatype.boolean();
    dto.maintenance = faker.datatype.boolean();
    dto.upgrade = faker.datatype.boolean();
    dto.resale = faker.datatype.boolean();
    dto.storeCategory = faker.number.int({ min: 1, max: 100 });

    // Test number types
    expect(typeof dto.productId).toBe('number');
    expect(typeof dto.productPrice).toBe('number');
    expect(typeof dto.discount).toBe('number');
    expect(typeof dto.priorityIndex).toBe('number');

    // Test string types
    expect(typeof dto.productCode).toBe('string');
    expect(typeof dto.productName).toBe('string');

    // Test boolean types
    expect(typeof dto.isActive).toBe('boolean');
    expect(typeof dto.isDeleted).toBe('boolean');
    expect(typeof dto.isSerialAble).toBe('boolean');
  });

  it('should allow creating multiple independent ProductDto instances', () => {
    const dto1 = new ProductDto();
    dto1.productId = faker.number.int({ min: 1, max: 10000 });
    dto1.productName = faker.commerce.productName();

    const dto2 = new ProductDto();
    dto2.productId = faker.number.int({ min: 1, max: 10000 });
    dto2.productName = faker.commerce.productName();

    expect(dto1.productId).not.toBe(dto2.productId);
    expect(dto1.productName).not.toBe(dto2.productName);
  });

  it('should handle an array of ProductDto', () => {
    const dtos: ProductDto[] = Array.from({ length: 5 }, () => {
      const dto = new ProductDto();
      dto.productId = faker.number.int({ min: 1, max: 10000 });
      dto.productName = faker.commerce.productName();
      dto.productPrice = faker.number.float({ min: 1, max: 1000 });
      dto.isActive = faker.datatype.boolean();
      return dto;
    });

    expect(dtos).toHaveLength(5);
    dtos.forEach(d => {
      expect(typeof d.productId).toBe('number');
      expect(typeof d.productName).toBe('string');
      expect(typeof d.productPrice).toBe('number');
      expect(typeof d.isActive).toBe('boolean');
    });
  });
});
