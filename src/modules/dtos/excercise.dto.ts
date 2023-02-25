import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateExercises {
  @ApiProperty()
  exercise: string;
  @ApiProperty()
  @IsNumber()
  sets: number;
  @ApiProperty()
  @IsNumber()
  repetition: number;
  @ApiProperty()
  @IsNumber()
  weight: number;
  @ApiProperty()
  @Length(2)
  @IsString()
  weightMeasure: string;
}
