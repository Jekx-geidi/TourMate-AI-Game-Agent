import { ChatBox } from '../components/ChatBox';
import { Card } from '../components/ui/card';
import { languagePhrases } from '../lib/static-data';
import { aiService } from '../services/ai.service';

export function LanguagePage() {
  return (
    <div className="space-y-6">
      <Card className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-teal-700">
          Language Mode
        </p>
        <h1 className="text-4xl font-black text-slate-950">
          Practice hospitality phrases and tourist conversations.
        </h1>
        <p className="text-sm leading-6 text-slate-600">
          Build confidence with greetings, direction phrases, hotel support language, and
          AI-assisted conversation practice.
        </p>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {languagePhrases.map((phrase) => (
          <Card key={phrase}>
            <p className="text-lg font-semibold text-slate-900">{phrase}</p>
          </Card>
        ))}
      </div>
      <ChatBox
        title="AI conversation practice"
        placeholder="Try: How do I welcome a hotel guest politely?"
        onSend={(message) => aiService.chat({ message, subjectCode: 'FOLA01' })}
      />
    </div>
  );
}

