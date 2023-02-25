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
    const userEmail = await this.userService.getByEmail(email);
    if (userEmail.isConfirmedEmail && !userEmail.isBlocked) {
      const dayModel = new this.daysModel({
        ...createDay,
        user: userEmail,
      });
      const createDayModel = await this.daysModel.create(dayModel);
      return createDayModel.save();
    }
    throw new BadRequestException(
      userEmail.isBlocked
        ? 'this User is blocked'
        : 'this user needs to activate his account',
    );
  }

  async getAllByUser(email: string) {
    const user = await this.userService.getByEmail(email);
    return this.daysModel.find({ user });
  }

  async deleteDay(_id: string) {
    return this.daysModel.deleteOne({ _id });
  }
}
