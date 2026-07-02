import { IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsString()
  subjectCode?: string;

  @IsOptional()
  @IsString()
  subjectId?: string;
}
