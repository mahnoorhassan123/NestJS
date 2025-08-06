import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Query,
  Res,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { Request, Response } from 'express';
import {
  CreateUserDto,
  SetPasswordDto,
  ForgotPasswordDto,
  LoginAuthDto,
} from '../dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Query('userId') userId: string, @Res() res: Response) {
    const user = await this.userService.getUserById(Number(userId));
    return res.send(user);
  }

  @Get('list')
  async getAllUsers(@Res() res: Response) {
    const users = await this.userService.getAllUsers();
    return res.send(users);
  }

  @Post('save')
  async saveUser(
    @Body('data') data: CreateUserDto,
    @Req() req: Request,
    @Res() res: Response
  ) {
    const result = await this.userService.saveUser(data, req);
    return res.send(result);
  }

  // @Post('current-user-record')
  // async saveActivity(@Body('data') data: any, @Res() res: Response) {
  //   const result = await this.userService.saveActivityLog(data);
  //   return res.send(result);
  // }

  // @Post('get-current-user-record')
  // async getActivity(@Body('data') filter: any, @Res() res: Response) {
  //   const result = await this.userService.getActivityLog(filter);
  //   return res.send(result);
  // }

  // @Post('set-pass')
  // async setPassword(
  //   @Body('data') data: SetPasswordDto,
  //   @Res() res: Response
  // ) {
  //   const result = await this.userService.setPassword(data);
  //   return res.send(result);
  // }

  // @Post('forgot-password')
  // async forgotPassword(
  //   @Body('data') data: ForgotPasswordDto,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ) {
  //   const result = await this.userService.forgotPassword(data, req);
  //   return res.send(result);
  // }

  // @Post('token-verify')
  // async tokenVerify(
  //   @Body('data') body: { token: string },
  //   @Res() res: Response
  // ) {
  //   const result = await this.userService.verifyToken(body.token);
  //   return res.send(result);
  // }

  // @Post('google-auth')
  // async googleAuth(
  //   @Body('response') { value: googleUserData }: any,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ) {
  //   const result = await this.userService.googleAuth(googleUserData, req);
  //   return res.send(result);
  // }

  // @Post('login-auth')
  // async loginAuth(
  //   @Body('data') data: LoginAuthDto,
  //   @Req() req: Request,
  //   @Res() res: Response
  // ) {
  //   const result = await this.userService.loginAuth(data, req);
  //   return res.send(result);
  // }
}
