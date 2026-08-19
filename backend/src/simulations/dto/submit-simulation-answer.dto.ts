import { IsString } from 'class-validator';

export class SubmitSimulationAnswerDto {
  @IsString()
  stepId!: string;

  @IsString()
  optionId!: string;
}
