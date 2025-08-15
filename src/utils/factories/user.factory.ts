import { faker } from '@faker-js/faker'; 
import { User, UserType } from '@prisma/client'; 
import { UserEntity } from '../../user/entities/user.entity'; 
import { CreateUserDto, userType, SetPasswordDto, ForgotPasswordDto, LoginAuthDto, } from '../../user/dtos/user.dto'; 
import { plainToInstance } from 'class-transformer';

export function createUserFactory(overrides: Partial<User> = {}): User 
{ 
    return { 
        id: faker.number.int({ min: 1, max: 9999 }), 
        firstname: faker.person.firstName(), 
        lastname: faker.person.lastName(), 
        email: faker.internet.email(), 
        password: faker.internet.password(), 
        usertype: faker.helpers.arrayElement(Object.values(UserType)), 
        orderExportColumns: 'col1,col2', 
        lastPasUpdate: faker.date.past(), 
        active: true, 
        isBlocked: false, 
        blockMailSent: false, 
        token: faker.string.alphanumeric(10), 
        googleId: faker.string.uuid(), 
        profilePicture: faker.image.avatar(), 
        googleAcessToken: faker.string.alphanumeric(15), 
        CreatedAt: faker.date.past(), 
        ModifiedBy: faker.number.int({ min: 1, max: 100 }), 
        CreatedBy: faker.number.int({ min: 1, max: 100 }), 
        ModifiedAt: faker.date.recent(), 
        ...overrides, 
    }; 
}

export function createUserEntityFactory(overrides: Partial<UserEntity> = {}): UserEntity 
{ 
    return { 
        id: faker.number.int({ min: 1, max: 9999 }), 
        firstName: faker.person.firstName(), 
        lastName: faker.person.lastName(),
        email: faker.internet.email(), 
        password: faker.internet.password(), 
        userType: faker.helpers.arrayElement(Object.values(userType)), 
        orderExportColumns: 'col1,col2', 
        lastPasUpdate: faker.date.past(), 
        active: true, 
        isBlocked: false, 
        blockMailSent: false, 
        token: faker.string.alphanumeric(10), 
        googleId: faker.string.uuid(), 
        profilePicture: faker.image.avatar(), 
        googleAccessToken: faker.string.alphanumeric(15), 
        createdAt: faker.date.past(), 
        modifiedBy: faker.number.int({ min: 1, max: 100 }), 
        createdBy: faker.number.int({ min: 1, max: 100 }), 
        modifiedAt: faker.date.recent(), 
        ...overrides, 
    }; 
} 

export function createUserDtoFactory(overrides: Partial<CreateUserDto> = {}): CreateUserDto 
{ 
    return plainToInstance(CreateUserDto, { 
        id: faker.number.int({ min: 1, max: 1000 }), 
        firstName: faker.person.firstName(), 
        lastName: faker.person.lastName(), 
        email: faker.internet.email(), 
        password: faker.internet.password({ length: 10 }), 
        userType: faker.helpers.arrayElement(Object.values(userType)), 
        active: true, 
        ...overrides, 
    }); 
} 

export const createSetPasswordDto = (overrides: Partial<SetPasswordDto> = {}) => plainToInstance(SetPasswordDto, 
    { 
        token: faker.string.uuid(), 
        password: faker.internet.password({ length: 10 }), 
        ...overrides, 
    }
); 

export const createForgotPasswordDto = (overrides: Partial<ForgotPasswordDto> = {}) => plainToInstance(ForgotPasswordDto, 
    { 
        email: faker.internet.email(), 
        ...overrides, 
    }
); 

export const createLoginAuthDto = (overrides: Partial<LoginAuthDto> = {}) => plainToInstance(LoginAuthDto, 
    { 
        email: faker.internet.email(), 
        password: faker.internet.password({ length: 10 }), 
        ...overrides, 
    }
);