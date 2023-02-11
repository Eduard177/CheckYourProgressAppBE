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
import { compareSync, hash } from 'bcrypt';
import { Model } from 'mongoose';
import { LoginUserDTO } from '../dtos/auth.dto';
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
        await user.save();
        await this.mailService.unblockUserEmail(loginUserDTO.email);
        throw new BadRequestException('This User is blocked');
      }
      await this.mailService.sendEmailToMaxTries(loginUserDTO.email);
      throw new BadRequestException('Maximum number of attempts');
    }

    if (!isPasswordMatching) {
      user.loginTries = user.loginTries + 1;
      await user.save();
      throw new NotFoundException('Wrong credential provided');
    }

    if (!user.isConfirmedEmail) {
      throw new BadRequestException('Please confirm your email to login');
    }
    user.isBlocked = false;
    user.loginTries = 0;
    await user.save();

    return user;
  }

  async forgetPassword(newPassword: string, token: string) {
    if (!token) {
      throw new BadRequestException('token must be send');
    }
    const user = await this.jwtServices.verifyAsync(token, {
      secret: jwtConstants.secret,
    });
    await this.userModel.updateOne(
      { email: user.email },
      {
        password: await hash(newPassword, 10),
      },
      (err: any) => {
        if (err) {
          throw new InternalServerErrorException(
            `Wrong credential provided, error: ${err.message}`,
          );
        }
      },
    );
    throw new HttpException('Your password is changed', HttpStatus.OK);
  }

  async unblockUser(token: string) {
    const user = await this.jwtServices.verifyAsync(token, {
      secret: jwtConstants.secret,
    });

    await this.userModel.updateOne(
      { email: user.email },
      {
        isBlocked: false,
        loginTries: 0,
      },
      (err: any) => {
        if (err) {
          throw new InternalServerErrorException(
            `Wrong credential provided, error: ${err.message}`,
          );
        }
      },
    );
    throw new HttpException('Your user is unblock', HttpStatus.OK);
  }

  private convertToToken(user: User) {
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
