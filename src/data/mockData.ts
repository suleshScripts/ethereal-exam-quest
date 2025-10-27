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

export const mockQuestions: Question[] = [
  {
    id: "q1",
    sectionId: 1,
    questionText: "What is the derivative of x²?",
    questionTextMarathi: "x² चे व्युत्पन्न काय आहे?",
    options: ["2x", "x", "2x²", "x²/2"],
    optionsMarathi: ["२x", "x", "२x²", "x²/२"],
    correctAnswer: 0,
  },
  {
    id: "q2",
    sectionId: 1,
    questionText: "What is the value of π (pi) approximately?",
    questionTextMarathi: "π (पाय) चे अंदाजे मूल्य काय आहे?",
    options: ["3.14", "2.71", "1.41", "1.73"],
    optionsMarathi: ["३.१४", "२.७१", "१.४१", "१.७३"],
    correctAnswer: 0,
  },
  {
    id: "q3",
    sectionId: 1,
    questionText: "Which of the following is a prime number?",
    questionTextMarathi: "खालीलपैकी कोणती मूळ संख्या आहे?",
    options: ["15", "17", "18", "20"],
    optionsMarathi: ["१५", "१७", "१८", "२०"],
    correctAnswer: 1,
  },
  {
    id: "q4",
    sectionId: 1,
    questionText: "What is the square root of 144?",
    questionTextMarathi: "१४४ चे वर्गमूळ काय आहे?",
    options: ["10", "11", "12", "13"],
    optionsMarathi: ["१०", "११", "१२", "१३"],
    correctAnswer: 2,
  },
  {
    id: "q5",
    sectionId: 1,
    questionText: "What is 15% of 200?",
    questionTextMarathi: "२०० चा १५% किती आहे?",
    options: ["25", "30", "35", "40"],
    optionsMarathi: ["२५", "३०", "३५", "४०"],
    correctAnswer: 1,
  },
];

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
