import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    console.log('Incoming request in AuthMiddleware:', req.method, req.url);

    if (
    req.path === '/user/save' ||
    req.path === '/user/login-auth' ||
    req.path === '/user/google-auth' ||
    req.path === '/user/list' ||
    req.path === '/user'
  ) {
    return next();
  }

    const rawCookie = req.cookies?.user;
    if (!rawCookie) {
      throw new UnauthorizedException('Authentication cookie not found');
    }

    let parsedUser: any;
    try {
      parsedUser = JSON.parse(rawCookie);
      console.log('Parsed cookie:', parsedUser);
    } catch (err) {
      console.error('Failed to parse cookie:', err);
      throw new UnauthorizedException('Invalid cookie format');
    }

    const { id, token, active } = parsedUser;
    if (!id || token !== 'verifiedUser' || active === false) {
      throw new UnauthorizedException('Unauthorized access');
    }

    const dbUser = await this.prisma.user.findUnique({ where: { id } });

    if (!dbUser || dbUser.active === false) {
      throw new UnauthorizedException('User not found or inactive');
    }

    console.log('User authenticated successfully');
    req['user'] = dbUser;
    next();
  }
}