import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtStrategy } from 'src/modules/auth/jwt.strategy';
import {
  CreateExcercises,
  UpdateExcercises,
} from 'src/modules/dtos/excercise.dto';
import { ExcerciseService } from './excercise.service';

@UseGuards(JwtStrategy)
@ApiBearerAuth()
@ApiTags('excercise')
@Controller('excercise')
export class ExcerciseController {
  constructor(private readonly excerciseServices: ExcerciseService) {}

  @Post('create')
  saveExcercise(@Body() createExcercises: CreateExcercises) {
    return this.excerciseServices.create(createExcercises);
  }

  @Patch('update')
  updateExcercise(
    @Query('excerciseId') excerciseId: string,
    @Body() updateExcercise: UpdateExcercises,
  ) {
    return this.excerciseServices.updateExcercise(excerciseId, updateExcercise);
  }

  @Get('all/:dayId')
  getAllExcerciseByDay(@Param('dayId') dayId: string) {
    return this.excerciseServices.getAllExcerciseByDay(dayId);
  }

  @Delete('delete/:excerciseId')
  deleteExcercise(@Param('excerciseId') excerciseId: string) {
    return this.excerciseServices.deleteExcercise(excerciseId);
  }

  @Get(':id')
  getExcerciseById(@Param('id') id: string) {
    return this.excerciseServices.getById(id);
  }
}
