import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const rawCookie = req.cookies?.user;

    if (!rawCookie) {
      throw new UnauthorizedException('Authentication cookie not found');
    }

    let parsedUser: any;
    try {
      parsedUser = JSON.parse(rawCookie);
    } catch {
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

    req['user'] = dbUser;
    next();
  }
}
