import { Role } from './role.entity';

import { CurrentUserDto } from './dto/current.user.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import * as randomToken from 'rand-token';
import * as moment from 'moment';
import { MoreThanOrEqual } from 'typeorm';
import { UpdateUserDto, Hospital } from './dto/update-user.dto';
import { RoleRepository } from './role.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        @InjectRepository(RoleRepository)
        private roleRepository: RoleRepository,
        private jwtService: JwtService
    ) {}

    public async signUp(dto: SignUpDto): Promise<User> {
        const user: User = await this.userRepository.createUser(dto);
        await this.roleRepository.createRole(user.id, dto.roles);
        return user;
    }

    // async signIn(dto: SignInDto): Promise<{accessToken}> {
    //     const user = await this.validateUserCredentials(dto);

    //     const payload = { username: user.username };
    //     const accessToken = await this.jwtService.sign(payload);
    //     return { accessToken };
    // }

    public async getUser(id: number): Promise<User> {
        return await this.userRepository.findOne({id});
    }

    async updateUser(id: number, dto: UpdateUserDto) {
        let {password, name, email, hospital, roles} = dto;

        password = await this.userRepository.getHashedPassword(password);
        await this.userRepository.update(id, {password, name, email, hospital});
        await this.roleRepository.delete({userId: id});
        
        await this.roleRepository.createRole(id, roles);

        // const values: Array<any> = []
        // if(!Array.isArray(roles))
        //     roles = Array(roles);
        // roles.forEach(function(element) {
        //     values.push({role:element, userId:id});
        // });
        // const role: Role[] = this.roleRepository.create(values);
        // this.roleRepository.save(role);
    }

    public async logout(userId: number) {
        await this.userRepository.update(userId, {
            refreshToken: null, 
            refreshTokenExp: null
        });
    }
    

    public async validateUserCredentials(username: string, password: string):Promise<CurrentUserDto> {
        let user: User = await this.userRepository.findOne({ username });
        if(user && (await bcrypt.compare(password, user.password))) {
            let currentUser = new CurrentUserDto();
            currentUser.id = user.id;
            currentUser.name = user.name;
            currentUser.username = user.username;
            currentUser.roles = user.roles;
         
            return currentUser;
        } else {
            throw new UnauthorizedException('아이디 또는 비밀번호가 일치하지 않습니다.');
        }
     
    }

    public jwtVerify(accessToken, options) {
        return this.jwtService.verify(accessToken, options);
    }

    public jwtDecode(accessToken) {
        return this.jwtService.decode(accessToken) as any;
    }

    public async getJwtToken(user:CurrentUserDto): Promise<string>{
        const payload = {
         ...user
        }
        return this.jwtService.signAsync(payload);
    }

    public async getRefreshToken(userId: number): Promise<string> {
        const userDataToUpdate = {
            refreshToken: randomToken.generate(16),
            refreshTokenExp: moment().add(7, 'days').format('YYYY/MM/DD'),
        };
        await this.userRepository.update(userId, userDataToUpdate);
        return userDataToUpdate.refreshToken;
    }

    public async validRefreshToken(username: string, refreshToken: string): Promise<CurrentUserDto> {
        const currentDate = moment().format('YYYY/MM/DD');
        let user = await this.userRepository.findOne({
            where: {
                username,
                refreshToken,
                refreshTokenExp: MoreThanOrEqual(currentDate),
            },
        });
        if (user) {
            let currentUser = new CurrentUserDto();
            currentUser.id = user.id;
            currentUser.name = user.name;
            currentUser.username = user.username;
            currentUser.roles = user.roles;
        
            return currentUser;
        } else {
            return null;
        }
      }
}
