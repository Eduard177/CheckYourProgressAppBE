import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Days } from '../schemas/days.schema';

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
  name?: string;
  @ApiProperty()
  weight?: number;
  @ApiProperty()
  @MinLength(2)
  @MaxLength(2)
  weightMeasure?: string;
  @ApiProperty()
  @IsArray()
  days?: Array<Days>;
}
