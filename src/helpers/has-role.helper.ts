import { CurrentUserDto } from './../auth/dto/current.user.dto';
import { matchRoles } from "src/auth/roles.guard";

export function hasRole(user: CurrentUserDto, ...roles: string[]): boolean {
    roles.pop();
    return matchRoles(user.roles, roles);
}