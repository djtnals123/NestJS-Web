import { Controller, Get, Render, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { User } from './auth/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('choose_function')
  @UseGuards(AuthGuard('refresh'))
  @Render('index/choose_function_form.hbs')    
  chooseFunction(@Req() req): {user: User} {
    return {user: req.user}
  }
}
