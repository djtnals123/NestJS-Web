
import { AttachmentRepository } from './attachment.repository';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board } from 'src/board/board.entity';
import { Attachment } from 'src/attachment/attachment.entity';

@Injectable()
export class AttachmentService {
    constructor(
        @InjectRepository(AttachmentRepository)
        private attachmentRepository: AttachmentRepository
    ) {}

    async createAttachment(board: Board, file: Express.Multer.File): Promise<Attachment>{
        delete board.attachments;
        return await this.attachmentRepository.createAttachment(board, file);
    }

    // async addAttachment(board: Board, file: Express.Multer.File): Promise<Attachment>{
    //     const attachment: Attachment = new Attachment();
    //     attachment.originalname = file.originalname;
    //     attachment.filename = file.filename;
    //     board.attachments.push(attachment);
    //     board.save();

    //     await this.attachmentRepository.save(attachment);

    //     return attachment;
    // }


    async getOriginalFileName(filename: string): Promise<string> {
        const attachments: Attachment[] = await this.attachmentRepository.find({filename});
        if(!attachments[0])
            throw new NotFoundException('파일이 없습니다.');
        return attachments[0].originalname;
    }


}
