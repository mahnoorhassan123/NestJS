import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { Response } from 'express';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dtos/customer.dto';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('sync')
  async syncCustomers() {
    return await this.customerService.syncCustomers();
  }

  @Get()
  async getCustomers(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sortBy') sortBy = 'createdAt',
    @Query('order') order = 'asc',
    @Query('q') q = '',
  ) {
    return await this.customerService.getCustomers(
      +page,
      +limit,
      sortBy,
      order,
      q,
    );
  }

  @Get('list')
  async getAllCustomers() {
    return await this.customerService.getAllCustomer();
  }
  @Get('modal-list')
  async getAllModalCustomers() {
    return await this.customerService.getAllModalCustomer();
  }

  @Get('count')
  async countCustomers() {
    return await this.customerService.countCustomers();
  }

  @Get('export')
  async exportCustomers(@Res() res: Response) {
    const csvData = await this.customerService.exportCustomers();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
    res.send(csvData);
  }

  @Get('getRecord/:customerID')
  async getCustomer(@Param('customerID') customerID: string) {
    const customer = await this.customerService.getCustomerById(+customerID);
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  @Post('save')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    console.log('create customer');

    return await this.customerService.createCustomer(createCustomerDto);
  }

  @Patch('update/:id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: CreateCustomerDto,
  ) {
    return await this.customerService.updateCustomer(+id, updateCustomerDto);
  }

  @Patch('update-password/:id')
  async resetPassword(
    @Param('id') id: string,
    @Body() body: { password: string },
  ) {
    return await this.customerService.resetPassword(+id, body.password);
  }
}
