import { Body, Controller, Get, Post, Req, Query, Res } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Request, Response } from 'express';
import { CreateUserDto, SetPasswordDto, ForgotPasswordDto, LoginAuthDto } from '../dtos/user.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('User')  
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiQuery({ name: 'userId', required: true, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  async getUser(@Query('userId') userId: string, @Res() res: Response) {
    const user = await this.userService.getUserById(Number(userId));
    return res.send(user);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.getAllUsers();
    return res.send(users);
  }

  @Post('save')
  @ApiOperation({ summary: 'Save a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User saved successfully' })
  async saveUser(
    @Body('data') data: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.userService.saveUser(data, req);
    return res.send(result);
  }

  @Post('current-user-record')
  @ApiOperation({ summary: 'Save activity log for current user' })
  @ApiResponse({ status: 201, description: 'Activity log saved' })
  async saveActivity(@Body('data') data: any, @Res() res: Response) {
    const result = await this.userService.saveActivityLog(data);
    return res.send(result);
  }

  @Post('get-current-user-record')
  @ApiOperation({ summary: 'Get activity logs for current user' })
  @ApiResponse({ status: 200, description: 'Activity logs retrieved' })
  async getActivity(@Body('data') filter: any, @Res() res: Response) {
    const result = await this.userService.getActivityLog(filter);
    return res.send(result);
  }

  @Post('set-pass')
  @ApiOperation({ summary: 'Set password for a user' })
  @ApiBody({ type: SetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password set successfully' })
  async setPassword(
    @Body('data') data: SetPasswordDto,
    @Res() res: Response
  ) {
    const result = await this.userService.setPassword(data);
    return res.send(result);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Trigger forgot password flow' })
  @ApiBody({ type: ForgotPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(
    @Body('data') data: ForgotPasswordDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.userService.forgotPassword(data, req);
    return res.send(result);
  }

  @Post('token-verify')
  @ApiOperation({ summary: 'Verify a token' })
  @ApiBody({ schema: { example: { token: 'abc123' } } })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  async tokenVerify(
    @Body('data') body: { token: string },
    @Res() res: Response
  ) {
    const result = await this.userService.verifyToken(body.token);
    return res.send(result);
  }

  @Post('google-auth')
  @ApiOperation({ summary: 'Authenticate with Google' })
  @ApiBody({ schema: { example: { response: { value: {} } } } })
  @ApiResponse({ status: 200, description: 'Google authentication successful' })
  async googleAuth(
    @Body('response') { value: googleUserData }: any,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.userService.googleAuth(googleUserData, req);
    return res.send(result);
  }

  @Post('login-auth')
  @ApiOperation({ summary: 'Authenticate user with login credentials' })
  @ApiBody({ type: LoginAuthDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  async loginAuth(
    @Body('data') data: LoginAuthDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.userService.loginAuth(data, req);
    return res.send(result);
  }
}
