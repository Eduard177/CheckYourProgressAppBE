import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LoginUserDTO } from '../dtos/auth.dto';
import { CreateUserDTO } from '../dtos/user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authServices: AuthService,
    private readonly userServices: UserService,
  ) {}

  @Post('register')
  register(@Body() createUserDTO: CreateUserDTO) {
    return this.userServices.create(createUserDTO);
  }

  @Post('login')
  login(@Body() loginUserDTO: LoginUserDTO) {
    return this.authServices.validateUser(loginUserDTO);
  }
}
