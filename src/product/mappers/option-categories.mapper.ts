import { OptionCategories as PrismaOptionCategories, Prisma } from '@prisma/client';
import { OptionCategoriesEntity } from '../entities/option-categories.entity';

export class OptionCategoriesMapper {
  static toDomain(prismaOptionCategories: PrismaOptionCategories): OptionCategoriesEntity {
    return {
      id: prismaOptionCategories.id,
      headingGroup: prismaOptionCategories.headingGroup,
      optionCategoriesDesc: prismaOptionCategories.optionCategoriesDesc,
      isRequired: prismaOptionCategories.isRequired,
      displayType: prismaOptionCategories.displayType,
      arrangeOptionCategoriesBy: prismaOptionCategories.arrangeOptionCategoriesBy,
      lastModified: prismaOptionCategories.lastModified,
      lastModBy: prismaOptionCategories.lastModBy,
      hideOptionCategoriesDesc: prismaOptionCategories.hideOptionCategoriesDesc,
      includeInSearchRefinement: prismaOptionCategories.includeInSearchRefinement,
      aboutOptionCategories: prismaOptionCategories.aboutOptionCategories,
      useGoogleSize: prismaOptionCategories.useGoogleSize,
      useGoogleColor: prismaOptionCategories.useGoogleColor,
      useGoogleMaterial: prismaOptionCategories.useGoogleMaterial,
      useGooglePattern: prismaOptionCategories.useGooglePattern,
      index: prismaOptionCategories.index,
      createdAt: prismaOptionCategories.createdAt,
      createdBy: prismaOptionCategories.createdBy,
    };
  }

  static toPersistence(optionCategories: OptionCategoriesEntity): Prisma.OptionCategoriesCreateInput {
    return {
      headingGroup: optionCategories.headingGroup,
      optionCategoriesDesc: optionCategories.optionCategoriesDesc,
      isRequired: optionCategories.isRequired,
      displayType: optionCategories.displayType,
      arrangeOptionCategoriesBy: optionCategories.arrangeOptionCategoriesBy,
      lastModified: optionCategories.lastModified,
      lastModBy: optionCategories.lastModBy,
      hideOptionCategoriesDesc: optionCategories.hideOptionCategoriesDesc,
      includeInSearchRefinement: optionCategories.includeInSearchRefinement,
      aboutOptionCategories: optionCategories.aboutOptionCategories,
      useGoogleSize: optionCategories.useGoogleSize,
      useGoogleColor: optionCategories.useGoogleColor,
      useGoogleMaterial: optionCategories.useGoogleMaterial,
      useGooglePattern: optionCategories.useGooglePattern,
      index: optionCategories.index,
      createdAt: optionCategories.createdAt,
      createdBy: optionCategories.createdBy,
    };
  }
}