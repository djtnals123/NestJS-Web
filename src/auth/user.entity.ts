import { Role } from './role.entity';
import { Board } from './../board/board.entity';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { LocalDateTransformer } from 'src/common/local-date.transformer';
import { HospitalTransformer } from './hospital.transformer';

@Entity()
@Unique(['username'])
@Unique(['email'])
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column({transformer: new HospitalTransformer})
    hospital: string;

    @OneToMany(type => Board, board => board.user, {eager: false})
    boards: Board[];

    @OneToMany(type => Role, role => role.user, {eager: true})
    roles: Role[];


    @CreateDateColumn({ 
        type: "timestamp", 
        default: () => "CURRENT_TIMESTAMP(6)" ,
        transformer: new LocalDateTransformer('datetime')
    })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updatedAt: Date;

    @Column({ nullable: true, name:'refreshtoken' })
    refreshToken: string;
  
    @Column({ type: 'date', nullable: true, name:'refreshtokenexp' })
    refreshTokenExp: string;

}