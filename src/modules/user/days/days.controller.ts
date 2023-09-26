import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import { CreateDay } from 'src/modules/dtos/days.dto';
import { DaysService } from './days.service';

@UseGuards(JwtStrategy)
@ApiBearerAuth()
@ApiTags('days')
@Controller('days')
export class DaysController {
  constructor(private readonly daysServices: DaysService) {}

  @Post('create')
  saveDay(@Body() createDay: CreateDay, @Query('id') id: string) {
    return this.daysServices.create(createDay, id);
  }

  @Get(':email')
  getDayByUser(@Param('email') email: string) {
    return this.daysServices.getAllByUser(email);
  }

  @Delete('delete')
  deleteDay(@Body('dayId') dayId: string, @Body('userId') userId: string) {
    return this.daysServices.deleteDay(dayId, userId);
  }

  @Get(':id')
  getDayById(@Param('id') id: string) {
    return this.daysServices.getDayById(id);
  }
}
