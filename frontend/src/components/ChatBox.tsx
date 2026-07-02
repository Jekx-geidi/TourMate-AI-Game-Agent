import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

type Message = { role: 'user' | 'assistant'; content: string; provider?: string };

export function ChatBox({
  title,
  placeholder,
  onSend,
}: {
  title: string;
  placeholder: string;
  onSend: (message: string) => Promise<{ reply: string; provider: string }>;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'How are your studies today? Tell me what you achieved today and I will help you review it step by step.',
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const send = async () => {
    if (!input.trim() || isSending) return;
    const current = input;
    setMessages((prev) => [...prev, { role: 'user', content: current }]);
    setInput('');
    setIsSending(true);

    try {
      const response = await onSend(current);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.reply, provider: response.provider },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm text-slate-500">
          Warm, beginner-friendly, and focused on real understanding.
        </p>
      </div>
      <div className="max-h-[26rem] space-y-3 overflow-y-auto rounded-3xl bg-slate-50 p-4">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-3xl px-4 py-3 text-sm leading-6 ${
              message.role === 'assistant'
                ? 'bg-white text-slate-700'
                : 'ml-auto max-w-[85%] bg-teal-700 text-white'
            }`}
          >
            <p>{message.content}</p>
            {message.provider ? (
              <p className="mt-2 text-xs uppercase tracking-[0.24em] opacity-70">
                {message.provider}
              </p>
            ) : null}
          </div>
        ))}
      </div>
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
