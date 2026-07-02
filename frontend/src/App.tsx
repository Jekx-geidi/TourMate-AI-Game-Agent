import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './hooks/use-auth';
import { AppShell } from './routes/AppShell';
import { AgentStatusPage } from './pages/AgentStatusPage';
import { AiTutorPage } from './pages/AiTutorPage';
import { DashboardPage } from './pages/DashboardPage';
import { LanguagePage } from './pages/LanguagePage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { MapsFlagsPage } from './pages/MapsFlagsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { RegisterPage } from './pages/RegisterPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { SubjectFlashcardsPage } from './pages/SubjectFlashcardsPage';
import { SubjectGamesPage } from './pages/SubjectGamesPage';
import { SubjectLessonsPage } from './pages/SubjectLessonsPage';
import { SubjectNotesPage } from './pages/SubjectNotesPage';
import { SubjectQuizPage } from './pages/SubjectQuizPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { TermsPage } from './pages/TermsPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/terms', element: <TermsPage /> },
  { path: '/privacy', element: <PrivacyPage /> },
  {
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/subjects', element: <SubjectsPage /> },
      { path: '/subjects/:id', element: <SubjectDetailPage /> },
      { path: '/subjects/:id/lessons', element: <SubjectLessonsPage /> },
      { path: '/subjects/:id/notes', element: <SubjectNotesPage /> },
      { path: '/subjects/:id/quiz', element: <SubjectQuizPage /> },
      { path: '/subjects/:id/flashcards', element: <SubjectFlashcardsPage /> },
      { path: '/subjects/:id/games', element: <SubjectGamesPage /> },
      { path: '/language', element: <LanguagePage /> },
      { path: '/maps-flags', element: <MapsFlagsPage /> },
      { path: '/ai-tutor', element: <AiTutorPage /> },
      { path: '/agent-status', element: <AgentStatusPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/progress', element: <ProgressPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  );
}
