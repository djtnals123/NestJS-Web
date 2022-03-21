import { RoleRepository } from './role.repository';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule, AuthGuard } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret:'Secret1234',
      signOptions:{
        expiresIn: '1h',
      }
    }),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([RoleRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy, RefreshStrategy],
  exports: [JwtStrategy, PassportModule, AuthService]
})
export class AuthModule {}
