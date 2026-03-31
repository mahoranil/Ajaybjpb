export interface UserProfile {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  isPremium?: boolean;
  testsGeneratedCount?: number;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  userAnswer?: number;
}

export interface MCQTestResult {
  id?: string;
  uid: string;
  subject: string;
  topic?: string;
  language: 'Hindi' | 'English';
  questionCount: number;
  score: number;
  totalQuestions: number;
  questions: MCQQuestion[];
  createdAt: string;
}

export interface MainsEvaluationResult {
  id?: string;
  uid: string;
  subject: string;
  question: string;
  answer: string;
  language: 'Hindi' | 'English';
  marks: number;
  totalMarks: number;
  feedback: string;
  createdAt: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
