import { Prisma, EndUser as PrismaEndUser } from "@prisma/client";
import { EndUserEntity } from "../entities/endUser.entity";
import { CreateEndUserDto, UpdateEndUserDto } from "../dtos/endUser.dto";

export class EndUserMappers{
    static toDomain (prismaEndUser: PrismaEndUser) : EndUserEntity {
        return{
            id:prismaEndUser.id,
            firstName:prismaEndUser.firstName,
            lastName:prismaEndUser.lastName,
            email:prismaEndUser.email,
            phoneNumber:prismaEndUser.phoneNumber,
            billingAddress1:prismaEndUser.billingAddress1,
            billingAddress2:prismaEndUser.billingAddress2,
            city:prismaEndUser.city,
            state:prismaEndUser.state,
            postalCode:prismaEndUser.postalCode,
            country:prismaEndUser.country,
            createdAt:prismaEndUser.createdAt,
            modifiedAt:prismaEndUser.updatedAt,
            createdBy:prismaEndUser.createdBy??0,
            modifiedBy:prismaEndUser.modifiedBy??0,
            hide:prismaEndUser.hide,
            external:prismaEndUser.external
        }
    }


    static fromCreateEndUserDto(dto:CreateEndUserDto) : Prisma.EndUserCreateInput{
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
            createdBy:dto.createdBy,
            hide:dto.hide,
            external:dto.external
        }
    }


    static fromUpdateEndUserDto(dto:UpdateEndUserDto) : Prisma.EndUserUpdateInput{
        return{
            firstName:dto.firstName,
            lastName:dto.lastName,
        
            billingAddress1:dto.billingAddress1,
            billingAddress2:dto.billingAddress2,
            city:dto.city,
            state:dto.state,
            postalCode:dto.postalCode,
            country:dto.country,
            company:dto.company,
            phoneNumber:dto.phoneNumber,
            createdBy:dto.createdBy,
            modifiedBy:dto.modifiedBy,
            hide:dto.hide,
            external:dto.external
        }
    }
}