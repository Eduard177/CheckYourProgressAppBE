import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginUserDTO } from '../dtos/auth.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtServices: JwtService,
  ) {}

  async validateUser(loginUserDTO: LoginUserDTO): Promise<any> {
    const user = await this.userService.getUserByEmail(loginUserDTO.email);
    const checkPass = await compare(loginUserDTO.password, user.password);
    if (!checkPass) {
      throw new BadRequestException('email or password is incorrect');
    }
    const payload = {
      id: user._id,
      name: user.name,
      excerciseWeek: user.excerciseWeek,
    };
    const data = {
      token: this.jwtServices.sign(payload),
    };

    return data;
  }
}
