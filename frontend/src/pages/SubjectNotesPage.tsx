import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EmptyState } from '../components/EmptyState';
import { ErrorMessage } from '../components/ErrorMessage';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { NoteEditor } from '../components/NoteEditor';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { aiService } from '../services/ai.service';
import { notesService } from '../services/notes.service';
import { subjectsService } from '../services/subjects.service';
import type { Note, Subject } from '../types';

export function SubjectNotesPage() {
  const { id = '' } = useParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [aiOutput, setAiOutput] = useState('');

  const subjectQuery = useQuery<Subject>({
    queryKey: ['subject', id],
    queryFn: () => subjectsService.get(id),
  });

  const notesQuery = useQuery<Note[]>({
    queryKey: ['notes', id],
    queryFn: () => notesService.list({ subjectId: id }),
  });

  const saveMutation = useMutation({
    mutationFn: async (payload: { title: string; content: string }) => {
      if (selectedNote) {
        return notesService.update(selectedNote.id, payload);
      }

      return notesService.create({
        subjectId: id,
        ...payload,
      });
    },
    onSuccess: async () => {
      setSelectedNote(null);
      await queryClient.invalidateQueries({ queryKey: ['notes', id] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: notesService.remove,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notes', id] });
    },
  });

  const filtered = useMemo(
    () =>
      (notesQuery.data ?? []).filter((note) =>
        `${note.title} ${note.content}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [notesQuery.data, search],
  );

  if (subjectQuery.isLoading || notesQuery.isLoading) {
    return <LoadingSpinner label="Opening your notes workspace..." />;
  }

  if (subjectQuery.isError || !subjectQuery.data || notesQuery.isError) {
    return <ErrorMessage message="We could not load this subject notes workspace." />;
  }

  const subject = subjectQuery.data;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="space-y-5">
        <Card className="space-y-4">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">{subject.code} Notes</h1>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your notes"
          />
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <EmptyState
                title="No notes yet"
                description="Create your first note to capture key tourism ideas."
              />
            ) : (
              filtered.map((note) => (
                <Card key={note.id} className="space-y-3 bg-slate-50 dark:bg-slate-800/60">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100">{note.title}</p>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        Updated {new Date(note.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setSelectedNote(note)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(note.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </div>
                  </div>
                  <p className="line-clamp-4 text-sm leading-6 text-slate-600 dark:text-slate-400">{note.content}</p>
                </Card>
              ))
            )}
          </div>
        </Card>
      </div>
      <div className="space-y-5">
        <NoteEditor
          note={selectedNote}
          subjectId={id}
          onSave={(payload) => saveMutation.mutateAsync(payload)}
          isSaving={saveMutation.isPending}
        />
        <Card className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">AI note helper</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ask AI to summarize or turn your notes into review tools.
              </p>
            </div>
            <Sparkles className="h-5 w-5 text-amber-500" />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={async () => {
                if (!selectedNote) return;
                const response = await aiService.generateNotes({
                  prompt: selectedNote.content,
                  subjectCode: subject.code,
                });
                setAiOutput(response.reply);
              }}
              disabled={!selectedNote}
            >
              Summarize note
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (!selectedNote) return;
                const response = await aiService.generateFlashcards({
                  prompt: selectedNote.content,
                  subjectCode: subject.code,
                });
                setAiOutput(response.reply);
              }}
              disabled={!selectedNote}
            >
              Turn into flashcards
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                if (!selectedNote) return;
                const response = await aiService.generateQuiz({
                  prompt: selectedNote.content,
                  subjectCode: subject.code,
                });
                setAiOutput(response.reply);
              }}
              disabled={!selectedNote}
            >
              Create quiz prompts
            </Button>
          </div>
          {aiOutput ? (
            <Card className="bg-slate-50 dark:bg-slate-800/60">
              <p className="whitespace-pre-line text-sm leading-7 text-slate-700 dark:text-slate-300">{aiOutput}</p>
            </Card>
          ) : null}
        </Card>
      </div>
    </div>
  );
}

