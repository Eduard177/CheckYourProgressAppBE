import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateDay } from 'src/modules/dtos/days.dto';
import { Days } from 'src/modules/schemas/days.schema';
import { UserService } from '../user.service';

@Injectable()
export class DaysService {
  constructor(
    @InjectModel(Days.name)
    private daysModel: Model<Days>,
    private userService: UserService,
  ) {}

  async create(createDay: CreateDay, email: string): Promise<Days> {
    const user = await this.userService.getByEmail(email);
    if (user.isConfirmedEmail && !user.isBlocked) {
      const dayModel = new this.daysModel({
        ...createDay,
        user: user,
      });
      const createDayModel = await this.daysModel.create(dayModel);
      await this.userService.addDayToUser(user.id, createDayModel.id);
      return createDayModel.save();
    }
    throw new BadRequestException(
      user.isBlocked
        ? 'this User is blocked'
        : 'this user needs to activate his account',
    );
  }

  async getAllByUser(email: string) {
    const user = await this.userService.getByEmail(email);
    return this.daysModel.find({ user });
  }

  async deleteDay(_id: string, userId: string) {
    await this.userService.removeDayToUser(userId, _id);
    return this.daysModel.deleteOne({ _id });
  }

  async getDayById(_id: string) {
    return this.daysModel.findById(_id);
  }

  async addExcercieToDay(dayId: string, exercisesId: string) {
    return this.daysModel.findByIdAndUpdate(
      dayId,
      {
        $addToSet: { exercises: exercisesId },
      },
      { new: true },
    );
  }

  async removeExcerciseToDay(dayId: string, excerciseId: string) {
    return this.daysModel.findByIdAndUpdate(
      dayId,
      {
        $pull: { exercises: excerciseId },
      },
      { new: true },
    );
  }
}
