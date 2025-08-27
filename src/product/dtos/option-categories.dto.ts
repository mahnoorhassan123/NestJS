import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class OptionCategoriesDto {
  @ApiProperty({ type: Number })
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  headingGroup?: string | null;

  @ApiProperty()
  optionCategoriesDesc: string;

  @ApiProperty({ type: Boolean })
  isRequired: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  displayType?: string | null;

  @ApiProperty({ type: Number })
  arrangeOptionCategoriesBy: number;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  lastModified?: Date | null;

  @ApiProperty({ type: Number })
  lastModBy: number;

  @ApiProperty({ type: Boolean })
  hideOptionCategoriesDesc: boolean;

  @ApiProperty({ type: Boolean })
  includeInSearchRefinement: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  aboutOptionCategories?: string | null;

  @ApiProperty({ type: Boolean })
  useGoogleSize: boolean;

  @ApiProperty({ type: Boolean })
  useGoogleColor: boolean;

  @ApiProperty({ type: Boolean })
  useGoogleMaterial: boolean;

  @ApiProperty({ type: Boolean })
  useGooglePattern: boolean;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  index?: number | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  createdAt?: Date | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  createdBy?: number | null;
}

export class CreateOptionCategoriesDto {
  @ApiPropertyOptional()
  @IsOptional()
  headingGroup?: string | null;

  @ApiProperty()
  optionCategoriesDesc: string;

  @ApiProperty({ type: Boolean })
  isRequired: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  displayType?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  arrangeOptionCategoriesBy?: number;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  lastModified?: Date | null;

  @ApiProperty({ type: Number })
  lastModBy: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  hideOptionCategoriesDesc?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  includeInSearchRefinement?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  aboutOptionCategories?: string | null;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  useGoogleSize?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  useGoogleColor?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  useGoogleMaterial?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  useGooglePattern?: boolean;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  index?: number | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  createdAt?: Date | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  createdBy?: number | null;
}

export class UpdateOptionCategoriesDto {
  @ApiPropertyOptional()
  @IsOptional()
  headingGroup?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  optionCategoriesDesc?: string;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  isRequired?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  displayType?: string | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  arrangeOptionCategoriesBy?: number;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  lastModified?: Date | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  lastModBy?: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  hideOptionCategoriesDesc?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  includeInSearchRefinement?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  aboutOptionCategories?: string | null;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  useGoogleSize?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  useGoogleColor?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  useGoogleMaterial?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  useGooglePattern?: boolean;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  index?: number | null;

  @ApiPropertyOptional({ type: String, format: 'date-time' })
  @IsOptional()
  createdAt?: Date | null;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  createdBy?: number | null;
}
