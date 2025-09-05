import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import * as cookie from 'cookie';
import { Request } from 'express';
import { UserService } from '../../user/services/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly usersService: UserService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();

    if (!req.headers?.cookie) {
      throw new UnauthorizedException('No cookies found');
    }

    const parsedCookie = cookie.parse(req.headers.cookie);

    if (!parsedCookie.user) {
      throw new UnauthorizedException('User cookie not found');
    }

    let userData: any;
    try {
      userData = JSON.parse(parsedCookie.user);
    } catch (e) {
      throw new UnauthorizedException('Invalid user cookie');
    }

    if (userData.token !== 'verifiedUser' || !userData.active) {
      throw new UnauthorizedException('Invalid or inactive user');
    }

    // Fetch user from DB
    const user = await this.usersService.getUserById(userData.id);

    if (!user || !user.active) {
      throw new UnauthorizedException('User not found or inactive');
    }

    // Role check
    const role = user.userType.toLowerCase();
    if (['admin', 'user'].includes(role)) {
      req['user'] = user; 
      return true;
    } else if (role === 'external') {
      // If external users should be denied
      throw new ForbiddenException('External users cannot login');
    }

    throw new ForbiddenException('Unauthorized role');
  }
}
