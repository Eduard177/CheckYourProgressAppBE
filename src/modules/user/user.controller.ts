import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserService } from './user.service';

@UseGuards(JwtStrategy)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAllUser() {
    return this.userService.getAll();
  }
  @Get('find')
  getUserByEmail(@Query('email') email: string) {
    return this.userService.getByEmail(email);
  }
  @Get('find/:id')
  getUserById(@Param('id') id: string) {
    return this.userService.getById(id);
  }
}
