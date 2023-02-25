import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class CreateDay {
  @ApiProperty()
  @IsString()
  day: string;
  @ApiProperty()
  @IsArray()
  bodyParts: Array<string>;
}
