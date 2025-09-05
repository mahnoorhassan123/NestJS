import { faker } from '@faker-js/faker';
import { OptionCategoriesMapper } from '../mappers/option-categories.mapper';
import { OptionCategoriesEntity } from '../entities/option-categories.entity';
import { OptionCategories as PrismaOptionCategories } from '@prisma/client';

describe('OptionCategoriesMapper', () => {
  let mockPrismaOptionCategories: PrismaOptionCategories;
  let mockOptionCategoriesEntity: OptionCategoriesEntity;

  beforeEach(() => {
  mockPrismaOptionCategories = {
    id: faker.number.int(),
    headingGroup: faker.lorem.word(),
    optionCategoriesDesc: faker.lorem.sentence(),
    isRequired: faker.datatype.boolean(),
    displayType: faker.lorem.word(),
    arrangeOptionCategoriesBy: faker.number.int(),
    lastModified: faker.date.recent(),
    lastModBy: faker.number.int(),
    hideOptionCategoriesDesc: faker.datatype.boolean(),
    includeInSearchRefinement: faker.datatype.boolean(),
    aboutOptionCategories: faker.lorem.sentence(),
    useGoogleSize: faker.datatype.boolean(),
    useGoogleColor: faker.datatype.boolean(),
    useGoogleMaterial: faker.datatype.boolean(),
    useGooglePattern: faker.datatype.boolean(),
    index: faker.number.int({ min: 0, max: 10 }),
    createdAt: faker.date.past(),
    createdBy: faker.number.int(),
  };

  mockOptionCategoriesEntity = { ...mockPrismaOptionCategories };
});


  describe('toDomain', () => {
    it('should map Prisma.OptionCategories to OptionCategoriesEntity correctly', () => {
      const result = OptionCategoriesMapper.toDomain(mockPrismaOptionCategories);

      expect(result).toEqual(mockOptionCategoriesEntity);
    });
  });

  describe('toPersistence', () => {
    it('should map OptionCategoriesEntity to Prisma.OptionCategoriesCreateInput correctly', () => {
      const result = OptionCategoriesMapper.toPersistence(mockOptionCategoriesEntity);

      expect(result).toEqual({
        headingGroup: mockOptionCategoriesEntity.headingGroup,
        optionCategoriesDesc: mockOptionCategoriesEntity.optionCategoriesDesc,
        isRequired: mockOptionCategoriesEntity.isRequired,
        displayType: mockOptionCategoriesEntity.displayType,
        arrangeOptionCategoriesBy: mockOptionCategoriesEntity.arrangeOptionCategoriesBy,
        lastModified: mockOptionCategoriesEntity.lastModified,
        lastModBy: mockOptionCategoriesEntity.lastModBy,
        hideOptionCategoriesDesc: mockOptionCategoriesEntity.hideOptionCategoriesDesc,
        includeInSearchRefinement: mockOptionCategoriesEntity.includeInSearchRefinement,
        aboutOptionCategories: mockOptionCategoriesEntity.aboutOptionCategories,
        useGoogleSize: mockOptionCategoriesEntity.useGoogleSize,
        useGoogleColor: mockOptionCategoriesEntity.useGoogleColor,
        useGoogleMaterial: mockOptionCategoriesEntity.useGoogleMaterial,
        useGooglePattern: mockOptionCategoriesEntity.useGooglePattern,
        index: mockOptionCategoriesEntity.index,
        createdAt: mockOptionCategoriesEntity.createdAt,
        createdBy: mockOptionCategoriesEntity.createdBy,
      });
    });
  });
});
