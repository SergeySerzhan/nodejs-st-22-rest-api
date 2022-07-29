import { IsNotEmpty, Matches, Max, Min } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  login: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{2,}$/, {
    message: 'Password must contain letters and numbers',
  })
  password: string;

  @Min(4)
  @Max(130)
  age: number;
}
