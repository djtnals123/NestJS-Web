import { AttachmentRepository } from './attachment.repository';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttachmentService } from './attachment.service';
import { AttachmentController } from './attachment.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttachmentRepository]),
  ],
  controllers: [AttachmentController],
  providers: [AttachmentService],
  exports: [AttachmentService]
})
export class AttachmentModule {}
