import { ExcerciseWeek } from '../schemas/excerciseWeek.schema';

export class CreateUserDTO {
  name!: string;
  email!: string;
  password!: string;
  excerciseWeek?: ExcerciseWeek[];
}

export class UpdateUserDTO {
  name?: string;
  password?: string;
}
