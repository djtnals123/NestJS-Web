import { Role, UserRole } from './role.entity';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Role)
export class RoleRepository extends Repository<Role> {
    async createRole(userId: number, roles: UserRole[]){
        if(!Array.isArray(roles))
            roles = [roles];
        for(const role of roles) {
            const newRole: Role = this.create({
                role,
                userId
            });
            await this.save(newRole);
        }
    }
}