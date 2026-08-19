import { IsInt, IsOptional, Min } from 'class-validator';

export class StartSimulationSessionDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  version?: number;
}
