import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Account } from 'src/account/entities/account.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guards';
import { RolesGuard } from './guards/roles.guard';
import { UserPermission } from 'src/user-permissions/entities/user-permission.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      UserPermission
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return {
          secret: process.env.RE_JWT_SECRET,
          signOptions: {
            expiresIn: 604800,
          },
        };
      },
    }),
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard
  ],
  exports: [
    AuthService,
    JwtStrategy,
    PassportModule,
    JwtModule,
  JwtAuthGuard,
  RolesGuard
  ],
})
export class AuthModule {}
