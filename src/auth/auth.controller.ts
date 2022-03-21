import { MyAuthGuard } from './auth.guard';
import { User } from 'src/auth/user.entity';
import { CurrentUserDto } from './dto/current.user.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { Body, Controller, Get, Patch, Post, Redirect, Render, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { UpdateUserDto } from './dto/update-user.dto';
import { AgreeDto } from './dto/agree.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}


    @Render('auth/login_form.hbs')
    @Get('/signin')
    renderSignIn(@Req() req) {
        console.log(req.csrfToken());
        return {
        };
    }

    @UseGuards(AuthGuard('local'))
    @Post('signin')
    async signIn(@Req() req, @Res({ passthrough: true }) res: Response, @Body() dto: SignInDto) {
        const token = await this.authService.getJwtToken(req.user as CurrentUserDto);
        const refreshToken = await this.authService.getRefreshToken(req.user.id);
    
        const secretData = {
            token,
            refreshToken,
        };
   
        res.cookie('auth-cookie', secretData, {httpOnly:true});
        return {
            message:'success', 
            redirect:'/choose_function'
        };
    }

    @UseGuards(MyAuthGuard)
    @Redirect('/auth/signin')
    @Get('logout')
    async logout(@Req() req, @Res() res) {
        await this.authService.logout(req.user.id);
        res.clearCookie('auth-cookie', {httpOnly: true});
    }

    @Render('auth/agree.hbs')
    @Get('/agree')
    renderAgree() {}

    @Post('/agree')
    agree(@Body(ValidationPipe) dto: AgreeDto) {
        return {redirect: 'signup'};
    }

    @Render('auth/join_form.hbs')
    @Get('/signup')
    renderSignUp() {}

    @Render('auth/join_form.hbs')
    @UseGuards(MyAuthGuard)
    @Get('/modify')
    async renderModify(@Req() req): Promise<{ isModifyPage: Boolean; user: User; }> {
        const user: User = await this.authService.getUser(req.user.id);
        return {isModifyPage: true, user};
    }

    @Post('/signup')
    async signUp(@Body(ValidationPipe) dto: SignUpDto): Promise<{ redirect: string; }>{
        await this.authService.signUp(dto);
        return {redirect: 'signin'};
    }

    @UseGuards(MyAuthGuard)
    @Patch('/:id')
    async modify(@Req() req, @Body(ValidationPipe) dto: UpdateUserDto) {
        await this.authService.updateUser(req.user.id, dto);
        return {redirect: '/choose_function' };
    }

    @UseGuards(AuthGuard('refresh'))
    @Get('refresh-tokens')
    async regenerateTokens(@Req() req, @Res({ passthrough: true }) res: Response) {
        const token = await this.authService.getJwtToken(req.user as CurrentUserDto);
        const refreshToken = await this.authService.getRefreshToken(req.user.id);
        const secretData = {
          token,
          refreshToken,
        };
     
        res.cookie('auth-cookie', secretData, {httpOnly:true});
        return   {message:'success'};
    }
}
