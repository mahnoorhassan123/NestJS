import { UserEntity } from './user.entity';

describe('UserEntity', () => {
  it('should create an instance and assign properties correctly', () => {
    const user = new UserEntity();

    user.id = 1;
    user.firstName = 'John';
    user.lastName = 'Doe';
    user.email = 'john.doe@example.com';
    user.password = 'hashedpassword';
    user.userType = 'admin';
    user.orderExportColumns = 'col1,col2';
    user.lastPasUpdate = new Date('2024-01-01');
    user.active = true;
    user.isBlocked = false;
    user.blockMailSent = false;
    user.token = 'token123';
    user.googleId = 'google-123';
    user.profilePicture = 'pic-url';
    user.googleAccessToken = 'access-token';
    user.createdAt = new Date('2023-01-01');
    user.modifiedBy = 10;
    user.createdBy = 5;
    user.modifiedAt = new Date('2024-02-01');

    expect(user.id).toBe(1);
    expect(user.firstName).toBe('John');
    expect(user.lastName).toBe('Doe');
    expect(user.email).toBe('john.doe@example.com');
    expect(user.password).toBe('hashedpassword');
    expect(user.userType).toBe('admin');
    expect(user.orderExportColumns).toBe('col1,col2');
    expect(user.lastPasUpdate).toEqual(new Date('2024-01-01'));
    expect(user.active).toBe(true);
    expect(user.isBlocked).toBe(false);
    expect(user.blockMailSent).toBe(false);
    expect(user.token).toBe('token123');
    expect(user.googleId).toBe('google-123');
    expect(user.profilePicture).toBe('pic-url');
    expect(user.googleAccessToken).toBe('access-token');
    expect(user.createdAt).toEqual(new Date('2023-01-01'));
    expect(user.modifiedBy).toBe(10);
    expect(user.createdBy).toBe(5);
    expect(user.modifiedAt).toEqual(new Date('2024-02-01'));
  });
});
