import run from './mascots/mascot-run.svg';
import greet from './mascots/mascot-greet.svg';
import sleep from './mascots/mascot-sleep.svg';
import map from './mascots/mascot-map.svg';
import globe from './mascots/mascot-globe.svg';
import game from './mascots/mascot-game.svg';
import laptop from './mascots/mascot-laptop.svg';
import find from './mascots/mascot-find.svg';
import checklist from './mascots/mascot-checklist.svg';
import celebrate from './mascots/mascot-celebrate.svg';
import goodJob from './mascots/mascot-good-job.svg';
import goodJob2 from './mascots/mascot-good-job-2.svg';
import questionMark from './mascots/mascot-question-mark.svg';
import coolHead from './mascots/mascot-cool-head.svg';
import shockedHead from './mascots/mascot-shocked-head.svg';
import starEyeHead from './mascots/mascot-star-eye-head.svg';
import thinkHead from './mascots/mascot-think-head.svg';
import winkHead from './mascots/mascot-wink-head.svg';
import winkHeadAlt from './mascots/mascot-wink-head-alt.svg';

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
