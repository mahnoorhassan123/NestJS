import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsOptional()
  @IsInt()
  id?: number;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

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
