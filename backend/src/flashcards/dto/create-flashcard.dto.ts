import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFlashcardDto {
  @IsString()
  subjectId!: string;

  @IsString()
  @MinLength(2)
  front!: string;

  @IsString()
  @MinLength(2)
  back!: string;

  @IsOptional()
  @IsString()
  category?: string;
}
