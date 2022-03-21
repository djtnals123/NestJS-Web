import { Board } from "src/board/board.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Attachment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    originalname: string;

    @Column()
    filename: string;

    @ManyToOne(type => Board, board => board.attachments, { eager: false, onDelete: 'CASCADE', nullable: false })
    board: Board;
}