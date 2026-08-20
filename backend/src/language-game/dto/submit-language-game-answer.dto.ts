import { IsIn, IsString, IsUUID, MaxLength } from 'class-validator';
import { LANGUAGE_GAME_MODES } from '../language-game.constants';

export class SubmitLanguageGameAnswerDto {
  @IsUUID()
  wordId!: string;

  @IsIn(LANGUAGE_GAME_MODES)
  mode!: (typeof LANGUAGE_GAME_MODES)[number];

  @IsString()
  @MaxLength(200)
  answer!: string;

  // Client-generated per-submission key so a retried request (network
  // hiccup, double-tap on Submit) never awards XP twice for the same round.
  @IsString()
  @MaxLength(200)
  requestKey!: string;
}
