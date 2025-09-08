import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CalculateTaxDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  ShipCountry: string;

  @IsString()
  @IsOptional()
  ShipAddress: string;

  @IsString()
  @IsOptional()
  ShipCity: string;

  @IsString()
  @IsOptional()
  ShipPostalCode: string;
}

export class CalculateUsTaxDto extends CalculateTaxDto {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toLowerCase() : value,
  )
  ShipState: string;
}
