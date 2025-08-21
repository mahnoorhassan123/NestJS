import { UserMapper } from './user.mapper';
import { CreateUserDto, userType } from '../dtos/user.dto';
import { faker } from '@faker-js/faker';
import { createUserFactory, createUserEntityFactory, createUserDtoFactory } from '../../utils/factories/user.factory';

describe('UserMapper', () => {
  const prismaUser = createUserFactory();
  const userEntity = createUserEntityFactory({
    id: prismaUser.id,
    firstName: prismaUser.firstname ?? undefined,
    lastName: prismaUser.lastname ?? undefined,
    email: prismaUser.email,
    password: prismaUser.password ?? undefined,
    userType: prismaUser.usertype ,
    orderExportColumns: prismaUser.orderExportColumns ?? undefined,
    lastPasUpdate: prismaUser.lastPasUpdate ?? undefined,
    active: prismaUser.active ?? undefined,
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
  });

  describe('toDomain', () => {
    it('should map PrismaUser to UserEntity correctly', () => {
      const result = UserMapper.toDomain(prismaUser);
      expect(result).toEqual(userEntity);
    });

    it('should default active to true if undefined', () => {
      const prismaUserNoActive = { ...prismaUser, active: null };
      const result = UserMapper.toDomain(prismaUserNoActive);
      expect(result.active).toBe(true);
    });
  });

  describe('toPersistence', () => {
    it('should map UserEntity to Prisma.UserCreateInput correctly', () => {
      const result = UserMapper.toPersistence(userEntity);
      expect(result).toEqual({
        firstname: userEntity.firstName,
        lastname: userEntity.lastName,
        email: userEntity.email,
        password: userEntity.password,
        usertype: userEntity.userType,
        orderExportColumns: userEntity.orderExportColumns,
        lastPasUpdate: userEntity.lastPasUpdate,
        active: userEntity.active,
        isBlocked: userEntity.isBlocked,
        blockMailSent: userEntity.blockMailSent,
        token: userEntity.token,
        googleId: userEntity.googleId,
        profilePicture: userEntity.profilePicture,
        googleAcessToken: userEntity.googleAccessToken,
        CreatedAt: userEntity.createdAt,
        ModifiedBy: userEntity.modifiedBy,
        CreatedBy: userEntity.createdBy,
        ModifiedAt: userEntity.modifiedAt,
      });
    });
  });

  describe('fromCreateDto', () => {
    it('should map CreateUserDto to Prisma.UserCreateInput correctly', () => {
      const dto = createUserDtoFactory();
      const expected = {
        firstname: dto.firstName,
        lastname: dto.lastName,
        email: dto.email,
        password: dto.password,
        usertype: dto.userType,
        orderExportColumns: dto.orderExportColumns,
        lastPasUpdate: dto.lastPasUpdate,
        active: dto.active,
        isBlocked: dto.isBlocked ?? false,
        blockMailSent: dto.blockMailSent ?? false,
        token: dto.token,
        googleId: dto.googleId,
        profilePicture: dto.profilePicture,
        googleAcessToken: dto.googleAccessToken,
      };

      const result = UserMapper.fromCreateDto(dto);
      expect(result).toEqual(expected);
    });

    it('should default active to true and isBlocked/blockMailSent to false if not set', () => {
      const dto: CreateUserDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
        userType: userType.USER,
      };

      const result = UserMapper.fromCreateDto(dto);
      expect(result.active).toBe(true);
      expect(result.isBlocked).toBe(false);
      expect(result.blockMailSent).toBe(false);
    });
  });
});
