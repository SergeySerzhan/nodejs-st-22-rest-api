import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  login: string;

  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(.+){2,}$/, {
    message: 'Password must contain letters and numbers',
  })
  @IsString()
  @IsOptional()
  password: string;

  @Min(4)
  @Max(130)
  @IsInt()
  @IsOptional()
  age: number;
}
