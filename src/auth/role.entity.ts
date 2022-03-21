import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

export enum UserRole {
    ADMIN = "admin",
    PATIENT = "patient",
    DOCTOR = "doctor"
}

@Entity()
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: "enum",
        enum: UserRole,
    })
    role: UserRole;

    @ManyToOne(type => User, user => user.roles, { eager: false })
    user: User;

    @Column()
    userId: number;
}