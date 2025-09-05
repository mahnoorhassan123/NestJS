export class OptionCategoriesEntity {
  id: number;
  headingGroup?: string | null;
  optionCategoriesDesc: string;
  isRequired: boolean;
  displayType?: string | null;
  arrangeOptionCategoriesBy: number;
  lastModified?: Date | null;
  lastModBy: number;
  hideOptionCategoriesDesc: boolean;
  includeInSearchRefinement: boolean;
  aboutOptionCategories?: string | null;
  useGoogleSize: boolean;
  useGoogleColor: boolean;
  useGoogleMaterial: boolean;
  useGooglePattern: boolean;
  index?: number | null;
  createdAt?: Date | null;
  createdBy?: number | null;
}