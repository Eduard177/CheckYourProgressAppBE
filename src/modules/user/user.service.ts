import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';
import { CreateUserDTO } from '../dtos/user.dto';
import { genSaltSync, hashSync } from 'bcrypt';

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
      createdUser.password = await this.hash(createUserDTO.password);
      return await createdUser.save();
    }
    return new BadRequestException('email is already use');
  }

  async getAll() {
    return this.userModel.find();
  }

  async getUserByEmail(email: string): Promise<User | BadRequestException> {
    if (!email) {
      throw new BadRequestException('email must be send');
    }
    email = email.toLocaleLowerCase();
    return this.userModel.findOne({ email });
  }

  async getByEmail(
    email: string,
  ): Promise<User | BadRequestException | NotFoundException> {
    const userEmail = await this.getUserByEmail(email);

    if (!userEmail) {
      throw new NotFoundException('this user dont exist');
    }
    return userEmail;
  }

  async getById(
    id: string,
  ): Promise<User | BadRequestException | NotFoundException> {
    if (!id) {
      throw new BadRequestException('id must be send');
    }
    const userId = this.userModel.findById(id);

    if (!userId) {
      throw new NotFoundException('this user dont exist');
    }
    return userId;
  }

  private async hash(data: string): Promise<string> {
    const salt = genSaltSync(10);
    const hash = hashSync(data, salt);
    return hash;
  }
}
