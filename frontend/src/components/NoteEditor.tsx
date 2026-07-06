import { useEffect, useState } from 'react';
import type { Note } from '../types';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

type NoteEditorProps = {
  note?: Note | null;
  subjectId: string;
  onSave: (payload: { title: string; content: string }) => Promise<void>;
  isSaving?: boolean;
};

export function NoteEditor({ note, subjectId, onSave, isSaving }: NoteEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    setTitle(note?.title ?? '');
    setContent(note?.content ?? '');
  }, [note, subjectId]);

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {note ? 'Edit note' : 'Create a new note'}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Capture ideas, examples, and review reminders while you study.
        </p>
      </div>
      <Input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Note title"
      />
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Write your tourism study notes here..."
        rows={8}
      />
      <Button
        onClick={() => onSave({ title, content })}
        disabled={!title.trim() || !content.trim() || isSaving}
      >
        {isSaving ? 'Saving...' : note ? 'Update note' : 'Save note'}
      </Button>
    </Card>
  );
}

