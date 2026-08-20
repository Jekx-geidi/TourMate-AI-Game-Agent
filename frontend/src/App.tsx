import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './hooks/use-auth';
import { GameProvider } from './hooks/use-game';
import { ThemeProvider } from './hooks/use-theme';
import { AppShell } from './routes/AppShell';
import { AgentStatusPage } from './pages/AgentStatusPage';
import { AiTutorPage } from './pages/AiTutorPage';
import { DashboardPage } from './pages/DashboardPage';
import { LanguagePage } from './pages/LanguagePage';
import { LandingPage } from './pages/LandingPage';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { LoginPage } from './pages/LoginPage';
import { MapsFlagsPage } from './pages/MapsFlagsPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProgressPage } from './pages/ProgressPage';
import { QuizStudioPage } from './pages/QuizStudioPage';
import { RegisterPage } from './pages/RegisterPage';
import { SubjectDetailPage } from './pages/SubjectDetailPage';
import { SubjectFlashcardsPage } from './pages/SubjectFlashcardsPage';
import { SubjectGamesPage } from './pages/SubjectGamesPage';
import { SubjectLessonsPage } from './pages/SubjectLessonsPage';
import { SubjectNotesPage } from './pages/SubjectNotesPage';
import { SimulationDetailPage } from './pages/SimulationDetailPage';
import { SimulationPlayPage } from './pages/SimulationPlayPage';
import { SimulationResultPage } from './pages/SimulationResultPage';
import { SimulationsPage } from './pages/SimulationsPage';
import { SubjectQuizPage } from './pages/SubjectQuizPage';
import { SubjectStudyModePage } from './pages/SubjectStudyModePage';
import { SubjectTutorPage } from './pages/SubjectTutorPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { TermsPage } from './pages/TermsPage';

const queryClient = new QueryClient();

// Signed-out users start on the landing page; authenticated users go straight to their dashboard.
function RootGate() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner label="Loading TourMate Game..." />;
  return <Navigate to={user ? '/dashboard' : '/welcome'} replace />;
}

const router = createBrowserRouter([
  { path: '/', element: <RootGate /> },
  { path: '/welcome', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/auth/callback', element: <AuthCallbackPage /> },
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
      { path: '/subjects/:id/study', element: <SubjectStudyModePage /> },
      { path: '/subjects/:id/lessons', element: <SubjectLessonsPage /> },
      { path: '/subjects/:id/notes', element: <SubjectNotesPage /> },
      { path: '/subjects/:id/quiz', element: <SubjectQuizPage /> },
      { path: '/subjects/:id/flashcards', element: <SubjectFlashcardsPage /> },
      { path: '/subjects/:id/games', element: <SubjectGamesPage /> },
      { path: '/subjects/:id/tutor', element: <SubjectTutorPage /> },
      { path: '/simulations', element: <SimulationsPage /> },
      { path: '/simulations/:slug', element: <SimulationDetailPage /> },
      { path: '/simulations/:slug/play', element: <SimulationPlayPage /> },
      { path: '/simulation-sessions/:sessionId/results', element: <SimulationResultPage /> },
      { path: '/language', element: <LanguagePage /> },
      { path: '/maps-flags', element: <MapsFlagsPage /> },
      { path: '/quiz-studio', element: <QuizStudioPage /> },
      { path: '/ai-tutor', element: <AiTutorPage /> },
      { path: '/agent-status', element: <AgentStatusPage /> },
      { path: '/profile', element: <ProfilePage /> },
      { path: '/progress', element: <ProgressPage /> },
      { path: '/leaderboard', element: <LeaderboardPage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <GameProvider>
            <RouterProvider router={router} />
          </GameProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
