import { Controller, Get, Param, StreamableFile, Response, UseGuards } from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { AttachmentService } from './attachment.service';

@UseGuards(RolesGuard)
@Roles('admin', 'doctor')
@Controller('attachment')
export class AttachmentController {
    constructor(private attachmentService: AttachmentService) {}

    @Get('/:filename')
    async getFile(@Response({ passthrough: true }) res, @Param('filename') fileName): Promise<StreamableFile> {
        const originalFileName: string = await this.attachmentService.getOriginalFileName(fileName);
        const file = createReadStream(join(process.cwd(), 'upload/' + fileName));
        file.on('error', function(err) {
            console.log(err);
        });
        res.set({
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${originalFileName}"`
        });

        return new StreamableFile(file);
    }
}
