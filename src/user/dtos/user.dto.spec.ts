import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import {
  CreateUserDto,
  SetPasswordDto,
  ForgotPasswordDto,
  LoginAuthDto,
  userType,
} from './user.dto';

describe('CreateUserDto', () => {
  it('should validate a valid CreateUserDto', async () => {
    const dto = plainToInstance(CreateUserDto, {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'secret123',
      userType: userType.ADMIN,
      active: true,
    });

    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if email is empty or invalid', async () => {
    let dto = plainToInstance(CreateUserDto, {
      email: '',
      password: 'secret123',
      userType: userType.USER,
    });
    let errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);

    dto = plainToInstance(CreateUserDto, {
      email: 'invalid-email',
      password: 'secret123',
      userType: userType.USER,
    });
    errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('should fail validation if password is too short', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'john@example.com',
      password: '123',
      userType: userType.USER,
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });

  it('should fail validation if userType is invalid', async () => {
    const dto = plainToInstance(CreateUserDto, {
      email: 'john@example.com',
      password: 'secret123',
      userType: 'invalidType',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'userType')).toBe(true);
  });
});

describe('SetPasswordDto', () => {
  it('should validate a valid SetPasswordDto', async () => {
    const dto = plainToInstance(SetPasswordDto, {
      token: 'token123',
      password: 'secret123',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if password is too short', async () => {
    const dto = plainToInstance(SetPasswordDto, {
      token: 'token123',
      password: '123',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });
});

describe('ForgotPasswordDto', () => {
  it('should validate valid email', async () => {
    const dto = plainToInstance(ForgotPasswordDto, { email: 'test@example.com' });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail for invalid email', async () => {
    const dto = plainToInstance(ForgotPasswordDto, { email: 'invalid-email' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });
});

describe('LoginAuthDto', () => {
  it('should validate a valid login dto', async () => {
    const dto = plainToInstance(LoginAuthDto, {
      email: 'user@example.com',
      password: 'password123',
    });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if password is too short', async () => {
    const dto = plainToInstance(LoginAuthDto, {
      email: 'user@example.com',
      password: '123',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });

  it('should fail if email is invalid', async () => {
    const dto = plainToInstance(LoginAuthDto, {
      email: 'bad-email',
      password: 'password123',
    });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });
});
