import { User } from 'src/auth/user.entity';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles: string[] = this.reflector.get<string[]>('roles', context.getHandler()) || [];
        const rolesClass: string[] = this.reflector.get<string[]>("roles", context.getClass()) || [];
        const allRoles: string[] = [...roles, ...rolesClass];
        
        const request = context.switchToHttp().getRequest();
        const user: User = request.user;
        return matchRoles(user.roles, allRoles);
    }
}

export function matchRoles(userRoles: Role[], roles: string[]): boolean {
    if(roles.length === 0)
        return true;
    const strUserRoles: string[] = userRoles.map(a => a.role);
    
    if (roles.some(element => strUserRoles.includes(element) )) {
        return true;
    } else {
        return false;
    }
}