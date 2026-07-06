import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-xl space-y-4 text-center">
        <h1 className="text-4xl font-black text-slate-950 dark:text-white">Page not found</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          This study route does not exist yet. Let’s get you back to the learning space.
        </p>
        <Link to="/dashboard">
          <Button>Go to dashboard</Button>
        </Link>
      </Card>
    </div>
  );
}
