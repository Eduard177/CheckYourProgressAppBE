import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateUserDTO } from '../dtos/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.create(createUserDTO);
  }
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
