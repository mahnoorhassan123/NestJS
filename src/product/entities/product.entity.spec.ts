import { faker } from '@faker-js/faker';
import { ProductEntity } from '../entities/product.entity';
import { ProductDetailEntity } from '../entities/product-detail.entity';

describe('ProductEntity', () => {
  const createProductDetail = (): ProductDetailEntity => {
    const detail = new ProductDetailEntity();
    detail.productDetailId = faker.number.int({ min: 1, max: 1000 });
    detail.productId = faker.number.int({ min: 1, max: 1000 });
    detail.name = faker.commerce.productName();
    detail.url = faker.internet.url();
    detail.isActive = faker.datatype.boolean();
    detail.createdAt = faker.datatype.boolean() ? faker.date.recent() : null;
    return detail;
  };

  const createProduct = (): ProductEntity => {
    const product = new ProductEntity();
    product.productId = faker.number.int({ min: 1, max: 1000 });
    product.productCode = faker.string.alphanumeric(10);
    product.productName = faker.commerce.productName();
    product.productDescriptionShort = faker.commerce.productDescription();
    product.productDescription = faker.commerce.productDescription();
    product.productNameShort = faker.commerce.productName();
    product.productPrice = faker.number.float({ min: 1, max: 1000 });
    product.productPriceYuan = faker.number.float({ min: 1, max: 1000 });
    product.productPriceYen = faker.number.float({ min: 1, max: 1000 });
    product.productPriceEuro = faker.number.float({ min: 1, max: 1000 });
    product.productPricePound = faker.number.float({ min: 1, max: 1000 });
    product.productPriceWon = faker.number.float({ min: 1, max: 1000 });
    product.productPriceInr = faker.number.float({ min: 1, max: 1000 });
    product.discount = faker.number.float({ min: 0, max: 100 });
    product.priorityIndex = faker.number.int({ min: 1, max: 10 });
    product.hideWhenOutOfStock = faker.datatype.boolean();
    product.isActive = faker.datatype.boolean();
    product.isDeleted = faker.datatype.boolean();
    product.isFeatured = faker.datatype.boolean();
    product.isSerialAble = faker.datatype.boolean();
    product.isFreeProduct = faker.datatype.boolean();
    product.backlogPriority = faker.number.int({ min: 1, max: 10 });
    product.backlogShow = faker.datatype.boolean();
    product.holdForApproval = faker.datatype.boolean();
    product.accessory = faker.datatype.boolean();
    product.maintenance = faker.datatype.boolean();
    product.upgrade = faker.datatype.boolean();
    product.resale = faker.datatype.boolean();
    product.storeCategory = faker.number.int({ min: 1, max: 10 });
    product.details = Array.from({ length: 3 }, () => createProductDetail());
    return product;
  };

  it('should create a ProductEntity with correct properties', () => {
    const product = createProduct();

    expect(typeof product.productId).toBe('number');
    expect(typeof product.productCode).toBe('string');
    expect(typeof product.productName).toBe('string');
    expect(typeof product.productPrice).toBe('number');
    expect(Array.isArray(product.details)).toBe(true);
    product.details?.forEach(detail => {
      expect(typeof detail.productDetailId).toBe('number');
      expect(typeof detail.name).toBe('string');
    });
  });

  it('should allow multiple independent ProductEntity instances', () => {
    const product1 = createProduct();
    const product2 = createProduct();

    expect(product1).not.toEqual(product2);
  });

  it('should handle array of ProductEntity', () => {
    const products: ProductEntity[] = Array.from({ length: 5 }, () => createProduct());
    expect(products).toHaveLength(5);
    products.forEach(product => {
      expect(typeof product.productId).toBe('number');
      expect(Array.isArray(product.details)).toBe(true);
    });
  });
});
