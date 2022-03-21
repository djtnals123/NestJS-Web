import { CurrentUserDto } from './../auth/dto/current.user.dto';
import { BoardDto } from './dto/board.dto';
import { EntityRepository, Repository } from "typeorm";
import { Board } from "./board.entity";

@EntityRepository(Board)
export class BoardRepository extends Repository<Board> {
    async createBoard(dto: BoardDto, user: CurrentUserDto): Promise<Board>{
        const {title, content} = dto;

        const board: Board = this.create({
            title,
            content,
            user
        });
        await this.save(board);

        return board;
    }
}