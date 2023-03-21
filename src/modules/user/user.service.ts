import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async create(
    createUserDTO: CreateUserDTO,
  ): Promise<User | BadRequestException> {
    const userEmail = await this.getUserByEmail(createUserDTO.email);
    if (!userEmail) {
      const createdUser = await this.userModel.create(createUserDTO);
      createUserDTO.email = createUserDTO.email.toLocaleLowerCase();
      createdUser.password = await hash(createUserDTO.password, 10);
      return createdUser.save();
    }
    return new BadRequestException('email is already use');
  }

  async getAll() {
    return this.userModel.find();
  }

  async getUserByEmail(email: string): Promise<User> {
    if (!email) {
      throw new BadRequestException('email must be send');
    }
    email = email.toLocaleLowerCase();
    return this.userModel.findOne({ email });
  }

  async getByEmail(email: string): Promise<User> {
    const userEmail = await this.getUserByEmail(email);
    if (!userEmail) {
      throw new NotFoundException('this user dont exist');
    }
    return userEmail;
  }

  async getById(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('id must be send');
    }
    const userId = this.userModel.findById(id);

    if (!userId) {
      throw new NotFoundException('this user dont exist');
    }
    return userId;
  }

  async updateUser(id: string, updateUserDTO: UpdateUserDTO) {
    const user = this.getById(id);
    return this.userModel.updateOne(user, { ...updateUserDTO });
  }

  async addDayToUser(userId: string, dayId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $addToSet: { days: dayId } },
      { new: true },
    );
  }

  async removeDayToUser(userId: string, dayId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      { $pull: { days: dayId } },
      { new: true },
    );
  }
}
