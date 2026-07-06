import { useState } from 'react';
import axios from 'axios';
import { Bell, Moon, Paintbrush, ShieldAlert, Sun, UserRound } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/use-auth';
import { useGame } from '../hooks/use-game';
import { useTheme } from '../hooks/use-theme';
import { authService } from '../services/auth.service';

function SectionHeader({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-2.5 text-white shadow-pop">
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">{title}</h2>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${
        checked
          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-500'
          : 'bg-slate-300 dark:bg-slate-700'
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
          checked ? 'left-6' : 'left-1'
        }`}
      />
    </button>
  );
}

export function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { stats, level, notificationsEnabled, setNotificationsEnabled, resetProgress } = useGame();

  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const save = async () => {
    setMessage(null);
    if (newPassword && newPassword !== confirmNew) {
      setMessage({ kind: 'error', text: 'New passwords do not match.' });
      return;
    }
    try {
      setSaving(true);
      await authService.updateProfile({
        name: name.trim() || undefined,
        email: email.trim() || undefined,
        currentPassword: currentPassword || undefined,
        newPassword: newPassword || undefined,
      });
      await refreshUser();
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNew('');
      setMessage({ kind: 'ok', text: 'Profile saved!' });
    } catch (error) {
      const detail =
        axios.isAxiosError(error) && error.response?.data?.message
          ? String(error.response.data.message)
          : 'Could not save your profile. Please try again.';
      setMessage({ kind: 'error', text: detail });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-[2rem] brand-gradient p-6 text-white shadow-pop sm:p-8">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="relative flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 text-3xl font-black backdrop-blur">
            {(user?.name ?? 'S').slice(0, 1).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black">{user?.name}</h1>
            <p className="text-sm text-white/80">{user?.email}</p>
            <p className="mt-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur">
              Level {level.level} · {level.title} · {stats.xp} XP
            </p>
          </div>
        </div>
      </div>

      <Card className="space-y-4">
        <SectionHeader
          icon={<UserRound className="h-5 w-5" />}
          title="Profile"
          description="Edit your display name, email, and password."
        />
        {message ? (
          <p
            className={`rounded-xl px-4 py-3 text-sm font-semibold ${
              message.kind === 'ok'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
            }`}
          >
            {message.text}
          </p>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Display name
            </label>
            <Input className="mt-1" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Email
            </label>
            <Input className="mt-1" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Current password
            </label>
            <Input
              className="mt-1"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Required only to change password"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                New password
              </label>
              <Input
                className="mt-1"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Confirm new
              </label>
              <Input
                className="mt-1"
                type="password"
                value={confirmNew}
                onChange={(e) => setConfirmNew(e.target.value)}
              />
            </div>
          </div>
        </div>
        <Button onClick={() => void save()} disabled={saving}>
          {saving ? 'Saving...' : 'Save changes'}
        </Button>
      </Card>

      <Card className="space-y-4">
        <SectionHeader
          icon={<Paintbrush className="h-5 w-5" />}
          title="Appearance"
          description="Choose how TourMate Game looks for you."
        />
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition ${
              theme === 'light'
                ? 'border-violet-500 bg-violet-50 text-violet-800 ring-2 ring-violet-300 dark:bg-violet-950/40 dark:text-violet-300'
                : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            <Sun className="h-4 w-4" /> Light mode
          </button>
          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-bold transition ${
              theme === 'dark'
                ? 'border-violet-500 bg-violet-50 text-violet-800 ring-2 ring-violet-300 dark:bg-violet-950/40 dark:text-violet-300'
                : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400'
            }`}
          >
            <Moon className="h-4 w-4" /> Dark mode
          </button>
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionHeader
          icon={<Bell className="h-5 w-5" />}
          title="Notifications"
          description="Control XP toasts and update notifications (streaks, badges, level ups)."
        />
        <div className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              In-app notifications
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Show XP pop-ups and add streak, badge, and level updates to the bell.
            </p>
          </div>
          <Toggle
            checked={notificationsEnabled}
            onChange={setNotificationsEnabled}
            label="Toggle notifications"
          />
        </div>
      </Card>

      <Card className="space-y-4">
        <SectionHeader
          icon={<ShieldAlert className="h-5 w-5" />}
          title="Advanced"
          description="Careful — these actions cannot be undone."
        />
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/60 dark:bg-rose-950/20">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Reset game progress
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Clears your XP, level, badges, daily challenges, and explored countries on this
              device.
            </p>
          </div>
          {confirmReset ? (
            <div className="flex gap-2">
              <Button
                className="bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
              >
                Yes, reset everything
              </Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                Cancel
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => setConfirmReset(true)}>
              Reset progress
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
