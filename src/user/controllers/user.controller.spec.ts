import { UserController } from './user.controller';
import { UserService } from '../services/user.service';
import { Request, Response } from 'express';
import { createUserEntityFactory } from '../../utils/factories/user.factory';
import { faker } from '@faker-js/faker';

describe('UserController', () => {
  let controller: UserController;
  let userService: jest.Mocked<UserService>;
  let mockRes: Partial<Response>;
  let mockReq: Partial<Request>;

  beforeEach(() => {
    userService = {
      getUserById: jest.fn(),
      getAllUsers: jest.fn(),
      saveUser: jest.fn(),
      saveActivityLog: jest.fn(),
      getActivityLog: jest.fn(),
      setPassword: jest.fn(),
      forgotPassword: jest.fn(),
      verifyToken: jest.fn(),
      googleAuth: jest.fn(),
      loginAuth: jest.fn(),
    } as any;

    controller = new UserController(userService);

    mockRes = { send: jest.fn() };
    mockReq = {};
  });

  it('should get a user by ID', async () => {
    const mockUser = createUserEntityFactory({ id: 1 });
    userService.getUserById.mockResolvedValue(mockUser);

    await controller.getUser('1', mockRes as Response);

    expect(userService.getUserById).toHaveBeenCalledWith(1);
    expect(mockRes.send).toHaveBeenCalledWith(mockUser);
  });

  it('should get all users', async () => {
    const mockUsers = [
      createUserEntityFactory({ id: 1 }),
      createUserEntityFactory({ id: 2 }),
    ];
    userService.getAllUsers.mockResolvedValue(mockUsers);

    await controller.getAllUsers(mockRes as Response);

    expect(userService.getAllUsers).toHaveBeenCalled();
    expect(mockRes.send).toHaveBeenCalledWith(mockUsers);
  });

  it('should save a user', async () => {
    const data = {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
      userType: 'admin',
    };
    const result = { success: true };
    userService.saveUser.mockResolvedValue(result);

    await controller.saveUser(
      data as any,
      mockReq as Request,
      mockRes as Response,
    );

    expect(userService.saveUser).toHaveBeenCalledWith(data, mockReq);
    expect(mockRes.send).toHaveBeenCalledWith(result);
  });

  it('should save activity log', async () => {
    const data = { action: 'login' };
    const result = { success: true };
    userService.saveActivityLog.mockResolvedValue(result);

    await controller.saveActivity(data, mockRes as Response);

    expect(userService.saveActivityLog).toHaveBeenCalledWith(data);
    expect(mockRes.send).toHaveBeenCalledWith(result);
  });

  it('should get activity log', async () => {
    const filter = { userId: faker.number.int({ min: 1, max: 100 }) };
    const result = [{ action: 'login' }];
    userService.getActivityLog.mockResolvedValue(result);

    await controller.getActivity(filter, mockRes as Response);

    expect(userService.getActivityLog).toHaveBeenCalledWith(filter);
    expect(mockRes.send).toHaveBeenCalledWith(result);
  });

  it('should set password', async () => {
    const data = { password: faker.internet.password({ length: 10 }) };
    const result = { success: true };
    userService.setPassword.mockResolvedValue(result);

    await controller.setPassword(data as any, mockRes as Response);

    expect(userService.setPassword).toHaveBeenCalledWith(data);
    expect(mockRes.send).toHaveBeenCalledWith(result);
  });

  it('should handle forgot password', async () => {
    const data = { email: faker.internet.email() };
    const result = { success: true };
    userService.forgotPassword.mockResolvedValue(result);

    await controller.forgotPassword(
      data as any,
      mockReq as Request,
      mockRes as Response,
    );

    expect(userService.forgotPassword).toHaveBeenCalledWith(data, mockReq);
    expect(mockRes.send).toHaveBeenCalledWith(result);
  });

  it('should verify token', async () => {
    const token = faker.string.uuid();
    const result = { status: true };
    userService.verifyToken.mockResolvedValue(result);

    await controller.tokenVerify({ token }, mockRes as Response);

    expect(userService.verifyToken).toHaveBeenCalledWith(token);
    expect(mockRes.send).toHaveBeenCalledWith(result);
  });

  it('should handle google auth', async () => {
    const googleUserData = { email: faker.internet.email() };
    const result = { success: true };
    userService.googleAuth.mockResolvedValue(result);

    await controller.googleAuth(
      { value: googleUserData },
      mockReq as Request,
      mockRes as Response,
    );

    expect(userService.googleAuth).toHaveBeenCalledWith(
      googleUserData,
      mockReq,
    );
    expect(mockRes.send).toHaveBeenCalledWith(result);
  });

  it('should handle login auth', async () => {
    const data = {
      email: faker.internet.email(),
      password: faker.internet.password({ length: 10 }),
    };
    const result = { token: faker.string.alphanumeric(20) };
    userService.loginAuth.mockResolvedValue(result);

    await controller.loginAuth(
      data as any,
      mockReq as Request,
      mockRes as Response,
    );

    expect(userService.loginAuth).toHaveBeenCalledWith(data, mockReq);
    expect(mockRes.send).toHaveBeenCalledWith(result);
  });
});
