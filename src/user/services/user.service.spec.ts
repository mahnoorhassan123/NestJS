import { UserService } from './user.service';
import { PrismaService } from '../../prisma/prisma.service';
import { MailHelper } from '../helpers/mail.helper';
import * as bcrypt from 'bcryptjs';
import { UserMapper } from '../mappers/user.mapper';
import { ActivityType, UserType, User } from '@prisma/client';
import { userType } from '../dtos/user.dto';

jest.mock('bcryptjs');

describe('UserService', () => {
    let service: UserService;
    let prisma: Partial<Record<keyof PrismaService, any>>;
    let mailHelper: Partial<MailHelper>;

    const createMockUser = (overrides?: Partial<User>): User => ({
        id: 1,
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        usertype: UserType.user,
        orderExportColumns: null,
        lastPasUpdate: null,
        active: true,
        isBlocked: false,
        blockMailSent: false,
        token: null,
        googleId: null,
        googleAcessToken: null,
        profilePicture: null,
        CreatedAt: new Date(),
        ModifiedBy: null,
        CreatedBy: null,
        ModifiedAt: null,
        ...overrides,
    });

    beforeEach(() => {
        prisma = {
            user: {
                findUnique: jest.fn(),
                findMany: jest.fn(),
                create: jest.fn(),
                update: jest.fn(),
                findFirst: jest.fn(),
            },
            activityLog: {
                create: jest.fn(),
                findMany: jest.fn(),
            },
            passwordHistory: {
                findMany: jest.fn(),
                create: jest.fn(),
            },
        };
        mailHelper = {
            sendWelcomeEmail: jest.fn(),
            sendResetPasswordEmail: jest.fn(),
        };
        service = new UserService(prisma as any, mailHelper as any);
    });

    describe('getUserById', () => {
        it('should return user domain object if found', async () => {
            const rawUser = createMockUser();
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(rawUser);

            const result = await service.getUserById(1);

            expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
            expect(result).toEqual(UserMapper.toDomain(rawUser));
        });

        it('should return null if no user found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            const result = await service.getUserById(999);
            expect(result).toBeNull();
        });
    });

    describe('getAllUsers', () => {
        it('should return array of user domain objects', async () => {
            const rawUsers = [
                createMockUser(),
                createMockUser({ id: 2, firstname: 'Jane', lastname: 'Smith', email: 'jane@example.com', usertype: UserType.admin }),
            ];
            (prisma.user.findMany as jest.Mock).mockResolvedValue(rawUsers);

            const result = await service.getAllUsers();

            expect(prisma.user.findMany).toHaveBeenCalled();
            expect(result).toEqual(rawUsers.map(UserMapper.toDomain));
        });
    });

    describe('saveUser', () => {
        const reqMock = {
            protocol: 'http',
            get: jest.fn().mockReturnValue('localhost'),
        };

        beforeEach(() => {
            jest.clearAllMocks();
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        });

        it('should update existing user if id provided', async () => {
            const userDto = { id: 1, email: 'test@example.com', password: 'pass1234', userType: 'user' };
            const updatedUserRaw = createMockUser({ id: 1, firstname: 'Test', lastname: 'User', email: 'test@example.com' });

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(updatedUserRaw);
            (prisma.user.update as jest.Mock).mockResolvedValue(updatedUserRaw);

            const result = await service.saveUser(userDto as any, reqMock);

            expect(prisma.user.update).toHaveBeenCalled();
            expect(result).toEqual(UserMapper.toDomain(updatedUserRaw));
        });

        it('should create new user and send welcome email if user does not exist', async () => {
            const userDto = { email: 'new@example.com', password: 'pass1234', userType: 'user' };
            const createdUserRaw = createMockUser({ id: 2, firstname: '', lastname: null, email: 'new@example.com', password: null, token: 'token123' });

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            (prisma.user.create as jest.Mock).mockResolvedValue(createdUserRaw);

            const spyRandom = jest.spyOn(Math, 'random').mockReturnValue(0.123456789);
            const result = await service.saveUser(userDto as any, reqMock);

            expect(bcrypt.hash).toHaveBeenCalledWith(userDto.password, 10);
            expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
                data: expect.objectContaining({
                    password: 'hashedPassword',
                    token: expect.any(String),
                }),
            }));
            expect(mailHelper.sendWelcomeEmail).toHaveBeenCalledWith(expect.objectContaining({
                to: createdUserRaw.email,
                subject: 'Verify your account',
            }));
            expect(result).toEqual(UserMapper.toDomain(createdUserRaw));
            spyRandom.mockRestore();
        });

        it('should return error if user with email exists', async () => {
            const userDto = { email: 'exists@example.com', password: 'pass1234', userType: 'user' };
            const existingUser = createMockUser({ id: 5, email: 'exists@example.com' });

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

            const result = await service.saveUser(userDto as any, reqMock);

            expect(result).toEqual({ error: 'User with this email already exists.' });
            expect(mailHelper.sendWelcomeEmail).not.toHaveBeenCalled();
        });
    });

    describe('saveActivityLog', () => {
        it('should create an activity log', async () => {
            const data = { action: 'login' };
            (prisma.activityLog.create as jest.Mock).mockResolvedValue(data);

            const result = await service.saveActivityLog(data);

            expect(prisma.activityLog.create).toHaveBeenCalledWith({ data });
            expect(result).toEqual(data);
        });
    });

    describe('getActivityLog', () => {
        it('should get activity logs by filter', async () => {
            const filter = { userId: 1 };
            const logs = [{ id: 1, action: 'login' }];
            (prisma.activityLog.findMany as jest.Mock).mockResolvedValue(logs);

            const result = await service.getActivityLog(filter);

            expect(prisma.activityLog.findMany).toHaveBeenCalledWith({ where: filter });
            expect(result).toEqual(logs);
        });
    });

    describe('setPassword', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should return error if token is invalid', async () => {
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);

            const result = await service.setPassword({ token: 'badtoken', password: 'newpass123' });

            expect(result).toEqual({ status: false, msg: 'Invalid token' });
        });

        it('should prevent reuse of old passwords', async () => {
            const user = createMockUser();
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);

            (prisma.passwordHistory.findMany as jest.Mock).mockResolvedValue([
                { password: 'hashedOldPass' },
            ]);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.setPassword({ token: 'token', password: 'newpass123' });

            expect(result).toEqual({ status: false, msg: 'Password already used, try a new one' });
        });

        it('should update password if not reused', async () => {
            const user = createMockUser();
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(user);
            (prisma.passwordHistory.findMany as jest.Mock).mockResolvedValue([
                { password: 'oldhashedpass' },
            ]);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            (bcrypt.hash as jest.Mock).mockResolvedValue('hashedNewPass');
            (prisma.user.update as jest.Mock).mockResolvedValue({});
            (prisma.passwordHistory.create as jest.Mock).mockResolvedValue({});

            const result = await service.setPassword({ token: 'token', password: 'newpass123' });

            expect(prisma.user.update).toHaveBeenCalledWith({
                where: { id: user.id },
                data: { password: 'hashedNewPass' },
            });
            expect(prisma.passwordHistory.create).toHaveBeenCalled();
            expect(result).toEqual({ status: true, msg: 'Password updated successfully' });
        });
    });

    describe('forgotPassword', () => {
        const reqMock = {
            protocol: 'http',
            get: jest.fn().mockReturnValue('localhost'),
        };

        it('should return error if email not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            const result = await service.forgotPassword({ email: 'missing@example.com' }, reqMock);
            expect(result).toEqual({ status: false, msg: 'Email not found' });
        });

        it('should update token and send reset password email', async () => {
            const user = createMockUser();
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
            (prisma.user.update as jest.Mock).mockResolvedValue(user);
            (mailHelper.sendResetPasswordEmail as jest.Mock).mockResolvedValue(undefined);

            const result = await service.forgotPassword({ email: user.email }, reqMock);

            expect(prisma.user.update).toHaveBeenCalled();
            expect(mailHelper.sendResetPasswordEmail).toHaveBeenCalledWith(expect.objectContaining({
                to: user.email,
                subject: 'Password Reset',
            }));
            expect(result).toEqual({ status: true, msg: 'Password reset email sent' });
        });
    });

    describe('verifyToken', () => {
        it('should return true status if user with token found', async () => {
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(createMockUser());
            const result = await service.verifyToken('token123');
            expect(result).toEqual({ status: true });
        });

        it('should return false status if no user found', async () => {
            (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
            const result = await service.verifyToken('token123');
            expect(result).toEqual({ status: false });
        });
    });

    describe('loginAuth', () => {
        it('should return error if user not found or inactive', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
            const res1 = await service.loginAuth({ email: 'a', password: 'p' }, {});
            expect(res1).toEqual({ error: 'Invalid credentials or inactive user' });

            (prisma.user.findUnique as jest.Mock).mockResolvedValue(createMockUser({ active: false }));
            const res2 = await service.loginAuth({ email: 'a', password: 'p' }, {});
            expect(res2).toEqual({ error: 'Invalid credentials or inactive user' });
        });

        it('should return error if user password not set', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(createMockUser({ password: null }));
            const res = await service.loginAuth({ email: 'a', password: 'p' }, {});
            expect(res).toEqual({ error: 'Password not set for this user' });
        });

        it('should return error if password does not match', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(createMockUser());
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);
            const res = await service.loginAuth({ email: 'a', password: 'p' }, {});
            expect(res).toEqual({ error: 'Incorrect password' });
        });

        it('should return user and is_expire flag', async () => {
            const lastPasUpdate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 91);
            const rawUser = createMockUser({ lastPasUpdate });
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(rawUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await service.loginAuth({ email: rawUser.email, password: 'password' }, {});

            expect(result.user).toEqual(UserMapper.toDomain(rawUser));
            expect(result.is_expire).toBe(true);
        });
    });

    describe('googleAuth', () => {
        it('should return failure if user not found', async () => {
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

            const res = await service.googleAuth({ email: 'noone@example.com' }, {});

            expect(res).toEqual({ success: false, message: 'Google user not found' });
        });

        it('should update user and create activity log on success', async () => {
            const rawUser = createMockUser();
            (prisma.user.findUnique as jest.Mock).mockResolvedValue(rawUser);
            (prisma.user.update as jest.Mock).mockResolvedValue(rawUser);
            (prisma.activityLog.create as jest.Mock).mockResolvedValue({});

            const userData = {
                email: rawUser.email,
                googleId: 'google-id',
                accessToken: 'token',
                imageUrl: 'url',
            };

            const res = await service.googleAuth(userData, {});

            expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { email: rawUser.email },
                data: expect.objectContaining({
                    googleId: userData.googleId,
                    googleAcessToken: userData.accessToken,
                    profilePicture: userData.imageUrl,
                }),
            }));

            expect(prisma.activityLog.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        email: rawUser.email,
                        userId: rawUser.id,
                        type: ActivityType.BlueSky
                    })
                })
            );

            expect(res).toEqual(UserMapper.toDomain(rawUser));
        });
    });
});
