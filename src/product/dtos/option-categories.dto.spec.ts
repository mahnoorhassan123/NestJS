import { faker } from '@faker-js/faker';
import { OptionCategoriesDto, CreateOptionCategoriesDto, UpdateOptionCategoriesDto } from '../dtos/option-categories.dto';

describe('OptionCategories DTOs', () => {

  it('should create a valid OptionCategoriesDto', () => {
    const dto = new OptionCategoriesDto();
    dto.id = faker.number.int({ min: 1, max: 1000 });
    dto.headingGroup = faker.word.words(2);
    dto.optionCategoriesDesc = faker.lorem.sentence();
    dto.isRequired = faker.datatype.boolean();
    dto.displayType = faker.word.words(1);
    dto.arrangeOptionCategoriesBy = faker.number.int({ min: 1, max: 10 });
    dto.lastModified = faker.date.recent();
    dto.lastModBy = faker.number.int({ min: 1, max: 1000 });
    dto.hideOptionCategoriesDesc = faker.datatype.boolean();
    dto.includeInSearchRefinement = faker.datatype.boolean();
    dto.aboutOptionCategories = faker.lorem.sentence();
    dto.useGoogleSize = faker.datatype.boolean();
    dto.useGoogleColor = faker.datatype.boolean();
    dto.useGoogleMaterial = faker.datatype.boolean();
    dto.useGooglePattern = faker.datatype.boolean();
    dto.index = faker.number.int({ min: 1, max: 100 });
    dto.createdAt = faker.date.past();
    dto.createdBy = faker.number.int({ min: 1, max: 1000 });

    expect(typeof dto.id).toBe('number');
    expect(typeof dto.optionCategoriesDesc).toBe('string');
    expect(typeof dto.isRequired).toBe('boolean');
    expect(dto.lastModified).toBeInstanceOf(Date);
    expect(typeof dto.lastModBy).toBe('number');
  });

  it('should create a valid CreateOptionCategoriesDto', () => {
    const dto = new CreateOptionCategoriesDto();
    dto.headingGroup = faker.word.words(2);
    dto.optionCategoriesDesc = faker.lorem.sentence();
    dto.isRequired = faker.datatype.boolean();
    dto.displayType = faker.word.words(1);
    dto.arrangeOptionCategoriesBy = faker.number.int({ min: 1, max: 10 });
    dto.lastModified = faker.date.recent();
    dto.lastModBy = faker.number.int({ min: 1, max: 1000 });
    dto.hideOptionCategoriesDesc = faker.datatype.boolean();
    dto.includeInSearchRefinement = faker.datatype.boolean();
    dto.aboutOptionCategories = faker.lorem.sentence();
    dto.useGoogleSize = faker.datatype.boolean();
    dto.useGoogleColor = faker.datatype.boolean();
    dto.useGoogleMaterial = faker.datatype.boolean();
    dto.useGooglePattern = faker.datatype.boolean();
    dto.index = faker.number.int({ min: 1, max: 100 });
    dto.createdAt = faker.date.past();
    dto.createdBy = faker.number.int({ min: 1, max: 1000 });

    expect(typeof dto.optionCategoriesDesc).toBe('string');
    expect(typeof dto.isRequired).toBe('boolean');
  });

  it('should create a valid UpdateOptionCategoriesDto', () => {
    const dto = new UpdateOptionCategoriesDto();
    dto.headingGroup = faker.word.words(2);
    dto.optionCategoriesDesc = faker.lorem.sentence();
    dto.isRequired = faker.datatype.boolean();
    dto.displayType = faker.word.words(1);
    dto.arrangeOptionCategoriesBy = faker.number.int({ min: 1, max: 10 });
    dto.lastModified = faker.date.recent();
    dto.lastModBy = faker.number.int({ min: 1, max: 1000 });
    dto.hideOptionCategoriesDesc = faker.datatype.boolean();
    dto.includeInSearchRefinement = faker.datatype.boolean();
    dto.aboutOptionCategories = faker.lorem.sentence();
    dto.useGoogleSize = faker.datatype.boolean();
    dto.useGoogleColor = faker.datatype.boolean();
    dto.useGoogleMaterial = faker.datatype.boolean();
    dto.useGooglePattern = faker.datatype.boolean();
    dto.index = faker.number.int({ min: 1, max: 100 });
    dto.createdAt = faker.date.past();
    dto.createdBy = faker.number.int({ min: 1, max: 1000 });

    expect(typeof dto.optionCategoriesDesc).toBe('string');
    expect(typeof dto.isRequired).toBe('boolean');
    expect(dto.lastModified).toBeInstanceOf(Date);
  });

  it('should handle multiple instances independently', () => {
    const dto1 = new OptionCategoriesDto();
    const dto2 = new OptionCategoriesDto();

    dto1.id = faker.number.int({ min: 1, max: 1000 });
    dto2.id = faker.number.int({ min: 1, max: 1000 });

    expect(dto1.id).not.toBe(dto2.id);
  });

});
