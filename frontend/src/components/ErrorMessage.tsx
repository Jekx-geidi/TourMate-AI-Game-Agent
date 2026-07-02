import { AlertTriangle } from 'lucide-react';
import { Card } from './ui/card';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="border-rose-200 bg-rose-50/90 text-rose-800">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5" />
        <p className="text-sm font-medium">{message}</p>
      </div>
    </Card>
  );
}

