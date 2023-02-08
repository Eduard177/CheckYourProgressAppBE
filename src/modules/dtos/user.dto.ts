import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  name!: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  @ApiProperty()
  @IsNotEmpty()
  @MinLength(4)
  password!: string;
}

export class UpdateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  email!: string;
  @ApiProperty()
  @IsNotEmpty()
  password!: string;
}
