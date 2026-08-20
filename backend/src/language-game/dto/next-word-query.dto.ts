import { IsIn } from 'class-validator';
import { LANGUAGE_GAME_MODES, SUPPORTED_LANGUAGE_CODES } from '../language-game.constants';

export class NextWordQueryDto {
  @IsIn(SUPPORTED_LANGUAGE_CODES)
  language!: (typeof SUPPORTED_LANGUAGE_CODES)[number];

  @IsIn(LANGUAGE_GAME_MODES)
  mode!: (typeof LANGUAGE_GAME_MODES)[number];
}
