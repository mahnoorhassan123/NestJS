import { validate } from 'class-validator';
import {
  createUserDtoFactory,
  createSetPasswordDto,
  createForgotPasswordDto,
  createLoginAuthDto,
} from '../../utils/factories/user.factory';
import { userType } from './user.dto';

describe('CreateUserDto', () => {
  it('should validate a valid CreateUserDto', async () => {
    const dto = createUserDtoFactory({ userType: userType.ADMIN });
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if email is empty or invalid', async () => {
    let dto = createUserDtoFactory({ email: '' });
    let errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);

    dto = createUserDtoFactory({ email: 'invalid-email' });
    errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });

  it('should fail validation if password is too short', async () => {
    const dto = createUserDtoFactory({ password: '123' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });

  it('should fail validation if userType is invalid', async () => {
    const dto = createUserDtoFactory({ userType: 'invalidType' as any });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'userType')).toBe(true);
  });
});

describe('SetPasswordDto', () => {
  it('should validate a valid SetPasswordDto', async () => {
    const dto = createSetPasswordDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if password is too short', async () => {
    const dto = createSetPasswordDto({ password: '123' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });
});

describe('ForgotPasswordDto', () => {
  it('should validate valid email', async () => {
    const dto = createForgotPasswordDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail for invalid email', async () => {
    const dto = createForgotPasswordDto({ email: 'invalid-email' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });
});

describe('LoginAuthDto', () => {
  it('should validate a valid login dto', async () => {
    const dto = createLoginAuthDto();
    const errors = await validate(dto);
    expect(errors.length).toBe(0);
  });

  it('should fail if password is too short', async () => {
    const dto = createLoginAuthDto({ password: '123' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'password')).toBe(true);
  });

  it('should fail if email is invalid', async () => {
    const dto = createLoginAuthDto({ email: 'bad-email' });
    const errors = await validate(dto);
    expect(errors.some(e => e.property === 'email')).toBe(true);
  });
});
