import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bell, Camera, Moon, Paintbrush, ShieldAlert, Sun, Trash2, Upload, UserRound } from 'lucide-react';
import { SuccessOverlay } from '../components/SuccessOverlay';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { useAuth } from '../hooks/use-auth';
import { useGame } from '../hooks/use-game';
import { useTheme } from '../hooks/use-theme';
import { authService } from '../services/auth.service';

function resizeAvatar(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const size = 420;
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) {
          reject(new Error('Could not prepare this image.'));
          return;
        }
        canvas.width = size;
        canvas.height = size;
        const shortest = Math.min(image.width, image.height);
        const sourceX = (image.width - shortest) / 2;
        const sourceY = (image.height - shortest) / 2;
        context.drawImage(image, sourceX, sourceY, shortest, shortest, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      image.onerror = () => reject(new Error('Could not load this image.'));
      image.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Could not read this file.'));
    reader.readAsDataURL(file);
  });
}

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
      <div className="rounded-2xl bg-gradient-to-br from-[#2E50E6] to-[#00C351] p-2.5 text-white shadow-pop">
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
          ? 'bg-gradient-to-r from-[#2E50E6] to-[#00C351]'
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatarUrl ?? null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [message, setMessage] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setAvatarUrl(user?.avatarUrl ?? null);
  }, [user]);

  const handleAvatarFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setMessage({ kind: 'error', text: 'Please choose an image file.' });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setMessage({ kind: 'error', text: 'Choose an image under 4 MB.' });
      return;
    }
    try {
      setMessage(null);
      setAvatarUrl(await resizeAvatar(file));
    } catch (error) {
      setMessage({
        kind: 'error',
        text: error instanceof Error ? error.message : 'Could not prepare this image.',
      });
    }
  };

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
        avatarUrl,
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
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-3xl font-black backdrop-blur ring-4 ring-white/20">
            {avatarUrl ? (
              <img src={avatarUrl} alt={user?.name ?? 'Profile'} className="h-full w-full object-cover" />
            ) : (
              (user?.name ?? 'S').slice(0, 1).toUpperCase()
            )}
          </div>
          <div>
            <h1 className="text-3xl font-black">{user?.name}</h1>
            <p className="text-sm text-white/80">{user?.email}</p>
            <p className="mt-2 inline-block rounded-full bg-white/20 px-4 py-1 text-sm font-bold backdrop-blur">
              Level {level.level} Â· {level.title} Â· {stats.xp} XP
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
        {message && message.kind === 'error' ? (
          <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
            {message.text}
          </p>
        ) : null}
        {message && message.kind === 'ok' ? (
          <SuccessOverlay message={message.text} onDone={() => setMessage(null)} />
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Profile picture
            </label>
            <div className="mt-2 flex flex-wrap items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/60">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-white text-2xl font-black text-[#2E50E6] ring-1 ring-[#2E50E6]/15 dark:bg-[#0A0A0F] dark:text-[#FFE9F1] dark:ring-white/10">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Profile preview" className="h-full w-full object-cover" />
                ) : (
                  <Camera className="h-7 w-7" />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-gradient-to-r from-[#E62E6B] via-[#2E50E6] to-[#00C351] px-5 py-2.5 text-sm font-semibold text-white shadow-pop transition hover:brightness-110">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload photo
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(event) => void handleAvatarFile(event.target.files?.[0])}
                  />
                </label>
                {avatarUrl ? (
                  <Button variant="outline" onClick={() => setAvatarUrl(null)}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
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
                ? 'border-[#00C351] bg-[#FFE9F1] text-[#E62E6B] ring-2 ring-[#00C351]/25 dark:bg-white/10 dark:text-[#FFE9F1]'
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
                ? 'border-[#00C351] bg-[#FFE9F1] text-[#E62E6B] ring-2 ring-[#00C351]/25 dark:bg-white/10 dark:text-[#FFE9F1]'
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
          description="Careful â€” these actions cannot be undone."
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
