import { ActivityLogMapper } from './activity-log.mapper';
import { ActivityLogEntity } from '../entities/activity-log.entity';
import { ActivityLog } from '@prisma/client';

describe('ActivityLogMapper', () => {
  describe('toDomain', () => {
    it('should map full PrismaActivityLog to ActivityLogEntity correctly', () => {
      const prismaLog: ActivityLog = {
        id: 1,
        userId: 123,
        email: 'user@example.com',
        firstname: 'John',
        lastname: 'Doe',
        url: '/test/url',
        lastModifyOn: new Date('2023-08-01T00:00:00Z'),
        ipAddress: '192.168.1.1',
        type: 'Store',
        env: 'production',
      };

      const entity = ActivityLogMapper.toDomain(prismaLog);

      expect(entity).toEqual({
        id: 1,
        userId: 123,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        url: '/test/url',
        lastModifyOn: new Date('2023-08-01T00:00:00Z'),
        ipAddress: '192.168.1.1',
        type: 'Store',
        env: 'production',
      });
    });

    it('should map with optional fields undefined if null', () => {
      const prismaLog: ActivityLog = {
        id: 2,
        userId: null,
        email: null,
        firstname: null,
        lastname: null,
        url: null,
        lastModifyOn: null,
        ipAddress: null,
        type: 'BlueSky',
        env: null,
      };

      const entity = ActivityLogMapper.toDomain(prismaLog);

      expect(entity).toEqual({
        id: 2,
        userId: undefined,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        url: undefined,
        lastModifyOn: undefined,
        ipAddress: undefined,
        type: 'BlueSky',
        env: undefined,
      });
    });
  });

  describe('toPersistence', () => {
    it('should map full ActivityLogEntity to Prisma.ActivityLogCreateInput correctly', () => {
      const entity: ActivityLogEntity = {
        id: 1,
        userId: 123,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        url: '/test/url',
        lastModifyOn: new Date('2023-08-01T00:00:00Z'),
        ipAddress: '192.168.1.1',
        type: 'Store',
        env: 'production',
      };

      const persistence = ActivityLogMapper.toPersistence(entity);

      expect(persistence).toEqual({
        user: { connect: { id: 123 } },
        email: 'user@example.com',
        firstname: 'John',
        lastname: 'Doe',
        url: '/test/url',
        lastModifyOn: new Date('2023-08-01T00:00:00Z'),
        ipAddress: '192.168.1.1',
        type: 'Store',
        env: 'production',
      });
    });

    it('should set user to undefined if userId is undefined', () => {
      const entity: ActivityLogEntity = {
        id: 2,
        email: 'user@example.com',
        firstName: 'John',
        lastName: 'Doe',
        url: '/test/url',
        lastModifyOn: new Date(),
        ipAddress: '192.168.1.1',
        type: 'BlueSky',
        env: 'staging',
      };

      const persistence = ActivityLogMapper.toPersistence(entity);

      expect(persistence.user).toBeUndefined();
      expect(persistence.email).toBe('user@example.com');
    });

    it('should default string fields to empty string if undefined', () => {
      const entity: ActivityLogEntity = {
        id: 3,
        type: 'Store',
      };

      const persistence = ActivityLogMapper.toPersistence(entity);

      expect(persistence.email).toBe('');
      expect(persistence.firstname).toBe('');
      expect(persistence.lastname).toBe('');
      expect(persistence.url).toBe('');
      expect(persistence.lastModifyOn).toBe('');
      expect(persistence.ipAddress).toBeUndefined();
      expect(persistence.type).toBe('Store');
      expect(persistence.env).toBeUndefined();
    });
  });
});
