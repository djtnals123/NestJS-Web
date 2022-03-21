import { CurrentUserDto } from './../dto/current.user.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({ usernameField: 'username' } );
  }

  async validate(username: string, password: string): Promise<CurrentUserDto> {
    let user = await this.authService.validateUserCredentials(username, password);

    // if (user == null) {
    //   throw new UnauthorizedException();
    // }
    return user;
  }

  
}