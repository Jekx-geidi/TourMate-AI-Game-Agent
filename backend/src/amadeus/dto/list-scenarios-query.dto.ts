import { IsIn, IsOptional } from 'class-validator';
import { AMADEUS_DIFFICULTIES } from '../amadeus.constants';

export class ListScenariosQueryDto {
  @IsOptional()
  @IsIn(AMADEUS_DIFFICULTIES)
  difficulty?: (typeof AMADEUS_DIFFICULTIES)[number];
}
