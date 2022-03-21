import { CurrentUserDto } from './dto/current.user.dto';
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";

@Injectable()
export class MyAuthGuard extends AuthGuard('jwt') {

  constructor(private readonly authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const cookie_options = {httpOnly:true};

        const accessToken = request.cookies['auth-cookie']?.token;
        if (!accessToken)
            throw new UnauthorizedException('Access token is not set');
        try {
            const isValidAccessToken = this.authService.jwtVerify(accessToken, {secret: 'Secret1234'});
        } catch(err) {  // access token 만료
            console.log(err.message);
            const refreshToken = request.cookies['auth-cookie'].refreshToken;
            if (!refreshToken)
                throw new UnauthorizedException('Refresh token is not set');
            
            const {iat, exp, ...user} = this.authService.jwtDecode(accessToken) as any;
            console.log('iat' + iat, + ' exp' + exp);
            const isValidRefreshToken = await this.authService.validRefreshToken(user.username, refreshToken);
            if (!isValidRefreshToken)
                throw new UnauthorizedException('Refresh token is not valid');
    
            const newAccessToken = await this.authService.getJwtToken(user);
            const newRefreshToken = await this.authService.getRefreshToken(user.id);
            const secretData = {
                token: newAccessToken,
                refreshToken: newRefreshToken,
            };
    
            request.cookies['auth-cookie'] = secretData;
            response.cookie('auth-cookie', secretData, cookie_options);
    
        //   response.clearCookie('auth-cookie', cookie_options);
        }
    return this.activate(context);
  }

  async activate(context: ExecutionContext): Promise<boolean> {
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}