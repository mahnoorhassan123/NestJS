import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async getCustomers(
    page: number,
    limit: number,
    sortBy: string,
    order: string,
    q: string,
  ) {
    const skip = (page - 1) * limit;

    const whereClause = q
      ? {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
            { company: { contains: q } },
            { city: { contains: q } },
            { country: { contains: q } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      this.prisma.customer.findMany({
        where: whereClause,
        orderBy: { [sortBy]: order.toLowerCase() === 'desc' ? 'desc' : 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.customer.count({ where: whereClause }),
    ]);

    return {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: customers,
    };
  }

  async getCustomerById(id: number) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });
    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return customer;
  }

  async createCustomer(data: CreateCustomerDto) {
    const exists = await this.prisma.customer.findUnique({
      where: { email: data.email },
    });
    if (exists) {
      throw new HttpException('Customer already exists!', HttpStatus.CONFLICT);
    }
    const customer = await this.prisma.customer.create({ data });
    return { message: 'Success!', customer };
  }

  async updateCustomer(id: number, data: CreateCustomerDto) {
    const existing = await this.prisma.customer.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }

    if (data.email && data.email !== existing.email) {
      throw new HttpException('Email cannot be edited', HttpStatus.BAD_REQUEST);
    }

    const updated = await this.prisma.customer.update({
      where: { id },
      data,
    });

    return { message: 'Success!', customer: updated };
  }

  async countCustomers() {
    const count = await this.prisma.customer.count();
    return { count };
  }

  async exportCustomers() {
    const customers = await this.prisma.customer.findMany();

    const csvWriter = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'Id' },
        { id: 'name', title: 'Name' },
        { id: 'email', title: 'Email' },
        { id: 'company', title: 'Company' },
        { id: 'phoneNumber', title: 'Phone Number' },
        { id: 'active', title: 'Active' },
      ],
    });

    const records = customers.map((c) => ({
      id: c.id.toString(),
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      company: c.company,
      phoneNumber: c.phoneNumber,
      active: c.active ? 'Active' : 'In-Active',
    }));

    return csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
  }

  async resetPassword(id: number, password: string) {
    const customer = await this.prisma.customer.findUnique({ where: { id } });

    if (!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    await this.prisma.customer.update({
      where: { id },
      data: { password },
    });

    return { succes: true, message: 'Updated Successfully' };
  }
}
