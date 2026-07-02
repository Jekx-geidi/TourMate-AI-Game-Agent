import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Card } from '../components/ui/card';
import { authService } from '../services/auth.service';

export function ProfilePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authService.me,
  });

  if (isLoading) return <LoadingSpinner label="Loading your profile..." />;

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h1 className="text-4xl font-black text-slate-950">Profile</h1>
        <p className="text-sm text-slate-600">Review your TourMate AI learner account details.</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-slate-50">
            <p className="text-sm text-slate-500">Name</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{data?.name}</p>
          </Card>
          <Card className="bg-slate-50">
            <p className="text-sm text-slate-500">Email</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{data?.email}</p>
          </Card>
        </div>
      </Card>
    </div>
  );
}

