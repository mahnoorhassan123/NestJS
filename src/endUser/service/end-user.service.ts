import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEndUserDto, UpdateEndUserDto } from '../dtos/endUser.dto';
import { createObjectCsvStringifier } from 'csv-writer';
import { parseString } from 'xml2js';
import * as request from 'request';
import { EndUserMappers } from '../mappers/endUser.mapper';
@Injectable()
export class EndUserService {
  constructor(private prisma: PrismaService) {}

  async getEndUsers(
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
            { firstName: { contains: q, mode: 'insensitive' } },
            { lastName: { contains: q, mode: 'insensitive' } },
            { email: { contains: q, mode: 'insensitive' } },
            { company: { contains: q, mode: 'insensitive' } },
            { city: { contains: q, mode: 'insensitive' } },
            { country: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {};
    try {
      const [prismaEndUsers, total] = await Promise.all([
        this.prisma.endUser.findMany({
          where: whereClause,
          orderBy: {
            [sortBy]: order.toLowerCase() === 'desc' ? 'desc' : 'asc',
          },
          skip,
          take: limit,
        }),
        this.prisma.endUser.count({ where: whereClause }),
      ]);
      const endUsers=prismaEndUsers.map((endUser)=>{return EndUserMappers.toDomain(endUser)});
      return {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        data: endUsers,
      };
    } catch (error) {
      console.error('error while ');
    }
  }

  async getAllEndUsers() {
    try {
      const prismaEndUsers = await this.prisma.endUser.findMany();
      const endUsers=prismaEndUsers.map((endUser)=>{return EndUserMappers.toDomain(endUser)});
      return endUsers;
    } catch (error) {
      console.error('error fetching all end users', error);
      throw new HttpException(
        'Error fetching all end users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllModalEndUsers() {
    try {
      const prismaEndUsers = await this.prisma.endUser.findMany({
        where: { hide: false },
      });
      const endUsers=prismaEndUsers.map((endUser)=>{return EndUserMappers.toDomain(endUser)});
      return endUsers;
    } catch (error) {
      console.error('error fetching all end users', error);
      throw new HttpException(
        'Error fetching all end users',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEndUserById(id: number) {
    const prismaEndUser = await this.prisma.endUser.findUnique({ where: { id } });
    if (!prismaEndUser) {
      throw new HttpException('End User not found', HttpStatus.NOT_FOUND);
    }
    const endUser=EndUserMappers.toDomain(prismaEndUser);
    return endUser;
  }

  async createEndUser(data: CreateEndUserDto) {
    const exists = await this.prisma.endUser.findUnique({
      where: { email: data.email },
    });
    if (exists) {
      throw new HttpException('End User already exists!', HttpStatus.CONFLICT);
    }
    const endUserData=EndUserMappers.fromCreateEndUserDto(data);
    const prismaEndUser = await this.prisma.endUser.create({ data:endUserData });
    // const endUser=EndUserMappers.toDomain(prismaEndUser)
    return {"status":200,"message":"End User Saved","data":{"fieldCount":0,"affectedRows":1,"insertId":prismaEndUser.id,"serverStatus":2,"warningCount":2,"message":"","protocol41":true,"changedRows":0}}
  }

  async updateEndUser(id: number, data: UpdateEndUserDto) {
    const existing = await this.prisma.endUser.findUnique({ where: { id } });
    if (!existing) {
      throw new HttpException('End User not found', HttpStatus.NOT_FOUND);
    }

    if (data.email && data.email !== existing.email) {
      throw new HttpException('Email cannot be edited', HttpStatus.BAD_REQUEST);
    }
    const endUserData=EndUserMappers.fromUpdateEndUserDto(data);
    const updated = await this.prisma.endUser.update({
      where: { id },
      data:endUserData,
    });
    // const endUser=EndUserMappers.toDomain(updated);
    return {"status":200,"message":"End User Updated","data":{"fieldCount":1,"affectedRows":1,"updateId":updated.id,"serverStatus":2,"warningCount":2,"message":"","protocol41":true,"changedRows":1}}
    
  }

  async countEndUsers() {
    const count = await this.prisma.endUser.count();
    return { count };
  }

  async exportEndUsers() {
    const endUsers = await this.prisma.endUser.findMany();

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

    const records = endUsers.map((c) => ({
      id: c.id.toString(),
      name: `${c.firstName} ${c.lastName}`,
      email: c.email,
      company: c.company,
      phoneNumber: c.phoneNumber,
      active: c.external ? 'Active' : 'In-Active',
    }));

    return csvWriter.getHeaderString() + csvWriter.stringifyRecords(records);
  }

  async syncEndUsers(): Promise<any> {
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
            // Replace with your mailHelper logic if needed
            console.error('Volusion password may have expired');
            resolve({ status: 'volusion password expired' });
          }
        });
      });
    });
  }
}
