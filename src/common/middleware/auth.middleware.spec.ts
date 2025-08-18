import { AuthMiddleware } from './auth.middleware';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

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
    mockReq.path = '/protected';
    mockReq.cookies = { user: JSON.stringify({ id: 1, token: 'wrong', active: true }) };
    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);

    mockReq.cookies = { user: JSON.stringify({ id: 1, token: 'verifiedUser', active: false }) };
    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if DB user not found or inactive', async () => {
    mockReq.path = '/protected';
    mockReq.cookies = { user: JSON.stringify({ id: 1, token: 'verifiedUser', active: true }) };
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);

    (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, active: false });
    await expect(middleware.use(mockReq as any, mockRes as any, mockNext))
      .rejects
      .toThrow(UnauthorizedException);
  });

  it('should call next() if authentication passes', async () => {
    mockReq.path = '/protected';
    mockReq.cookies = { user: JSON.stringify({ id: 1, token: 'verifiedUser', active: true }) };
    (prismaService.user.findUnique as jest.Mock).mockResolvedValue({ id: 1, active: true });

    await middleware.use(mockReq as any, mockRes as any, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(mockReq.user).toEqual({ id: 1, active: true });
  });
});