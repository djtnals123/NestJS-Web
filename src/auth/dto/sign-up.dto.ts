import { IsEmail, IsIn, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { Match } from "../decorators/match.decorator";
import { UpdateUserDto } from "./update-user.dto";

export class SignUpDto extends UpdateUserDto{
    @IsString()
    @MinLength(8)
    @MaxLength(30)
    username: string;
}
