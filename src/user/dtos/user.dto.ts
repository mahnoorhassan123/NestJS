import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  MinLength, IsNotEmpty, Matches, IsEnum
} from 'class-validator';
import { Type } from 'class-transformer';

export enum UserRole {
  USER = 'User',
  ADMIN = 'Admin',
  EXTERNAL = 'External',
}

export class CreateUserDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsNotEmpty({ message: 'Email is empty' })
  @IsEmail({}, { message: 'Email must be in valid format' })
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsNotEmpty({ message: 'Last Name is empty' })
  @Matches(/^[a-zA-Z ]+$/, { message: 'Special characters not allowed in Last Name' })
  lastname: string;

  @IsNotEmpty({ message: 'Please select a user role' })
  @IsEnum(UserRole, { message: 'Invalid user role selected' })
  userRole: UserRole;

  @IsString()
  userType: 'admin' | 'user' | 'external';

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
