import { IsEmail, IsString, Length, MinLength } from 'class-validator';
export class RegisterDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;

  @IsString()
  @MinLength(8)
  confirmPassword!: string;

  @IsString()
  @Length(6, 6)
  code!: string;
}
