import { RolesGuard } from './../auth/roles.guard';
import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Render, Req, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { BoardService } from './board.service';
import { BoardDto } from './dto/board.dto';
import { Board } from './board.entity';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CustomPaginationMeta } from 'src/common/custom-pagnation-meta';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { CurrentUserDto } from 'src/auth/dto/current.user.dto';
import { MyAuthGuard } from 'src/auth/auth.guard';

@Roles('admin', 'doctor')
@UseGuards(MyAuthGuard, RolesGuard)
@Controller('board')
export class BoardController {
    constructor(private boardService: BoardService){}
    
    // @Get('/')
    // @Render('board/board_list.hbs')
    // async renderBoardList(@Req() req): Promise<{boardList: Board[], user: User}> {
    //     const boardList: Board[] = await this.boardService.getBoardList();
    //     return {boardList, user: req.user};
    // }

    @Render('board/board_list.hbs')
    @Get('/')
    async renderBoardList(@Req() req, 
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('keyword') keyword: string, @Query('option') searchOption: string) {
        limit = limit > 100 ? 100 : limit;
        const pagination: Pagination<Board> = await this.boardService.paginate({
            page,
            limit,
            metaTransformer: (meta: IPaginationMeta): CustomPaginationMeta => new CustomPaginationMeta(
                meta,
                keyword,
                searchOption
            ),
            // route: '',
        }, searchOption, keyword);
        return {...pagination, user: req.user};
    }

    @Render('board/board_write.hbs')
    @Get('/write')
    renderWrite(@Req() req): {user: CurrentUserDto} {
        return {user: req.user}
    }

    @Render('board/board_write.hbs')
    @Get('/modify/:id')
    async renderModify(@Req() req, @Param('id', ParseIntPipe) id: number): 
    Promise<{ 
        isModifyPage: boolean; 
        board: Board; 
        user: CurrentUserDto; 
    }> {
        const board: Board = await this.boardService.renderModify(id, req.user);
        return {isModifyPage: true, board, user: req.user}
    }

    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('attachment'))
    @Post('/')
    async write(@Req() req, @Body() dto: BoardDto, @UploadedFile() file: Express.Multer.File): Promise<{redirect: string}> {
        const board : Board = await this.boardService.createBoard(dto, file, req.user);
        return {redirect: './' + board.id};
    }

    @Render('board/board_read.hbs')
    @Get('/:id')
    async renderRead(@Req() req, @Param('id', ParseIntPipe) id: number): Promise<{board: Board, user: CurrentUserDto}> {
        const board: Board = await this.boardService.getBoardById(id);
        return {board, user: req.user}
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() req): Promise<{redirect: string}>{
        await this.boardService.deleteBoard(id, req.user);
        return {redirect: '.'};
    }

    @UsePipes(ValidationPipe)
    @UseInterceptors(FileInterceptor('attachment'))
    @Patch('/:id')
    async modify(@Req() req, @Param('id', ParseIntPipe) id:number, @Body() dto: BoardDto, 
    @UploadedFile() file: Express.Multer.File): Promise<{redirect: string}> {
        const board : Board = await this.boardService.updateBoard(id, dto, file, req.user);
        return {redirect: '../' + board.id};
    }



    // @Get('/test')
    // @UsePipes(BoardValidationPipe)
    // @Render('login_form.hbs')
    // test(@Query() dto){
    //     console.log(dto);
    //     console.log('12121');
    // }
}
