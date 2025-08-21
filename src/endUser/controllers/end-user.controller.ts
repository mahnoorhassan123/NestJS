import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { EndUserService } from '../service/end-user.service';
import { Response } from 'express';
import { EndUserDto } from '../dtos/endUser.dto';

@Controller('end-users')
export class EndUserController {
  constructor(private readonly endUserService: EndUserService) {}

  @Get('sync')
  async syncCustomers() {
    return await this.endUserService.syncEndUsers();
  }

  @Get()
  async getCustomers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order = 'asc',
    @Query('q') q = '',
  ) {
    return await this.endUserService.getEndUsers(
      +page,
      +limit,
      sortBy,
      order,
      q,
    );
  }

  @Get('list')
  async getAllEndUsers() {
    return await this.endUserService.getAllEndUsers();
  }

  @Get('modal-list')
  async getAllModalEndUsers() {
    return await this.endUserService.getAllModalEndUsers();
  }

  @Get('count')
  async countCustomers() {
    return await this.endUserService.countEndUsers();
  }

  @Get('export')
  async exportCustomers(@Res() res: Response) {
    const csvData = await this.endUserService.exportEndUsers();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csvData);
  }

  @Get('/getRecord/:endUserid')
  async getCustomer(@Param('endUserid') endUserid: string) {
    const customer = await this.endUserService.getEndUserById(+endUserid);
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  @Post('save')
  async createCustomer(@Body() createCustomerDto: EndUserDto) {
    return await this.endUserService.createEndUser(createCustomerDto);
  }

  @Patch('update/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: EndUserDto,
  ) {
    return await this.endUserService.updateEndUser(+id, updateCustomerDto);
  }
}
