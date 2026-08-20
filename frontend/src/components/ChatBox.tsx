import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Mascot } from './Mascot';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

type Message = {
  role: 'user' | 'assistant';
  content: string;
  provider?: string;
  isError?: boolean;
};

function formatProviderName(value: string) {
  return value.toLowerCase() === 'openrouter' ? 'TOURMATE AGENT' : value;
}

export function ChatBox({
  title,
  subtitle,
  placeholder,
  intro,
  suggestions,
  onSend,
}: {
  title: string;
  subtitle?: string;
  placeholder: string;
  intro?: string;
  suggestions?: string[];
  onSend: (message: string) => Promise<{ reply: string; provider: string }>;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        intro ??
        'How are your studies today? Tell me what you achieved today and I will help you review it step by step.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const send = async (text?: string) => {
    const current = (text ?? input).trim();
    if (!current || isSending) return;
    setMessages((prev) => [...prev, { role: 'user', content: current }]);
    setInput('');
    setIsSending(true);

    try {
      const response = await onSend(current);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.reply, provider: response.provider },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: "Sorry, I couldn't get a response just now. Please try again.",
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <Mascot pose="chatHi" alt="" size="avatar" className="shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            {subtitle ?? 'Warm, beginner-friendly, and focused on real understanding.'}
          </p>
        </div>
      </div>
      <div className="max-h-[26rem] space-y-3 overflow-y-auto rounded-3xl bg-slate-50 dark:bg-slate-800/60 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`flex items-start gap-2 rounded-3xl px-4 py-3 text-sm leading-6 ${
              message.role === 'assistant'
                ? 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300'
                : 'ml-auto max-w-[85%] bg-gradient-to-r from-slate-950 to-cyan-700 text-white'
            }`}
          >
            {message.role === 'assistant' && message.isError ? (
              <Mascot pose="chatError" alt="" size="avatar" className="mt-0.5 h-8 w-8 shrink-0" />
            ) : null}
            <div>
              <p className="whitespace-pre-wrap">{message.content}</p>
              {message.provider ? (
                <p className="mt-2 text-xs uppercase tracking-[0.24em] opacity-70">
                  {formatProviderName(message.provider)}
                </p>
              ) : null}
            </div>
          </div>
        ))}
        {isSending ? (
          <div className="flex items-center gap-2 rounded-3xl bg-white dark:bg-slate-900 px-4 py-3 text-sm text-slate-400">
            <Mascot pose="chatThink" alt="" size="avatar" className="h-8 w-8" />
            Thinking...
          </div>
        ) : null}
      </div>
      {suggestions && suggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              disabled={isSending}
              onClick={() => void send(suggestion)}
              className="rounded-full border border-slate-200 bg-cyan-50 px-3 py-1.5 text-xs font-semibold text-cyan-800 transition hover:bg-cyan-100 disabled:opacity-50 dark:border-cyan-900/60 dark:bg-cyan-950/40 dark:text-cyan-300 dark:hover:bg-cyan-900/40"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
      <div className="flex gap-3">
        <Input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              void send();
            }
          }}
          placeholder={placeholder}
        />
        <Button onClick={() => void send()} disabled={isSending}>
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
