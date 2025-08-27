import { ActivityLog as PrismaActivityLog, Prisma } from '@prisma/client';
import { ActivityLogEntity } from '../entities/activity-log.entity';

export class ActivityLogMapper {
  static toDomain(prismaLog: PrismaActivityLog): ActivityLogEntity {
    return {
      id: prismaLog.id,
      userId: prismaLog.userId ?? undefined,
      email: prismaLog.email ?? undefined,
      firstName: prismaLog.firstname ?? undefined,
      lastName: prismaLog.lastname ?? undefined,
      url: prismaLog.url ?? undefined,
      lastModifyOn: prismaLog.lastModifyOn ?? undefined,
      ipAddress: prismaLog.ipAddress ?? undefined,
      type: prismaLog.type as 'Store' | 'BlueSky',
      env: prismaLog.env ?? undefined,
    };
  }

  static toPersistence(entity: ActivityLogEntity): Prisma.ActivityLogCreateInput {
    return {
      user: entity.userId ? { connect: { id: entity.userId } } : undefined,
      email: entity.email ?? '',
      firstname: entity.firstName ?? '',
      lastname: entity.lastName ?? '',
      url: entity.url ?? '',
      lastModifyOn: entity.lastModifyOn ?? '',
      ipAddress: entity.ipAddress,
      type: entity.type,
      env: entity.env,
    };
  }
}
