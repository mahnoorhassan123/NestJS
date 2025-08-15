import { faker } from '@faker-js/faker';
import { ActivityLog } from '@prisma/client';
import { ActivityLogEntity } from '../../user/entities/activity-log.entity';

export const createActivityLogFactory = (
  overrides: Partial<ActivityLog> = {}
): ActivityLog => ({
  id: faker.number.int({ min: 1, max: 1000 }),
  userId: faker.datatype.boolean() ? faker.number.int({ min: 1, max: 1000 }) : null,
  email: faker.datatype.boolean() ? faker.internet.email() : null,
  firstname: faker.datatype.boolean() ? faker.person.firstName() : null,
  lastname: faker.datatype.boolean() ? faker.person.lastName() : null,
  url: faker.datatype.boolean() ? faker.internet.url() : null,
  lastModifyOn: faker.datatype.boolean() ? faker.date.recent() : null,
  ipAddress: faker.datatype.boolean() ? faker.internet.ip() : null,
  type: faker.helpers.arrayElement(['Store', 'BlueSky']),
  env: faker.datatype.boolean() ? faker.helpers.arrayElement(['production', 'staging', 'dev']) : null,
  ...overrides,
});

export const createActivityLogEntityFactory = (
  overrides: Partial<ActivityLogEntity> = {}
): ActivityLogEntity => {
  return Object.assign(
    new ActivityLogEntity(),
    {
      id: faker.number.int({ min: 1, max: 1000 }),
      userId: faker.number.int({ min: 1, max: 1000 }), 
      email: faker.internet.email(),                  
      firstName: faker.person.firstName(),           
      lastName: faker.person.lastName(),              
      url: faker.internet.url(),                     
      lastModifyOn: faker.date.recent(),              
      ipAddress: faker.internet.ip(), 
      type: faker.helpers.arrayElement(['Store', 'BlueSky']),
      env: faker.helpers.arrayElement(['production', 'staging', 'development']) ?? 'production'
    },
    overrides
  );
};
