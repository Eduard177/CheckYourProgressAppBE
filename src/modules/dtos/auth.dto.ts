import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @MinLength(4)
  @IsNotEmpty()
  password!: string;
}
