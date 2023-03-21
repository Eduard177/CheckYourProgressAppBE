import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  CreateExcercises,
  UpdateExcercises,
} from 'src/modules/dtos/excercise.dto';
import { Excercise } from 'src/modules/schemas/excercise.schema';
import { DaysService } from '../days/days.service';
import { UserService } from '../user.service';

@Injectable()
export class ExcerciseService {
  constructor(
    @InjectModel(Excercise.name)
    private excerciseModel: Model<Excercise>,
    private daysService: DaysService,
    private userService: UserService,
  ) {}

  async create(createExcercise: CreateExcercises): Promise<Excercise> {
    const getDay = await this.daysService.getDayById(createExcercise.dayId);
    const user = await this.userService.getById(getDay.get('user')._id);
    if (user.email !== createExcercise.email) {
      throw new BadRequestException('this day is not your');
    }
    const modelExcecise = new this.excerciseModel({
      ...createExcercise,
      day: getDay,
    });
    const excerciseCreate = await this.excerciseModel.create(modelExcecise);
    await this.daysService.addExcercieToDay(getDay.id, excerciseCreate.id);
    return excerciseCreate.save();
  }

  async getAllExcerciseByDay(dayId: string) {
    const day = await this.daysService.getDayById(dayId);
    return this.excerciseModel.find({ day });
  }

  async deleteExcercise(excerciseId: string) {
    const excerciseDeleted = await this.getById(excerciseId);
    await this.daysService.removeExcerciseToDay(
      excerciseDeleted.get('day'),
      excerciseId,
    );
    return this.excerciseModel.deleteOne({ _id: excerciseId });
  }

  async getById(excerciseId: string) {
    return this.excerciseModel.findById(excerciseId);
  }

  async updateExcercise(
    excerciseId: string,
    updateExcercise: UpdateExcercises,
  ) {
    return this.excerciseModel.findByIdAndUpdate(excerciseId, updateExcercise);
  }
}
