import { Prisma, Customer as  PrismaCustomer } from "@prisma/client";
import { CreateCustomerDto, UpdateCustomerDto,  } from "../dtos/customer.dto";
import { CustomerEntity } from "../entities/cutomer.entity";

export class CustomerMapper{
    static toDomain(prismaCustomer:PrismaCustomer):CustomerEntity  {
       return {
        id:prismaCustomer.id,
        firstName:prismaCustomer.firstName,
        lastName:prismaCustomer.lastName,
        email:prismaCustomer.email,
        phoneNumber:prismaCustomer.phoneNumber,
        billingAddress1:prismaCustomer.billingAddress1,
        billingAddress2:prismaCustomer.billingAddress2,
        city:prismaCustomer.city,
        state:prismaCustomer.state,
        postalCode:prismaCustomer.postalCode,
        country:prismaCustomer.country,
        createdAt:prismaCustomer.createdAt,
        modifiedAt:prismaCustomer.updatedAt,
        createdBy:prismaCustomer.createdBy??0,
        modifiedBy:prismaCustomer.modifiedBy??0,
        discount:prismaCustomer.discount??0
       }
    }

    static fromCreateCustomerDto(dto:CreateCustomerDto): Prisma.CustomerCreateInput{
        return {
        firstName:dto.firstName,
        lastName:dto.lastName,
        email:dto.email,
        billingAddress1:dto.billingAddress1,
        billingAddress2:dto.billingAddress2,
        city:dto.city,
        state:dto.state,
        postalCode:dto.postalCode,
        country:dto.country,
        company:dto.company,
        phoneNumber:dto.phoneNumber,
        password:"",
        createdBy:dto.createdBy
        };
    }

    static fromUpdateCustomerDto(dto: UpdateCustomerDto) :Prisma.CustomerUpdateInput{
         return {
        firstName:dto.firstName,
        lastName:dto.lastName,
        email:dto.email,
        billingAddress1:dto.billingAddress1,
        billingAddress2:dto.billingAddress2,
        city:dto.city,
        state:dto.state,
        postalCode:dto.postalCode,
        country:dto.country,
        company:dto.company,
        phoneNumber:dto.phoneNumber,
        password:"",
        createdBy:dto.createdBy,
        modifiedBy:dto.modifiedBy
        };
    }

    
}