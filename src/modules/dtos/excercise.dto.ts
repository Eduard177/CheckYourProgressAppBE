import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Length,
} from 'class-validator';

export class CreateExcercises {
  @ApiProperty()
  exercise: string;
  @ApiProperty()
  @IsNumber()
  sets: number;
  @ApiProperty()
  @IsObject()
  repetition: any;
  @ApiProperty()
  @IsObject()
  weight: any;
  @ApiProperty()
  @Length(2)
  @IsString()
  weightMeasure: string;
  @ApiProperty()
  @IsNotEmpty()
  dayId: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class UpdateExcercises {
  @ApiProperty()
  exercise: string;
  @ApiProperty()
  @IsNumber()
  sets: number;
  @ApiProperty()
  @IsObject()
  repetition: any;
  @ApiProperty()
  @IsObject()
  weight: any;
  @ApiProperty()
  @Length(2)
  @IsString()
  weightMeasure: string;
}
