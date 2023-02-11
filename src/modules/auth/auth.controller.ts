import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from '../dtos/auth.dto';
import { CreateUserDTO } from '../dtos/user.dto';
import { AuthService } from './auth.service';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authServices: AuthService) {}

  @Post('register')
  register(@Body() createUserDTO: CreateUserDTO) {
    return this.authServices.register(createUserDTO);
  }

  @Post('login')
  login(@Body() loginUserDTO: LoginUserDTO) {
    return this.authServices.validateUser(loginUserDTO);
  }

  @Get('confirm/:token')
  confirmEmail(@Param('token') token: string) {
    return this.authServices.confirmEmail(token);
  }

  @Get('password/new/:token')
  forgotPassword(
    @Query('newPassword') newPassword: string,
    @Param('token') token: string,
  ) {
    return this.authServices.forgetPassword(newPassword, token);
  }
}
