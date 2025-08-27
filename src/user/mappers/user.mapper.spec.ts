import { UserMapper } from './user.mapper';
import { UserEntity } from '../entities/user.entity';
import { User } from '@prisma/client';
import { CreateUserDto, userType } from '../dtos/user.dto';

describe('UserMapper', () => {
  const prismaUser: User = {
    id: 1,
    firstname: 'John',
    lastname: 'Doe',
    email: 'john@example.com',
    password: 'hashedpass',
    usertype: 'admin',
    orderExportColumns: 'col1,col2',
    lastPasUpdate: new Date('2025-01-01T00:00:00Z'),
    active: true,
    isBlocked: false,
    blockMailSent: false,
    token: 'token123',
    googleId: 'google-123',
    profilePicture: 'pic.jpg',
    googleAcessToken: 'access-token-xyz',
    CreatedAt: new Date('2024-01-01T00:00:00Z'),
    ModifiedBy: 2,
    CreatedBy: 1,
    ModifiedAt: new Date('2025-06-01T00:00:00Z'),
  };

  const userEntity: UserEntity = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'hashedpass',
    userType: 'admin',
    orderExportColumns: 'col1,col2',
    lastPasUpdate: new Date('2025-01-01T00:00:00Z'),
    active: true,
    isBlocked: false,
    blockMailSent: false,
    token: 'token123',
    googleId: 'google-123',
    profilePicture: 'pic.jpg',
    googleAccessToken: 'access-token-xyz',
    createdAt: new Date('2024-01-01T00:00:00Z'),
    modifiedBy: 2,
    createdBy: 1,
    modifiedAt: new Date('2025-06-01T00:00:00Z'),
  };

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
      const dto: CreateUserDto = {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        password: 'secret',
        userType: userType.ADMIN,
        orderExportColumns: 'colA,colB',
        lastPasUpdate: new Date('2023-05-05T00:00:00Z'),
        active: false,
        isBlocked: true,
        blockMailSent: true,
        token: 'tok123',
        googleId: 'google-789',
        profilePicture: 'pic2.jpg',
        googleAccessToken: 'access-token-abc',
      };

      const expected = {
        firstname: dto.firstName,
        lastname: dto.lastName,
        email: dto.email,
        password: dto.password,
        usertype: dto.userType,
        orderExportColumns: dto.orderExportColumns,
        lastPasUpdate: dto.lastPasUpdate,
        active: dto.active,
        isBlocked: dto.isBlocked,
        blockMailSent: dto.blockMailSent,
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
        email: 'jane@example.com',
        password: 'secret',
        userType: userType.USER,
      };

      const result = UserMapper.fromCreateDto(dto);
      expect(result.active).toBe(true);
      expect(result.isBlocked).toBe(false);
      expect(result.blockMailSent).toBe(false);
    });
  });
});
