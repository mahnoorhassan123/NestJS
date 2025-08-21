import { createActivityLogEntityFactory } from '../../utils/factories/activity-log.factory';
import { ActivityLogEntity } from './activity-log.entity';

describe('ActivityLogEntity', () => {
  it('should create an instance and assign properties correctly', () => {
    const log = new ActivityLogEntity();

    log.id = 123;
    log.userId = 45;
    log.email = 'user@example.com';
    log.firstName = 'Alice';
    log.lastName = 'Smith';
    log.url = '/some/url';
    log.lastModifyOn = new Date('2025-01-01');
    log.ipAddress = '192.168.1.1';
    log.type = 'Store';
    log.env = 'production';

    expect(log.id).toBe(123);
    expect(log.userId).toBe(45);
    expect(log.email).toBe('user@example.com');
    expect(log.firstName).toBe('Alice');
    expect(log.lastName).toBe('Smith');
    expect(log.url).toBe('/some/url');
    expect(log.lastModifyOn).toEqual(new Date('2025-01-01'));
    expect(log.ipAddress).toBe('192.168.1.1');
    expect(log.type).toBe('Store');
    expect(log.env).toBe('production');
  });
});
