export interface QuestionSet {
  id: string;
  setNumber: number;
  title: string;
  questions: Question[];
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  price: number;
  timeAllowed: number; // minutes for 20 questions
  questionSets: QuestionSet[];
  isPaid: boolean;
}

export interface Question {
  id: string;
  questionText: string;
  questionTextMarathi: string;
  options: string[];
  optionsMarathi: string[];
  correctAnswer: number;
}

// Generate 20 questions for a question set
const generateQuestionSet = (subjectName: string, setNumber: number): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= 20; i++) {
    questions.push({
      id: `q-${subjectName}-set${setNumber}-${i}`,
      questionText: `${subjectName} - Set ${setNumber} - Question ${i}: What is the value of ${i * setNumber} + ${i}?`,
      questionTextMarathi: `${subjectName} - संच ${setNumber} - प्रश्न ${i}: ${i * setNumber} + ${i} चे मूल्य काय आहे?`,
      options: [
        `${i * setNumber + i}`,
        `${i * setNumber + i + 1}`,
        `${i * setNumber + i - 1}`,
        `${i * setNumber * i}`
      ],
      optionsMarathi: [
        `${i * setNumber + i}`,
        `${i * setNumber + i + 1}`,
        `${i * setNumber + i - 1}`,
        `${i * setNumber * i}`
      ],
      correctAnswer: 0,
    });
  }
  return questions;
};

// Generate 5 question sets for each subject
const generateQuestionSets = (subjectName: string): QuestionSet[] => {
  return Array.from({ length: 5 }, (_, index) => ({
    id: `${subjectName.toLowerCase().replace(/\s+/g, '-')}-set-${index + 1}`,
    setNumber: index + 1,
    title: `Set ${index + 1}`,
    questions: generateQuestionSet(subjectName, index + 1),
  }));
};

export const mockExams: Exam[] = [
  {
    id: "exam-1",
    title: "Mathematics",
    description: "Comprehensive mathematics test covering algebra, calculus, and geometry",
    price: 299,
    timeAllowed: 30,
    questionSets: generateQuestionSets("Mathematics"),
    isPaid: false,
  },
  {
    id: "exam-2",
    title: "Physics",
    description: "Physics examination covering mechanics, thermodynamics, and electromagnetism",
    price: 299,
    timeAllowed: 30,
    questionSets: generateQuestionSets("Physics"),
    isPaid: false,
  },
  {
    id: "exam-3",
    title: "Chemistry",
    description: "Chemistry test including organic, inorganic, and physical chemistry",
    price: 299,
    timeAllowed: 30,
    questionSets: generateQuestionSets("Chemistry"),
    isPaid: false,
  },
  {
    id: "exam-4",
    title: "Biology",
    description: "Biology examination covering botany, zoology, and human physiology",
    price: 299,
    timeAllowed: 30,
    questionSets: generateQuestionSets("Biology"),
    isPaid: false,
  },
  {
    id: "exam-5",
    title: "General Knowledge",
    description: "Comprehensive GK test covering history, geography, and current affairs",
    price: 249,
    timeAllowed: 30,
    questionSets: generateQuestionSets("General Knowledge"),
    isPaid: false,
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
