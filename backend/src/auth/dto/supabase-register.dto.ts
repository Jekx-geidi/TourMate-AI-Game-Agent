import { IsString, MinLength } from 'class-validator';
import { SupabaseAuthDto } from './supabase-auth.dto';

export class SupabaseRegisterDto extends SupabaseAuthDto {
  @IsString()
  @MinLength(2)
  name!: string;
}
