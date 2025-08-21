import { UserEntity } from './user.entity';
import { createUserEntityFactory } from '../../utils/factories/user.factory';

describe('UserEntity', () => {
  it('should create an instance and assign properties correctly', () => {
    const fakeUser = createUserEntityFactory();

    const user = new UserEntity();
    Object.assign(user, fakeUser);

    expect(user.id).toBe(fakeUser.id);
    expect(user.firstName).toBe(fakeUser.firstName);
    expect(user.lastName).toBe(fakeUser.lastName);
    expect(user.email).toBe(fakeUser.email);
    expect(user.password).toBe(fakeUser.password);
    expect(user.userType).toBe(fakeUser.userType);
    expect(user.orderExportColumns).toBe(fakeUser.orderExportColumns);
    expect(user.lastPasUpdate).toEqual(fakeUser.lastPasUpdate);
    expect(user.active).toBe(fakeUser.active);
    expect(user.isBlocked).toBe(fakeUser.isBlocked);
    expect(user.blockMailSent).toBe(fakeUser.blockMailSent);
    expect(user.token).toBe(fakeUser.token);
    expect(user.googleId).toBe(fakeUser.googleId);
    expect(user.profilePicture).toBe(fakeUser.profilePicture);
    expect(user.googleAccessToken).toBe(fakeUser.googleAccessToken);
    expect(user.createdAt).toEqual(fakeUser.createdAt);
    expect(user.modifiedBy).toBe(fakeUser.modifiedBy);
    expect(user.createdBy).toBe(fakeUser.createdBy);
    expect(user.modifiedAt).toEqual(fakeUser.modifiedAt);
  });
});
