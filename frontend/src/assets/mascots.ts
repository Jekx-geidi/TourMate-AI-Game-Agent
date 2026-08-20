import run from './mascots/mascot-run.webp';
import greet from './mascots/mascot-greet.webp';
import sleep from './mascots/mascot-sleep.webp';
import map from './mascots/mascot-map.webp';
import globe from './mascots/mascot-globe.webp';
import game from './mascots/mascot-game.webp';
import laptop from './mascots/mascot-laptop.webp';
import find from './mascots/mascot-find.webp';
import checklist from './mascots/mascot-checklist.webp';
import celebrate from './mascots/mascot-celebrate.webp';
import goodJob from './mascots/mascot-good-job.webp';
import goodJob2 from './mascots/mascot-good-job-2.webp';
import questionMark from './mascots/mascot-question-mark.webp';
import coolHead from './mascots/mascot-cool-head.webp';
import shockedHead from './mascots/mascot-shocked-head.webp';
import starEyeHead from './mascots/mascot-star-eye-head.webp';
import thinkHead from './mascots/mascot-think-head.webp';
import winkHead from './mascots/mascot-wink-head.webp';
import winkHeadAlt from './mascots/mascot-wink-head-alt.webp';

// The TourMate AI Tutor chat widget (ChatBox) uses this dedicated owl mascot set,
// supplied in the CHATBOT TOURMATE/ folder, instead of the poses above.
import chatHi from './mascots/mascot-chat-hi.png';
import chatBusy from './mascots/mascot-chat-busy.png';
import chatCelebrate from './mascots/mascot-chat-celebrate.png';
import chatError from './mascots/mascot-chat-error.png';
import chatFind from './mascots/mascot-chat-find.png';
import chatFinding from './mascots/mascot-chat-finding.png';
import chatGoal from './mascots/mascot-chat-goal.png';
import chatIdea from './mascots/mascot-chat-idea.png';
import chatIdeaAlt from './mascots/mascot-chat-idea-alt.png';
import chatLike from './mascots/mascot-chat-like.png';
import chatSuccess from './mascots/mascot-chat-success.png';
import chatThink from './mascots/mascot-chat-think.png';
import chatWaiting from './mascots/mascot-chat-waiting.png';

// Every pose here is one of the SVGs Riel Jake supplied in the ANIMAL/ folder —
// no new mascot art. See TOURMATE_MASCOT_PLACEMENT.md for the intended state mapping;
// filenames were repointed by pose semantics since the guide predates these assets.
export const MASCOTS = {
  hero: run,
  loading: run,
  wave: greet,
  sleeping: sleep,
  explore: map,
  arMap: globe,
  playGame: game,
  plan: laptop,
  research: find,
  generate: checklist,
  success: celebrate,
  thumbsUp: goodJob,
  thumbsUpAlt: goodJob2,
  thinking: questionMark,
  coolHead,
  shockedHead,
  starEyeHead,
  thinkHead,
  winkHead,
  winkHeadAlt,
  chatHi,
  chatBusy,
  chatCelebrate,
  chatError,
  chatFind,
  chatFinding,
  chatGoal,
  chatIdea,
  chatIdeaAlt,
  chatLike,
  chatSuccess,
  chatThink,
  chatWaiting,
} as const;

export type MascotPose = keyof typeof MASCOTS;
