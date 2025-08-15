import { createActivityLogEntityFactory } from '../../utils/factories/activity-log.factory';
import { ActivityLogEntity } from './activity-log.entity';

describe('ActivityLogEntity', () => {
  it('should create an instance and assign properties correctly', () => {
    const log = createActivityLogEntityFactory();

    expect(log).toBeInstanceOf(ActivityLogEntity);
    expect(typeof log.id).toBe('number');
    expect(typeof log.userId).toBe('number');
    expect(typeof log.email).toBe('string');
    expect(typeof log.firstName).toBe('string');
    expect(typeof log.lastName).toBe('string');
    expect(typeof log.url).toBe('string');
    expect(log.lastModifyOn).toBeInstanceOf(Date);
    expect(typeof log.ipAddress).toBe('string');
    expect(['Store', 'BlueSky']).toContain(log.type);
    expect(['production', 'staging', 'development']).toContain(log.env);
  });
});
