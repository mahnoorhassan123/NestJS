import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    this.logger.log(`Incoming request: ${req.method} ${req.url}`);

    // Skip authentication for these routes
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
      this.logger.warn('Authentication cookie not found');
      throw new UnauthorizedException('Authentication cookie not found');
    }

    let parsedUser: any;
    try {
      parsedUser = JSON.parse(rawCookie);
      this.logger.debug(`Parsed cookie: ${JSON.stringify(parsedUser)}`);
    } catch (err) {
      this.logger.error('Failed to parse cookie', err.stack);
      throw new UnauthorizedException('Invalid cookie format');
    }

    const { id, token, active } = parsedUser;
    if (!id || token !== 'verifiedUser' || active === false) {
      this.logger.warn('Unauthorized access attempt');
      throw new UnauthorizedException('Unauthorized access');
    }

    const dbUser = await this.prisma.user.findUnique({ where: { id } });
    if (!dbUser || dbUser.active === false) {
      this.logger.warn('User not found or inactive');
      throw new UnauthorizedException('User not found or inactive');
    }

    this.logger.log(`User ${dbUser.id} authenticated successfully`);
    req['user'] = dbUser;
    next();
  }
}
