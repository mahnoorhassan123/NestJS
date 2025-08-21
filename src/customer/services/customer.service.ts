import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from '../dtos/customer.dto';
import { createObjectCsvStringifier } from 'csv-writer';
import * as bcrypt from 'bcryptjs';
import { parseString } from 'xml2js';
import * as request from 'request';

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

  async getAllCustomer() {
    try {
      const customers = await this.prisma.customer.findMany();
      return customers;
    } catch (error) {
      console.error('error fetching all customers', error);

      throw new HttpException(
        'Internal server error while fetching customers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllModalCustomer() {
    try {
      const customers = await this.prisma.customer.findMany({
        where: { hide: false },
      });
      return customers;
    } catch (error) {
      console.error('error fetching all modal customers', error);
      throw new HttpException(
        'Internal server error while fetching customers',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    const hashedPassword = await bcrypt.hash(password, 10);
    await this.prisma.customer.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return { succes: true, message: 'Updated Successfully' };
  }

  async syncCustomers(): Promise<any> {
    const customerUrl =
      'http://quggv.lmprq.servertrust.com/net/WebService.aspx?Login=developer@intrepidcs.com&EncryptedPassword=' +
      process.env.VOLUSION_PASSWORD +
      '&EDI_Name=Generic\\Customers&SELECT_Columns=CustomerID,BillingAddress1,BillingAddress2,City,CompanyName,Country,EmailAddress,FirstName,LastName,PostalCode,State,PhoneNumber';

    const opt = { url: customerUrl };

    return new Promise((resolve, reject) => {
      request(opt, (error, result, body) => {
        if (error) {
          return reject(
            new HttpException('Request failed', HttpStatus.BAD_GATEWAY),
          );
        }

        parseString(body, async (err, parsed) => {
          if (!err && parsed && parsed.xmldata !== undefined) {
            if (parsed.xmldata.Customers !== undefined) {
              await this.prisma.customer.createMany({
                data: parsed.xmldata.Customers,
                skipDuplicates: true,
              });

              resolve({ status: 'updated' });
            } else {
              resolve({ status: 'already updated' });
            }
          } else {
            console.error('Volusion password may have expired');
            resolve({ status: 'volusion password expired' });
          }
        });
      });
    });
  }
}
