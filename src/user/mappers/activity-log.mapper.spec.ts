import { ActivityLogMapper } from './activity-log.mapper';
import { faker } from '@faker-js/faker';
import {
  createActivityLogFactory,
  createActivityLogEntityFactory,
} from '../../utils/factories/activity-log.factory';

describe('ActivityLogMapper', () => {
  describe('toDomain', () => {
    it('should map full PrismaActivityLog to ActivityLogEntity correctly', () => {
      const prismaLog = createActivityLogFactory({
        userId: faker.number.int(),
        email: faker.internet.email(),
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        url: faker.internet.url(),
        lastModifyOn: faker.date.recent(),
        ipAddress: faker.internet.ip(),
        type: 'Store',
        env: 'production',
      });

      const expectedEntity = createActivityLogEntityFactory({
        id: prismaLog.id,
        userId: prismaLog.userId ?? undefined,
        email: prismaLog.email ?? undefined,
        firstName: prismaLog.firstname ?? undefined,
        lastName: prismaLog.lastname ?? undefined,
        url: prismaLog.url ?? undefined,
        lastModifyOn: prismaLog.lastModifyOn ?? undefined,
        ipAddress: prismaLog.ipAddress ?? undefined,
        type: prismaLog.type,
        env: prismaLog.env ?? undefined,
      });

      const entity = ActivityLogMapper.toDomain(prismaLog);
      expect(entity).toEqual(expectedEntity);
    });

    it('should map with optional fields undefined if null', () => {
      const prismaLog = createActivityLogFactory({
        userId: null,
        email: null,
        firstname: null,
        lastname: null,
        url: null,
        lastModifyOn: null,
        ipAddress: null,
        type: 'BlueSky',
        env: null,
      });

      const expectedEntity = createActivityLogEntityFactory({
        id: prismaLog.id,
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

      const entity = ActivityLogMapper.toDomain(prismaLog);
      expect(entity).toEqual(expectedEntity);
    });
  });

  describe('toPersistence', () => {
    it('should map full ActivityLogEntity to Prisma.ActivityLogCreateInput correctly', () => {
      const entity = createActivityLogEntityFactory({
        userId: faker.number.int(),
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        url: faker.internet.url(),
        lastModifyOn: faker.date.recent(),
        ipAddress: faker.internet.ip(),
        type: 'Store',
        env: 'production',
      });

      const persistence = ActivityLogMapper.toPersistence(entity);

      expect(persistence).toEqual({
        user: { connect: { id: entity.userId! } },
        email: entity.email,
        firstname: entity.firstName,
        lastname: entity.lastName,
        url: entity.url,
        lastModifyOn: entity.lastModifyOn,
        ipAddress: entity.ipAddress,
        type: entity.type,
        env: entity.env,
      });
    });

    it('should set user to undefined if userId is undefined', () => {
      const entity = createActivityLogEntityFactory({
        userId: undefined,
        email: faker.internet.email(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        url: faker.internet.url(),
        lastModifyOn: faker.date.recent(),
        ipAddress: faker.internet.ip(),
        type: 'BlueSky',
        env: 'staging',
      });

      const persistence = ActivityLogMapper.toPersistence(entity);
      expect(persistence.user).toBeUndefined();
      expect(persistence.email).toBe(entity.email);
    });

    it('should default string fields to empty string if undefined', () => {
      const entity = createActivityLogEntityFactory({
        userId: undefined,
        email: undefined,
        firstName: undefined,
        lastName: undefined,
        url: undefined,
        lastModifyOn: undefined,
        ipAddress: undefined,
        env: undefined,
        type: 'Store',
      });

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
