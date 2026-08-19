import { IsOptional, IsString } from 'class-validator';

export class ListSimulationsQueryDto {
  @IsOptional()
  @IsString()
  subjectId?: string;
}
