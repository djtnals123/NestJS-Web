import { AuthModule } from './../auth/auth.module';
import { BoardRepository } from './board.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { MulterModule } from '@nestjs/platform-express/multer/multer.module';
import { AttachmentModule } from 'src/attachment/attachment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardRepository]),
    MulterModule.register({
      dest: './upload',
      limits: {
        fileSize: 1024*1024*10
      }
    }),
    AuthModule,
    AttachmentModule
  ],
  controllers: [BoardController],
  providers: [BoardService]
})
export class BoardModule {}
