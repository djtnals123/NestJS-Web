import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    async paginate(options: IPaginationOptions): Promise<Pagination<User>> {
        const conditions: any = {
            order: {id: 'DESC'}
        };
        
        const pagination: Pagination<User> = await paginate<User>(this.userRepository, options, conditions);
        return pagination;
    }
}
