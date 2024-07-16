import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from 'src/common/decorators/raw-headers.decorator';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

import { User } from './entities/user.entity';

import { UserRoleGuard } from './guards/user-role.guard';

import { ValidRoles } from './interfaces/valid-roles';

import { AuthService } from './auth.service';



@ApiTags('Usuarios')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  public create(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  public loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  public checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('semiprivate')
  @UseGuards(AuthGuard())
  public testingSemiPrivateRoute(
    @GetUser() completeUserData: User,
    @GetUser(['email', 'roles']) specificUserData: User,
    @RawHeaders() rawHeaders: Array<string>
  ) {
    console.log({ completeUserData, specificUserData, rawHeaders });
    return { ok: true, message: 'This is a semiprivate route' };
  }

  @Get('private')
  @RoleProtected(ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  public testingPrivateRoute() {
    return { ok: true, message: 'This is a private route' };
  }

  @Get('fullprivate')
  @Auth(ValidRoles.admin)
  public testingFullPrivateRoute() {
    return { ok: true, message: 'This is a private route' };
  }
}
