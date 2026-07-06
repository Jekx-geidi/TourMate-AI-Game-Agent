import { IsString, MinLength } from 'class-validator';

export class SupabaseAuthDto {
  @IsString()
  @MinLength(20)
  accessToken!: string;
}
