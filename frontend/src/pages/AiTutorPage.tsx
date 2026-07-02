import { useLocation } from 'react-router-dom';
import { ChatBox } from '../components/ChatBox';
import { aiService } from '../services/ai.service';

export function AiTutorPage() {
  const location = useLocation();
  const subjectState = location.state as { subjectCode?: string; subjectId?: string } | null;

  return (
    <ChatBox
      title="TourMate AI Tutor"
      placeholder="Ask: Explain MICE in simple terms..."
      onSend={(message) =>
        aiService.chat({
          message,
          subjectCode: subjectState?.subjectCode,
          subjectId: subjectState?.subjectId,
        })
      }
    />
  );
}

