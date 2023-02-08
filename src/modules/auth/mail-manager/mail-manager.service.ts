import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import * as nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ForgetPasswordDTO } from 'src/modules/dtos/auth.dto';
import { User } from 'src/modules/schemas/user.schema';
import { ConfigService } from 'src/config/config.service';
import { ConfigKeys } from 'src/config/keys/config.keys';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MailManagerService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly configService: ConfigService,
    private readonly jwtServices: JwtService,
  ) {}
  async sendEmail(forgetPasswordDTO: ForgetPasswordDTO) {
    const user = this.userModel.findOne({
      email: forgetPasswordDTO.email,
    });
    if (user) {
      await this.sendEmailToForget(forgetPasswordDTO);
      throw new HttpException(
        `Send Email to ${forgetPasswordDTO.email}`,
        HttpStatus.OK,
      );
    } else {
      throw new NotFoundException('User with this email does not exist');
    }
  }
  private transporter = nodemailer.createTransport({
    host: 'smtp.freesmtpservers.com',
    port: 25,
    secure: false,
    // auth: {
    //   user: `${this.configService.get(ConfigKeys.MAIL_USER)}`,
    //   pass: `${this.configService.get(ConfigKeys.MAIL_PASSWORD)}`,
    // },
  });

  async sendEmailToForget(forgetPasswordDTO: ForgetPasswordDTO) {
    const info = await this.transporter.sendMail({
      from: `'CheckYourProgress enterprise' <${this.configService.get(
        ConfigKeys.MAIL_USER,
      )}>`,
      to: `${forgetPasswordDTO.email}`,
      subject: 'forget password',
      html: this.contentHtmlForget,
    });

    console.log('Message sent', info.messageId);
  }

  async sendEmailToMaxTries(email: string) {
    const info = await this.transporter.sendMail({
      from: `'CheckYourProgress enterprise' <${this.configService.get(
        ConfigKeys.MAIL_USER,
      )}>`,
      to: `${email}`,
      subject: 'Confirm Email',
      html: this.contentHtmlMaxTries,
    });

    console.log('Message sent', info.messageId);
  }

  async confirmationEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    const token = this.convertToToken(user);
    const url = `http://localhost:3000/auth/confirm/${token.token}`;
    const info = await this.transporter.sendMail({
      from: `'CheckYourProgress enterprise' <${this.configService.get(
        ConfigKeys.MAIL_USER,
      )}>`,
      to: `${email}`,
      subject: 'Confirm Email',
      html: `<h1>Please click in this link to activate your acount <a href="${url}">${url}</a></h1>`,
    });
    console.log('Message sent', info.messageId);
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
  contentHtmlForget = `
      <h1><b>Change your password</b></h1>
      <a href="http://localhost:3000/api/users/password/new"><b>New Password</b></a>
      `;

  contentHtmlMaxTries = `
      <h1><b>someone is trying to enter your account, Is you?</b></h1>
      `;
}
