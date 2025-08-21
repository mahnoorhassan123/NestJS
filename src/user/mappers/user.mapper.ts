import { User as PrismaUser, Prisma } from '@prisma/client';
import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/user.dto';

export class UserMapper {
  static toDomain(prismaUser: PrismaUser): UserEntity {
    return {
      id: prismaUser.id,
      firstName: prismaUser.firstname ?? undefined,
      lastName: prismaUser.lastname ?? undefined,
      email: prismaUser.email,
      password: prismaUser.password ?? undefined,
      userType: prismaUser.usertype as 'admin' | 'user' | 'external',
      orderExportColumns: prismaUser.orderExportColumns ?? undefined,
      lastPasUpdate: prismaUser.lastPasUpdate ?? undefined,
      active: prismaUser.active ?? true,
      isBlocked: prismaUser.isBlocked,
      blockMailSent: prismaUser.blockMailSent,
      token: prismaUser.token ?? undefined,
      googleId: prismaUser.googleId ?? undefined,
      profilePicture: prismaUser.profilePicture ?? undefined,
      googleAccessToken: prismaUser.googleAcessToken ?? undefined, 
      createdAt: prismaUser.CreatedAt ?? undefined,
      modifiedBy: prismaUser.ModifiedBy ?? undefined,
      createdBy: prismaUser.CreatedBy ?? undefined,
      modifiedAt: prismaUser.ModifiedAt ?? undefined,
    };
  }

  static toPersistence(user: UserEntity): Prisma.UserCreateInput {
    return {
      firstname: user.firstName,
      lastname: user.lastName,
      email: user.email,
      password: user.password,
      usertype: user.userType,
      orderExportColumns: user.orderExportColumns,
      lastPasUpdate: user.lastPasUpdate,
      active: user.active,
      isBlocked: user.isBlocked,
      blockMailSent: user.blockMailSent,
      token: user.token,
      googleId: user.googleId,
      profilePicture: user.profilePicture,
      googleAcessToken: user.googleAccessToken, 
      CreatedAt: user.createdAt,
      ModifiedBy: user.modifiedBy,
      CreatedBy: user.createdBy,
      ModifiedAt: user.modifiedAt,
    };
  }

  static fromCreateDto(dto: CreateUserDto): Prisma.UserCreateInput {
  return {
    firstname: dto.firstName,
    lastname: dto.lastName,
    email: dto.email,
    password: dto.password,
    usertype: dto.userType,
    orderExportColumns: dto.orderExportColumns,
    lastPasUpdate: dto.lastPasUpdate,
    active: dto.active ?? true,
    isBlocked: dto.isBlocked ?? false,
    blockMailSent: dto.blockMailSent ?? false,
    token: dto.token,
    googleId: dto.googleId,
    profilePicture: dto.profilePicture,
    googleAcessToken: dto.googleAccessToken,
  };
}
}