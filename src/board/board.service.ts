import { CurrentUserDto } from './../auth/dto/current.user.dto';
import { BoardRepository } from './board.repository';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardDto } from './dto/board.dto';
import { Board } from './board.entity';
import * as fs from 'fs';
import { AttachmentService } from 'src/attachment/attachment.service';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { Like } from 'typeorm';

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(BoardRepository)
        private boardRepository: BoardRepository,
        private attachmentService: AttachmentService
    ) {}

    async createBoard(dto: BoardDto, file: Express.Multer.File, user: CurrentUserDto): Promise<Board>{
        const board: Board = await this.boardRepository.createBoard(dto, user);
        if(file) 
            await this.attachmentService.createAttachment(board, file);
        
        return board;
    }

    async getBoardById(id: number): Promise <Board> {
        const board: Board = await this.boardRepository.findOne(id); //, {relations: ['user']}
        if(!board)
            throw new NotFoundException(`게시글을 찾을 수 없습니다. id ${id} `);

        return board;
    }

    async renderModify(id: number, user: CurrentUserDto): Promise <Board> {
        const board: Board = await this.getBoardById(id);
        if(board.user.id === user.id) {
            return board;
        } else {
            throw new ForbiddenException('게시글 수정 권한이 없습니다.');
        }
        
    }

    async deleteBoard(id: number, user: CurrentUserDto): Promise<void> {
        const board: Board = await this.getBoardById(id);
        if(board.user.id === user.id) {
            board.remove();
            for(const attachment of board.attachments) {
                fs.unlink('upload/' + attachment.filename, function(err){
                    console.log(err);
                });
            }
        } else {
            throw new ForbiddenException('게시글 삭제 권한이 없습니다.');
        }

        // const result = await this.boardRepository.delete({id, user});
        // if(result.affected === 0) {
        //     throw new NotFoundException(`게시글 번호 ${id} 게시글을 찾을 수 없습니다.`)
        // }
    }

    async updateBoard(id: number, dto: BoardDto, file: Express.Multer.File, user: CurrentUserDto): Promise<Board>{
        const {title, content} = dto;
        const board: Board = await this.getBoardById(id);
        if(board.user.id === user.id) {
            board.title = title;
            board.content = content;
            if(file) {
                if(board.attachments[0]) {
                    fs.unlink('upload/' + board.attachments[0].filename, function(err){
                        console.log(err);
                    });
                    board.attachments[0].remove();
                    board.save();
                }
                await this.attachmentService.createAttachment(board, file);
            }
            await this.boardRepository.save(board);
        } else {
            throw new ForbiddenException('게시글 수정 권한이 없습니다.');
        }
        return board;
    }

    // async getBoardList(): Promise<Board[]> {
    //     return await this.boardRepository.find({
    //         order:{id:'DESC'}
    //     });
    // }

    async paginate(options: IPaginationOptions, searchOption: string, keyword: string): Promise<Pagination<Board>> {
        const conditions: any = {
            order: {id: 'DESC'}
        };

        if(searchOption === 'title') {
            conditions.where = {title: Like(`%${keyword}%`)};
        } else if(searchOption === 'content') {
            conditions.where = {content: Like(`%${keyword}%`)};
        } else if(searchOption == 'title content') {
            conditions.where = [
                {title: Like(`%${keyword}%`)}, 
                {content: Like(`%${keyword}%`)}
            ];
        } else if(searchOption === 'writer') {
            conditions.relations = ["user"];
            conditions.where = {
                user: {username: keyword}
            };
        } 
        
        const pagination: Pagination<Board> = await paginate<Board>(this.boardRepository, options, conditions);
        return pagination;
    }
}