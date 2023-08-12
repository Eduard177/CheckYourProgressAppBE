import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtStrategy } from '../auth/jwt.strategy';
import { UserService } from './user.service';

@UseGuards(JwtStrategy)
@ApiBearerAuth()
@ApiTags('user')
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
