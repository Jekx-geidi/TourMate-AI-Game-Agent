import { Card } from '../components/ui/card';

export function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <Card className="space-y-4">
        <h1 className="text-4xl font-black text-slate-950 dark:text-white">Terms and Conditions</h1>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          TourMate AI is a study support application. It is designed to help students review,
          practice, and improve their learning habits.
        </p>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          TourMate AI does not replace official school materials, instructors, modules, or
          academic requirements.
        </p>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          AI-generated answers may contain mistakes. Students should verify important
          information with teachers, official references, and school materials.
        </p>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          Users must not use the app for cheating, plagiarism, or academic dishonesty.
        </p>
        <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
          The app is for learning, reviewing, practicing, note-taking, and improving study
          confidence.
        </p>
      </Card>
    </div>
  );
}

