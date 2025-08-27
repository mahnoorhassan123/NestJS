import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  isNumber,
  isNotEmpty,
  IsDate,
} from 'class-validator';
import { CreateUserDto } from 'src/user/dtos/user.dto';

export class CreateEndUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  billingAddress1: string;

  @IsString()
  @IsOptional()
  billingAddress2?: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  country: string;

  @IsBoolean()
  @IsNotEmpty()
  external: boolean;

  @IsBoolean()
  @IsNotEmpty()
  hide: boolean;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  @IsNotEmpty()
  createdBy:number;
 
}


export class UpdateEndUserDto extends CreateEndUserDto{
  @IsString()
  @IsNotEmpty()
  id:string;

  @IsNumber()
  @IsNotEmpty()
  modifiedBy:number;

  @IsString()
  @IsNotEmpty()
  createdAt:string;


  @IsString()
  @IsNotEmpty()
  updatedAt:string
}
