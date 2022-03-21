import { Role } from "../role.entity";

export class CurrentUserDto {
    id: number;
    name: string;
    username: string;
    roles: Role[];
}