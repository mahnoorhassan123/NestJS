import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  MinLength,
  IsNotEmpty,
  Matches,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum userType {
  USER = 'user',
  ADMIN = 'admin',
  EXTERNAL = 'external',
}

export class CreateUserDto {
  @ApiPropertyOptional({ description: 'User ID (auto-generated)' })
  @IsOptional()
  @IsInt()
  id?: number;

  @ApiPropertyOptional({ description: 'First name of the user' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({ description: 'Last name of the user' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    description: 'Email address',
    example: 'example@email.com',
  })
  @IsNotEmpty({ message: 'Email is empty' })
  @IsEmail({}, { message: 'Email must be in valid format' })
  email: string;

  @ApiProperty({
    description: 'Password with minimum length of 6 characters',
    example: 'Passw0rd!',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'User type',
    enum: userType,
    example: userType.ADMIN,
  })
  @IsEnum(userType, { message: 'usertype must be admin, user, or external' })
  userType: userType;

  @ApiPropertyOptional({ description: 'Order export columns' })
  @IsOptional()
  @IsString()
  orderExportColumns?: string;

  @ApiPropertyOptional({ description: 'Last password update date' })
  @IsOptional()
  @Type(() => Date)
  lastPasUpdate?: Date;

  @ApiPropertyOptional({
    description: 'Whether the user is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the user is blocked',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @ApiPropertyOptional({
    description: 'Whether a block mail was sent',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  blockMailSent?: boolean;

  @ApiPropertyOptional({ description: 'Authentication token' })
  @IsOptional()
  @IsString()
  token?: string;

  @ApiPropertyOptional({ description: 'Google account ID' })
  @IsOptional()
  @IsString()
  googleId?: string;

  @ApiPropertyOptional({ description: 'Profile picture URL' })
  @IsOptional()
  @IsString()
  profilePicture?: string;

  @ApiPropertyOptional({ description: 'Google access token' })
  @IsOptional()
  @IsString()
  googleAccessToken?: string;
}

export class SetPasswordDto {
  @ApiProperty({ description: 'Reset token' })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'New password (min 6 chars)',
    example: 'NewPass123',
  })
  @IsString()
  @MinLength(6)
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty({ description: 'User email to reset password' })
  @IsEmail()
  email: string;
}

export class LoginAuthDto {
  @ApiProperty({ description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'Pass1234',
  })
  @IsString()
  @MinLength(6)
  password: string;
}
