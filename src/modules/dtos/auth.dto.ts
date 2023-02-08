import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
export class LoginUserDTO {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty()
  @MinLength(4)
  @IsNotEmpty()
  password!: string;
}

export class ForgetPasswordDTO {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  newPassword: string;
}
