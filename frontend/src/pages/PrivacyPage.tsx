import { Card } from '../components/ui/card';

export function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Card className="space-y-4">
        <h1 className="text-4xl font-black text-slate-950 dark:text-white">Privacy Policy</h1>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          TourMate AI stores user account details, notes, quiz scores, chat logs, and study
          progress.
        </p>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          Passwords must be securely hashed and never stored as plain text.
        </p>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          The app may send study questions to AI providers such as TOURMATE AGENT or Hermes Agent
          to generate learning support.
        </p>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          Users should not send sensitive personal information in the AI chat.
        </p>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          The app is built for educational support and student productivity.
        </p>
      </Card>
    </div>
  );
}

