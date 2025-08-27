import { faker } from '@faker-js/faker';
import { OptionCategoriesEntity } from '../entities/option-categories.entity';

describe('OptionCategoriesEntity', () => {
  const createOptionCategoriesEntity = (): OptionCategoriesEntity => {
    const entity = new OptionCategoriesEntity();
    entity.id = faker.number.int({ min: 1, max: 1000 });
    entity.headingGroup = faker.datatype.boolean() ? faker.commerce.department() : null;
    entity.optionCategoriesDesc = faker.commerce.productDescription();
    entity.isRequired = faker.datatype.boolean();
    entity.displayType = faker.datatype.boolean() ? faker.helpers.arrayElement(['dropdown', 'checkbox', 'radio']) : null;
    entity.arrangeOptionCategoriesBy = faker.number.int({ min: 1, max: 10 });
    entity.lastModified = faker.datatype.boolean() ? faker.date.recent() : null;
    entity.lastModBy = faker.number.int({ min: 1, max: 1000 });
    entity.hideOptionCategoriesDesc = faker.datatype.boolean();
    entity.includeInSearchRefinement = faker.datatype.boolean();
    entity.aboutOptionCategories = faker.datatype.boolean() ? faker.lorem.sentence() : null;
    entity.useGoogleSize = faker.datatype.boolean();
    entity.useGoogleColor = faker.datatype.boolean();
    entity.useGoogleMaterial = faker.datatype.boolean();
    entity.useGooglePattern = faker.datatype.boolean();
    entity.index = faker.datatype.boolean() ? faker.number.int({ min: 1, max: 100 }) : null;
    entity.createdAt = faker.datatype.boolean() ? faker.date.past() : null;
    entity.createdBy = faker.datatype.boolean() ? faker.number.int({ min: 1, max: 1000 }) : null;
    return entity;
  };

  it('should create an OptionCategoriesEntity with correct types', () => {
    const entity = createOptionCategoriesEntity();

    expect(typeof entity.id).toBe('number');
    expect(entity.headingGroup === null || typeof entity.headingGroup === 'string').toBe(true);
    expect(typeof entity.optionCategoriesDesc).toBe('string');
    expect(typeof entity.isRequired).toBe('boolean');
    expect(entity.displayType === null || typeof entity.displayType === 'string').toBe(true);
    expect(typeof entity.arrangeOptionCategoriesBy).toBe('number');
    expect(entity.lastModified === null || entity.lastModified instanceof Date).toBe(true);
    expect(typeof entity.lastModBy).toBe('number');
    expect(typeof entity.hideOptionCategoriesDesc).toBe('boolean');
    expect(typeof entity.includeInSearchRefinement).toBe('boolean');
    expect(entity.aboutOptionCategories === null || typeof entity.aboutOptionCategories === 'string').toBe(true);
    expect(typeof entity.useGoogleSize).toBe('boolean');
    expect(typeof entity.useGoogleColor).toBe('boolean');
    expect(typeof entity.useGoogleMaterial).toBe('boolean');
    expect(typeof entity.useGooglePattern).toBe('boolean');
    expect(entity.index === null || typeof entity.index === 'number').toBe(true);
    expect(entity.createdAt === null || entity.createdAt instanceof Date).toBe(true);
    expect(entity.createdBy === null || typeof entity.createdBy === 'number').toBe(true);
  });

  it('should allow multiple independent instances', () => {
    const entity1 = createOptionCategoriesEntity();
    const entity2 = createOptionCategoriesEntity();
    expect(entity1).not.toEqual(entity2);
  });

  it('should handle an array of OptionCategoriesEntity', () => {
    const entities: OptionCategoriesEntity[] = Array.from({ length: 5 }, () => createOptionCategoriesEntity());
    expect(entities).toHaveLength(5);
    entities.forEach(e => {
      expect(typeof e.id).toBe('number');
      expect(typeof e.optionCategoriesDesc).toBe('string');
      expect(typeof e.isRequired).toBe('boolean');
    });
  });
});
