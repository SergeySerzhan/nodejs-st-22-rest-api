import {
  IsInt,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(.+){2,}$/, {
    message: 'Password must contain letters and numbers',
  })
  @IsString()
  password: string;

  @Min(4)
  @Max(130)
  @IsInt()
  age: number;
}
