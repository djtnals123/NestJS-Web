import { Board } from 'src/board/board.entity';
import { Attachment } from './attachment.entity';
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Attachment)
export class AttachmentRepository extends Repository<Attachment> {
    async createAttachment(board: Board, file: Express.Multer.File): Promise<Attachment>{
        const {originalname, filename} = file;

        const attachment: Attachment = this.create({
            originalname,
            filename,
            board
        });
        await this.save(attachment);
        
        // const attachment: Attachment = await this.createQueryBuilder()
        //     .insert()
        //     .into(Attachment)
        //     .values([
        //         { originalname, filename, board }
        //     ])
        //     .execute()[0];

        return attachment;
    }
}