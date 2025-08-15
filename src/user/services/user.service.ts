import { Injectable, Logger } from '@nestjs/common';
import { UserMapper } from '../mappers/user.mapper';
import { CreateUserDto, SetPasswordDto, ForgotPasswordDto, LoginAuthDto } from '../dtos/user.dto';
import * as bcrypt from 'bcryptjs';
import { MailHelper } from '../helpers/mail.helper';
import { PrismaService } from '../../prisma/prisma.service';
import { ActivityType } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private prisma: PrismaService,
    private mailHelper: MailHelper,
  ) {}

  async getUserById(id: number): Promise<UserEntity | null> {
    this.logger.debug(`Fetching user by ID: ${id}`);
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    this.logger.log('Fetching all users from database');
    const users = await this.prisma.user.findMany();
    this.logger.debug(`Fetched ${users.length} users`);
    return users.map(UserMapper.toDomain);
  }

  async saveUser(data: CreateUserDto, req: any): Promise<any> {
    try {
      const userExists = await this.prisma.user.findUnique({ where: { email: data.email } });

      if (data.id) {
        this.logger.log(`Updating user with ID: ${data.id}`);
        const updated = await this.prisma.user.update({
          where: { id: data.id },
          data: UserMapper.fromCreateDto(data),
        });
        return UserMapper.toDomain(updated);
      } 

      if (!userExists) {
        this.logger.log(`Creating new user with email: ${data.email}`);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const token = Math.random().toString(36).substring(2);

        const created = await this.prisma.user.create({
          data: {
            ...UserMapper.fromCreateDto(data),
            password: hashedPassword,
            token,
          },
        });

        const link = `${req.protocol}://${req.get('host')}/auth/${token}`;
        try {
          await this.mailHelper.sendWelcomeEmail({
            to: created.email,
            firstName: created.firstname ?? '',
            lastName: created.lastname ?? '',
            link,
            subject: 'Verify your account',
          });
        } catch (mailErr) {
          this.logger.error(`Failed to send welcome email to ${created.email}`, mailErr.stack);
        }

        return UserMapper.toDomain(created);
      } 

      this.logger.warn(`User with email ${data.email} already exists`);
      return { error: 'User with this email already exists.' };

    } catch (err) {
      this.logger.error('saveUser failed', err.stack);
      throw err;
    }
  }

  async saveActivityLog(data: any): Promise<any> {
    this.logger.debug('Saving activity log', JSON.stringify(data));
    return this.prisma.activityLog.create({ data });
  }

  async getActivityLog(filter: any): Promise<any[]> {
    this.logger.debug(`Fetching activity logs with filter: ${JSON.stringify(filter)}`);
    return this.prisma.activityLog.findMany({ where: filter });
  }

  async setPassword(data: SetPasswordDto): Promise<any> {
    this.logger.log(`Setting password using token: ${data.token}`);
    const user = await this.prisma.user.findFirst({ where: { token: data.token } });
    if (!user) return { status: false, msg: 'Invalid token' };

    const history = await this.prisma.passwordHistory.findMany({
      where: { userId: user.id },
      orderBy: { id: 'desc' },
      take: 4,
    });

    for (const record of history) {
      if (!record.password) continue;
      const match = await bcrypt.compare(data.password, record.password);
      if (match) {
        this.logger.warn(`User ${user.id} tried to reuse an old password`);
        return { status: false, msg: 'Password already used, try a new one' };
      }
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    await this.prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

    await this.prisma.passwordHistory.create({
      data: {
        userId: user.id,
        password: hashedPassword,
        createdAt: new Date(),
      },
    });

    return { status: true, msg: 'Password updated successfully' };
  }

  async forgotPassword({ email }: ForgotPasswordDto, req: any): Promise<any> {
    this.logger.log(`Password reset requested for email: ${email}`);
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      this.logger.warn(`Password reset failed: email ${email} not found`);
      return { status: false, msg: 'Email not found' };
    }

    const token = Math.random().toString(36).substring(2);
    await this.prisma.user.update({ where: { email }, data: { token } });

    const link = `${req.protocol}://${req.get('host')}/auth/${token}`;
    await this.mailHelper.sendResetPasswordEmail({
      to: user.email,
      firstName: user.firstname ?? '',
      lastName: user.lastname ?? '',
      link,
      subject: 'Password Reset',
    });
    return { status: true, msg: 'Password reset email sent' };
  }

  async verifyToken(token: string): Promise<{ status: boolean }> {
    this.logger.debug(`Verifying token: ${token}`);
    const user = await this.prisma.user.findFirst({ where: { token } });
    return user ? { status: true } : { status: false };
  }

  async loginAuth(data: LoginAuthDto, req: any): Promise<any> {
    this.logger.log(`Login attempt for email: ${data.email}`);
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user || !user.active) {
      this.logger.warn(`Login failed for ${data.email}`);
      return { error: 'Invalid credentials or inactive user' };
    }

    if (!user.password) return { error: 'Password not set for this user' };
    const valid = await bcrypt.compare(data.password, user.password);
    if (!valid) {
      this.logger.warn(`Incorrect password attempt for ${data.email}`);
      return { error: 'Incorrect password' };
    }

    const lastUpdate = user.lastPasUpdate ?? new Date();
    const now = new Date();
    const daysSince = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

    const is_expire = daysSince > 90;
    return {
      user: UserMapper.toDomain(user),
      is_expire,
    };
  }

  async googleAuth(userData: any, req: any): Promise<any> {
    this.logger.log(`Google auth for email: ${userData.email}`);
    const user = await this.prisma.user.findUnique({ where: { email: userData.email } });
    if (!user) {
      this.logger.warn(`Google user ${userData.email} not found`);
      return { success: false, message: 'Google user not found' };
    }

    await this.prisma.user.update({
      where: { email: user.email },
      data: {
        googleId: userData.googleId,
        googleAcessToken: userData.accessToken,
        profilePicture: userData.imageUrl,
      },
    });

    await this.prisma.activityLog.create({
      data: {
        firstname: user.firstname ?? '',
        lastname: user.lastname ?? '',
        email: user.email,
        userId: user.id,
        lastModifyOn: new Date(),
        url: '/login',
        type: ActivityType.BlueSky,
      },
    });

    return UserMapper.toDomain(user);
  }
}
