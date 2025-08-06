import { Injectable } from '@nestjs/common';
import { UserMapper } from '../mappers/user.mapper';
import {
  CreateUserDto,
  SetPasswordDto,
  ForgotPasswordDto,
  LoginAuthDto,
} from '../dtos/user.dto';
import * as bcrypt from 'bcryptjs';
import { MailHelper } from '../helpers/mail.helper';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private mailHelper: MailHelper,
  ) { }

  async getUserById(id: number): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? UserMapper.toDomain(user) : null;
  }

  async getAllUsers(): Promise<UserEntity[]> {
    const users = await this.prisma.user.findMany();
    return users.map(UserMapper.toDomain);
  }

  async saveUser(data: CreateUserDto, req: any): Promise<any> {
    const userExists = await this.prisma.user.findUnique({ where: { email: data.email } });

    if (data.id) {
      const updated = await this.prisma.user.update({
        where: { id: data.id },
        data: UserMapper.fromCreateDto(data),
      });
      return UserMapper.toDomain(updated);
    } else if (!userExists) {
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

      await this.mailHelper.sendWelcomeEmail({
      to: created.email,
      firstName: created.firstname ?? '', 
      lastName: created.lastname ?? '',    
      link,
      subject: 'Verify your account',
    });

      return UserMapper.toDomain(created);
    } else {
      return { error: 'User with this email already exists.' };
    }
  }

  // // async saveActivityLog(data: any): Promise<any> {
  // //   return this.prisma.activity_log.create({ data });
  // // }

  // // async getActivityLog(filter: any): Promise<any[]> {
  // //   return this.prisma.activity_log.findMany({ where: filter });
  // // }

  // async setPassword(data: SetPasswordDto): Promise<any> {
  //   const user = await this.prisma.user.findUnique({ where: { token: data.token } });
  //   if (!user) return { status: false, msg: 'Invalid token' };

  //   // const history = await this.prisma.password_history.findMany({
  //   //   where: { userId: user.id },
  //   //   orderBy: { id: 'desc' },
  //   //   take: 4,
  //   // });

  //   // for (const record of history) {
  //   //   const match = await bcrypt.compare(data.password, record.password);
  //   //   if (match) return { status: false, msg: 'Password already used, try a new one' };
  //   // }

  //   const hashedPassword = await bcrypt.hash(data.password, 10);
  //   await this.prisma.user.update({ where: { id: user.id }, data: { password: hashedPassword } });

  //   // await this.prisma.password_history.create({
  //   //   data: {
  //   //     userId: user.id,
  //   //     password: hashedPassword,
  //   //     createdAt: new Date(),
  //   //   },
  //   // });

  //   return { status: true, msg: 'Password updated successfully' };
  // }

  // // async forgotPassword({ email }: ForgotPasswordDto, req: any): Promise<any> {
  // //   const user = await this.prisma.user.findUnique({ where: { email } });
  // //   if (!user) return { status: false, msg: 'Email not found' };

  // //   const token = Math.random().toString(36).substring(2);
  // //   await this.prisma.user.update({ where: { email }, data: { token } });

  // //   const link = `${req.protocol}://${req.get('host')}/auth/${token}`;
  // //   await this.mailHelper.sendResetPasswordEmail({
  // //     to: user.email,
  // //     fname: user.firstname,
  // //     lname: user.lastname,
  // //     link,
  // //     subject: 'Password Reset',
  // //   });

  // //   return { status: true, msg: 'Password reset email sent' };
  // // }

  // async verifyToken(token: string): Promise<{ status: boolean }> {
  //   const user = await this.prisma.user.findUnique({ where: { token } });
  //   return user ? { status: true } : { status: false };
  // }

  // async loginAuth(data: LoginAuthDto, req: any): Promise<any> {
  //   const user = await this.prisma.user.findUnique({ where: { email: data.email } });
  //   if (!user || !user.active) return { error: 'Invalid credentials or inactive user' };

  //   const valid = await bcrypt.compare(data.password, user.password);
  //   if (!valid) return { error: 'Incorrect password' };

  //   const lastUpdate = user.lastPasUpdate ?? new Date();
  //   const now = new Date();
  //   const daysSince = Math.floor((now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));

  //   const is_expire = daysSince > 90;
  //   return {
  //     user: UserMapper.toDomain(user),
  //     is_expire,
  //   };
  // }

  // async googleAuth(userData: any, req: any): Promise<any> {
  //   const user = await this.prisma.user.findUnique({ where: { email: userData.email } });
  //   if (!user) return { success: false, message: 'Google user not found' };

  //   await this.prisma.user.update({
  //     where: { email: user.email },
  //     data: {
  //       googleId: userData.googleId,
  //       googleAccessToken: userData.accessToken,
  //       profilePicture: userData.imageUrl,
  //     },
  //   });

  //   // await this.prisma.activity_log.create({
  //   //   data: {
  //   //     firstname: user.firstname,
  //   //     lastname: user.lastname,
  //   //     email: user.email,
  //   //     userId: user.id,
  //   //     lastModifyOn: new Date(),
  //   //     url: '/login',
  //   //   },
  //   // });

   // return UserMapper.toDomain(user);
 // }
}
