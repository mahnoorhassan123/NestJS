import { AuthGuard } from '../guards/auth.guard';
import { UserService } from '../../user/services/user.service';
import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { faker } from '@faker-js/faker';

const userFactory = (overrides = {}) => ({
  id: faker.number.int(),
  userType: 'admin',
  active: true,
  ...overrides,
});

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockUserService: Partial<UserService>;

  const createMockContext = (cookieHeader?: string) => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: cookieHeader ? { cookie: cookieHeader } : {},
        }),
      }),
    } as unknown as ExecutionContext;
  };

  beforeEach(() => {
    mockUserService = {
      getUserById: jest.fn(),
    };

    guard = new AuthGuard(mockUserService as UserService);
  });

  it('should throw Unauthorized if no cookies', async () => {
    await expect(guard.canActivate(createMockContext())).rejects.toThrow(UnauthorizedException);
  });

  it('should throw Unauthorized if user cookie not found', async () => {
    const ctx = createMockContext('someOtherCookie=abc;');
    await expect(guard.canActivate(ctx)).rejects.toThrow('User cookie not found');
  });

  it('should throw Unauthorized if cookie is invalid JSON', async () => {
    const ctx = createMockContext('user=invalidJson;');
    await expect(guard.canActivate(ctx)).rejects.toThrow('Invalid user cookie');
  });

  it('should throw Unauthorized if token is invalid or user inactive', async () => {
    const badUser = { token: 'wrongToken', active: true };
    const ctx = createMockContext(`user=${JSON.stringify(badUser)};`);
    await expect(guard.canActivate(ctx)).rejects.toThrow('Invalid or inactive user');
  });

  it('should throw Unauthorized if user not found in DB', async () => {
    const userData = { id: 1, token: 'verifiedUser', active: true };
    (mockUserService.getUserById as jest.Mock).mockResolvedValue(null);
    const ctx = createMockContext(`user=${JSON.stringify(userData)};`);
    await expect(guard.canActivate(ctx)).rejects.toThrow('User not found or inactive');
  });

  it('should allow access if user is active admin or user', async () => {
    const dbUser = userFactory({ userType: 'admin', active: true });
    (mockUserService.getUserById as jest.Mock).mockResolvedValue(dbUser);

    const userData = { id: dbUser.id, token: 'verifiedUser', active: true };
    const ctx = createMockContext(`user=${JSON.stringify(userData)};`);
    const result = await guard.canActivate(ctx);

    expect(result).toBe(true);
  });

  it('should throw Forbidden for external user', async () => {
    const dbUser = userFactory({ userType: 'external', active: true });
    (mockUserService.getUserById as jest.Mock).mockResolvedValue(dbUser);

    const userData = { id: dbUser.id, token: 'verifiedUser', active: true };
    const ctx = createMockContext(`user=${JSON.stringify(userData)};`);

    await expect(guard.canActivate(ctx)).rejects.toThrow(ForbiddenException);
  });

  it('should attach user to request object', async () => {
    const dbUser = userFactory({ userType: 'user', active: true });
    (mockUserService.getUserById as jest.Mock).mockResolvedValue(dbUser);

    const userData = { id: dbUser.id, token: 'verifiedUser', active: true };
    const req: any = { headers: { cookie: `user=${JSON.stringify(userData)};` } };
    const ctx: any = { switchToHttp: () => ({ getRequest: () => req }) };

    const result = await guard.canActivate(ctx as ExecutionContext);
    expect(result).toBe(true);
    expect(req.user).toEqual(dbUser);
  });
});
