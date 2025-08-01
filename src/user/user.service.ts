import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    create(userData: User) {
        const user = this.userRepository.create(userData);
        return this.userRepository.save(user);
    }


    async findAll() {
        const users = await this.userRepository.find();

        if (users.length === 0) {
            throw new NotFoundException('No users found');
        }

        return users;
    }


    async findOne(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async update(id: number, userData: Partial<User>) {
        const result = await this.userRepository.update(id, userData);

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return this.userRepository.findOneBy({ id });
    }

    async remove(id: number) {
        const result = await this.userRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return { message: `User with ID ${id} deleted successfully` };
    }
}
