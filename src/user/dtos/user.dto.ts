import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  MinLength, IsNotEmpty, Matches, IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';

export enum userType {
  USER = 'user',
  ADMIN = 'admin',
  EXTERNAL = 'external',
}

export class CreateUserDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsNotEmpty({ message: 'Email is empty' })
  @IsEmail({}, { message: 'Email must be in valid format' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;


  @IsEnum(userType, { message: 'usertype must be admin, user, or external' })
  userType: userType;

  @IsOptional()
  @IsString()
  orderExportColumns?: string;

  @IsOptional()
  @Type(() => Date)
  lastPasUpdate?: Date;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsOptional()
  @IsBoolean()
  blockMailSent?: boolean;

  @IsOptional()
  @IsString()
  token?: string;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsString()
  googleAccessToken?: string;
}

export class SetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class ForgotPasswordDto {
  @IsEmail()
  email: string;
}

export class LoginAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
