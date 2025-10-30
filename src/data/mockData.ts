export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  sections: number;
  questionsPerSection: number;
  timePerSection: number;
  totalQuestions: number;
  isPaid: boolean;
}

export interface Question {
  id: string;
  sectionId: number;
  questionText: string;
  questionTextMarathi: string;
  options: string[];
  optionsMarathi: string[];
  correctAnswer: number;
}

export const mockExams: Exam[] = [
  {
    id: "exam-1",
    title: "Advanced Mathematics Examination",
    description: "Comprehensive test covering calculus, algebra, and statistics",
    price: 499,
    sections: 5,
    questionsPerSection: 20,
    timePerSection: 20,
    totalQuestions: 100,
    isPaid: false,
  },
  {
    id: "exam-2",
    title: "Computer Science Fundamentals",
    description: "Data structures, algorithms, and programming concepts",
    price: 599,
    sections: 5,
    questionsPerSection: 20,
    timePerSection: 20,
    totalQuestions: 100,
    isPaid: false,
  },
  {
    id: "exam-3",
    title: "General Knowledge & Current Affairs",
    description: "Comprehensive GK test covering history, geography, and current events",
    price: 399,
    sections: 5,
    questionsPerSection: 20,
    timePerSection: 20,
    totalQuestions: 100,
    isPaid: false,
  },
];

// Generate 100 questions across 5 sections (20 questions per section)
const generateQuestions = (): Question[] => {
  const questions: Question[] = [];
  const questionsPerSection = 20;
  const totalSections = 5;

  for (let section = 1; section <= totalSections; section++) {
    for (let i = 1; i <= questionsPerSection; i++) {
      const qNum = (section - 1) * questionsPerSection + i;
      questions.push({
        id: `q${qNum}`,
        sectionId: section,
        questionText: `Section ${section} - Question ${i}: What is the value of ${qNum} + ${i}?`,
        questionTextMarathi: `विभाग ${section} - प्रश्न ${i}: ${qNum} + ${i} चे मूल्य काय आहे?`,
        options: [
          `${qNum + i}`,
          `${qNum + i + 1}`,
          `${qNum + i - 1}`,
          `${qNum * i}`
        ],
        optionsMarathi: [
          `${qNum + i}`,
          `${qNum + i + 1}`,
          `${qNum + i - 1}`,
          `${qNum * i}`
        ],
        correctAnswer: 0,
      });
    }
  }
  return questions;
};

export const mockQuestions: Question[] = generateQuestions();

export interface ExamHistory {
  id: string;
  examTitle: string;
  date: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timeTaken: string;
}

export const mockHistory: ExamHistory[] = [
  {
    id: "history-1",
    examTitle: "Advanced Mathematics Examination",
    date: "2025-01-15",
    score: 85,
    totalQuestions: 100,
    accuracy: 85,
    timeTaken: "95 min",
  },
  {
    id: "history-2",
    examTitle: "Computer Science Fundamentals",
    date: "2025-01-10",
    score: 92,
    totalQuestions: 100,
    accuracy: 92,
    timeTaken: "88 min",
  },
  {
    id: "history-3",
    examTitle: "General Knowledge & Current Affairs",
    date: "2025-01-05",
    score: 78,
    totalQuestions: 100,
    accuracy: 78,
    timeTaken: "98 min",
  },
];

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  totalExams: number;
  averageScore: number;
  rank: number;
  joinedDate: string;
}

export const mockUserProfile: UserProfile = {
  name: "Priya Sharma",
  email: "priya.sharma@example.com",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  totalExams: 12,
  averageScore: 85.5,
  rank: 42,
  joinedDate: "2024-09-15",
};
