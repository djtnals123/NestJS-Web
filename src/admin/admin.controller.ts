import { AdminService } from './admin.service';
import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query, Render, Req, UseGuards } from '@nestjs/common';
import { IPaginationMeta, Pagination } from 'nestjs-typeorm-paginate';
import { User } from 'src/auth/user.entity';
import { CustomPaginationMeta } from 'src/common/custom-pagnation-meta';
import { MyAuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@UseGuards(MyAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
    constructor(private adminService: AdminService) {}
    
    @Render('admin/user_list.hbs')
    @Get('/userlist')
    async signIn(@Req() req, 
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    ) {
        limit = limit > 100 ? 100 : limit;
        const pagination: Pagination<User> = await this.adminService.paginate({
            page,
            limit,
            metaTransformer: (meta: IPaginationMeta): CustomPaginationMeta => new CustomPaginationMeta(
                meta
            ),
        });
        return {...pagination, user: req.user};
    }
}
