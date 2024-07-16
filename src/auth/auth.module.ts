import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';

import { User } from './entities/user.entity';

import { AuthService } from './auth.service';

import { JwtStrategy } from './strategies/jwt.strategy';



@Module({
  controllers: [AuthController],
  exports: [TypeOrmModule, JwtStrategy],
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // JwtModule.register({ secret: process.env.JWT_SECRET, signOptions: { expiresIn: '6h' } }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return { secret: configService.get('JWT_SECRET'), signOptions: { expiresIn: '6h' } }
      }
    })
  ],
  providers: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule { }