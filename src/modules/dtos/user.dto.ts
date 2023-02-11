import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

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
  @ApiProperty()
  weight?: number;
  @ApiProperty()
  @MinLength(2)
  @MaxLength(2)
  weightMeasure?: string;
}

export class UpdateUserDTO {
  @ApiProperty()
  @IsNotEmpty()
  email!: string;
  @ApiProperty()
  @IsNotEmpty()
  password!: string;
}
