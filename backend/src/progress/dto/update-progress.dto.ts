import { IsInt, IsString, Max, Min } from 'class-validator';

export class UpdateProgressDto {
  @IsString()
  subjectId!: string;

  @IsString()
  category!: string;

  @IsInt()
  @Min(0)
  @Max(100)
  percent!: number;
}
