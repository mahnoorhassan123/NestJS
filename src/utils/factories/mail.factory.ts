import { faker } from '@faker-js/faker';

export interface MailOptionsFactoryParams {
  to: string;
  firstName: string;
  lastName: string;
  link: string;
  subject: string;
}

export const createMailOptionsFactory = (
  overrides: Partial<MailOptionsFactoryParams> = {}
): MailOptionsFactoryParams => ({
  to: overrides.to ?? faker.internet.email(),
  firstName: overrides.firstName ?? faker.person.firstName(),
  lastName: overrides.lastName ?? faker.person.lastName(),
  link: overrides.link ?? faker.internet.url(),
  subject: overrides.subject ?? faker.lorem.sentence(3),
});