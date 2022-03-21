import { SignUpDto } from './dto/sign-up.dto';
import { EntityRepository, Repository } from "typeorm";
import { User } from "./user.entity";
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(dto: SignUpDto): Promise<User>{
        const {username, password, email, name, hospital} = dto;
        const hashedPassword: string = await this.getHashedPassword(password);
        
        const user: User = this.create({
            username,
            password: hashedPassword,
            email,
            name,
            hospital
        });
        try{
            await this.save(user);
        } catch (error) {
            if(error.code === '23505') {
                if(error.detail.includes('(username)')) {
                    throw new ConflictException('이미 존재하는 아이디입니다.');
                } else if(error.detail.includes('(email)')) {
                    throw new ConflictException('이미 존재하는 이메일입니다.');
                }
            } else {
                throw new InternalServerErrorException();
            }
        }

        return user;
    }

    public async getHashedPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        return hashedPassword;
    }
}