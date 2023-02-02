import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDTO {
  name!: string;
  @IsEmail()
  email!: string;
  @MinLength(4)
  password!: string;
}

export class UpdateUserDTO {
  name?: string;
  password?: string;
}
