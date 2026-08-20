import { IsString, MaxLength } from 'class-validator';

export class SubmitCommandDto {
  @IsString()
  @MaxLength(300)
  command!: string;

  // Client-generated per-submission key so a retried request never scores
  // (or awards XP for) the same command twice.
  @IsString()
  @MaxLength(200)
  requestKey!: string;
}
