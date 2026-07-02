import { IsOptional, IsString } from 'class-validator';

export class GenerateContentDto {
  @IsString()
  prompt!: string;

  @IsOptional()
  @IsString()
  subjectCode?: string;
}
