export interface Lesson {
  id: string;
  categoryId: string;
  title: string;
  thaiTitle: string;
  readingTime: string;
  summary: string;
  contentMarkdown: string;
  imageUrl?: string;
  order: number;
}

export interface LessonCategory {
  id: string;
  title: string;
  icon: string; // lucide icon name
  progress: number; // percentage completed
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  options: {
    key: string; // A, B, C, D
    text: string;
  }[];
  correctKey: string; // A, B, C, or D
  explanation: string;
}

export interface QuizSet {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  questions: QuizQuestion[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  iconName: string; // lucide icon name
  unlockedAt?: string;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  email: string;
  level: string; // e.g. "ม.ปลาย", "ม.ต้น"
  points: number;
  completedLessons: string[]; // lesson ids
  unlockedBadges: string[]; // badge ids
  bookmarks: string[]; // lesson ids
  quizScores: { [quizId: string]: number }; // quizId to score
}

export interface VocabTerm {
  term: string;
  translation: string;
  definition: string;
  example: string;
  illustrationDesc?: string;
  relatedTerms: string[];
}

export interface Career {
  title: string;
  thaiTitle: string;
  salary: string;
  responsibilities: string[];
  skills: string[];
  universities: string[];
  careerPath: string;
  iconName: string;
}

export interface EthicsScenario {
  id: string;
  title: string;
  description: string;
  question: string;
  options: {
    key: string;
    text: string;
    tradeoffs: string;
    scoreImpact: number; // e.g. primary points
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  date: string;
  category: string;
}
