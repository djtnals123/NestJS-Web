import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "../decorators/match.decorator";
import { UserRole } from "../role.entity";

export enum Hospital {
    S = 'S',
    K = 'K'
}

export class UpdateUserDto {
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    @Matches(/^[a-zA-Z0-9]*$/, {
        message: '비밀번호는 영문과 숫자의 조합만 가능합니다.'
    })
    password: string;

    @Match('password', {
        message: '비밀번호와 비밀번호 확인이 일치하지 않습니다.'
    })
    @IsNotEmpty()
    confirm_password: string;

    @IsEmail()
    @MinLength(8)
    @MaxLength(30)
    email: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(30)
    name: string;

    @IsEnum(Hospital)
    hospital: Hospital;

    @IsEnum(UserRole, { each: true })
    @IsNotEmpty()
    roles: UserRole[];

}
