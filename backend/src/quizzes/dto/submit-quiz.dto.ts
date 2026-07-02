import { IsArray, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class QuizAnswerDto {
  @IsString()
  questionId!: string;

  @IsString()
  answer!: string;
}

export class SubmitQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuizAnswerDto)
  answers!: QuizAnswerDto[];

  @IsString()
  subjectId!: string;
}
