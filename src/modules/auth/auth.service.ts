import {
  BadRequestException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, hashSync } from 'bcrypt';
import { Model } from 'mongoose';
import { ForgetPasswordDTO, LoginUserDTO } from '../dtos/auth.dto';
import { CreateUserDTO } from '../dtos/user.dto';
import { User } from '../schemas/user.schema';
import { UserService } from '../user/user.service';
import { jwtConstants } from './constants';
import { MailManagerService } from './mail-manager/mail-manager.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private userService: UserService,
    private jwtServices: JwtService,
    @Inject(forwardRef(() => MailManagerService))
    private mailService: MailManagerService,
  ) {}

  async validateUser(loginUserDTO: LoginUserDTO): Promise<any> {
    const user = await this.loginTries(loginUserDTO);
    return this.convertToToken(user);
  }

  async register(createUserDTO: CreateUserDTO): Promise<any> {
    const user = await this.userService.create(createUserDTO);
    await this.mailService.confirmationEmail(createUserDTO.email);
    return user;
  }

  async confirmEmail(token: string) {
    try {
      const user = await this.jwtServices.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      await this.userModel.updateOne(
        { _id: user.id },
        {
          isConfirmedEmail: true,
        },
      );
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    throw new HttpException('Your email was confirmed', HttpStatus.OK);
  }

  async loginTries(loginUserDTO: LoginUserDTO): Promise<User> {
    const user = await this.userService.getByEmail(loginUserDTO.email);
    const isPasswordMatching = compareSync(
      loginUserDTO.password,
      user.password,
    );

    if (user.loginTries >= 5) {
      if (!user.isBlocked) {
        user.isBlocked = true;
        user.save();
      }
      await this.mailService.sendEmailToMaxTries(loginUserDTO.email);
      throw new BadRequestException(
        'Maximum number of attempts, this user is blocked',
      );
    }

    if (!isPasswordMatching) {
      user.loginTries = user.loginTries + 1;
      user.save();
      throw new NotFoundException('Wrong credential provided');
    }

    if (!user.isConfirmedEmail) {
      throw new BadRequestException('Please confirm your email to login');
    }
    user.isBlocked = false;
    user.loginTries = 0;
    user.save();

    return user;
  }

  async forgetPassword(forgetPasswordDTO: ForgetPasswordDTO) {
    const user = await this.userService.getByEmail(forgetPasswordDTO.email);
    this.userModel.updateOne(
      { email: user.email },
      {
        password: hashSync(forgetPasswordDTO.newPassword, 10),
      },
      (err: any) => {
        if (err) {
          throw new InternalServerErrorException('Wrong credential provided');
        }
      },
    );
    throw new HttpException('Your password is changed', HttpStatus.OK);
  }

  convertToToken(user: User) {
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    const data = {
      token: this.jwtServices.sign(payload),
    };
    return data;
  }
}
