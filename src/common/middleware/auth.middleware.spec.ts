import { AuthMiddleware } from './auth.middleware';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { faker } from '@faker-js/faker';
import { createUserEntityFactory } from '../../utils/factories/user.factory';

describe('AuthMiddleware', () => {
  let middleware: AuthMiddleware;
  let prismaService: Pick<PrismaService, 'user'>;
  let mockNext: jest.Mock;
  let mockReq: any;
  let mockRes: any;

  beforeEach(() => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
      } as any,
    };
    middleware = new AuthMiddleware(prismaService as PrismaService);
    mockNext = jest.fn();
    mockRes = {};
    mockReq = {
      path: '',
      method: 'GET',
      url: '',
      cookies: {},
    };
  });

  it('should skip auth for public routes', async () => {
    const publicRoutes = ['/user/save', '/user/login-auth', '/user/google-auth', '/user/list', '/user'];
    for (const route of publicRoutes) {
      mockReq.path = route;
      await middleware.use(mockReq as any, mockRes as any, mockNext);
      expect(mockNext).toHaveBeenCalled();
    }
  });

  it('should throw UnauthorizedException if no cookie found', async () => {
    mockReq.path = '/protected';
    mockReq.cookies = {};
    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if cookie is invalid JSON', async () => {
    mockReq.path = '/protected';
    mockReq.cookies = { user: 'not-json' };
    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if token is invalid or inactive', async () => {
    const userId = faker.number.int({ min: 1, max: 1000 });

    mockReq.path = '/protected';
    mockReq.cookies = { user: JSON.stringify({ id: userId, token: faker.string.uuid(), active: true }) };
    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);

    mockReq.cookies = { user: JSON.stringify({ id: userId, token: faker.string.uuid(), active: false }) };
    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if DB user not found or inactive', async () => {
    const userId = faker.number.int({ min: 1, max: 1000 });
    const token = faker.string.uuid();

    mockReq.path = '/protected';
    mockReq.cookies = { user: JSON.stringify({ id: userId, token, active: true }) };
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);

    (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: userId, active: false });
    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should call next() if authentication passes', async () => {
  const dbUser = createUserEntityFactory({ active: true });
  const cookieUser = { id: dbUser.id, token: 'verifiedUser', active: true }; 

  mockReq.path = '/protected';
  mockReq.cookies = { user: JSON.stringify(cookieUser) };
  (prismaService.user.findUnique as jest.Mock).mockResolvedValue(dbUser);

  await middleware.use(mockReq as any, mockRes as any, mockNext);

  expect(mockNext).toHaveBeenCalled();
  expect(mockReq.user).toEqual(dbUser);
});
})
