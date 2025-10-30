import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";
import TranslateButton from "@/components/TranslateButton";
import { mockQuestions, mockExams } from "@/data/mockData";
import { Flag, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ExamStart = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSection, setCurrentSection] = useState(1);
  const [currentQuestionInSection, setCurrentQuestionInSection] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(mockQuestions.length).fill(null)
  );
  const [flagged, setFlagged] = useState<boolean[]>(
    new Array(mockQuestions.length).fill(false)
  );
  const [isMarathi, setIsMarathi] = useState(false);

  useEffect(() => {
    const selectedLanguage = location.state?.selectedLanguage;
    if (selectedLanguage === "marathi") {
      setIsMarathi(true);
    }
  }, [location.state]);

  const exam = mockExams.find((e) => e.id === examId);

  if (!exam) {
    return <div>Exam not found</div>;
  }

  const questionsPerSection = 20;
  const sectionQuestions = mockQuestions.filter(q => q.sectionId === currentSection);
  const currentQuestionIndex = (currentSection - 1) * questionsPerSection + currentQuestionInSection;
  const currentQuestionData = mockQuestions[currentQuestionIndex];

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionInSection < questionsPerSection - 1) {
      setCurrentQuestionInSection(currentQuestionInSection + 1);
    } else if (currentSection < 5) {
      setCurrentSection(currentSection + 1);
      setCurrentQuestionInSection(0);
    }
  };

  const handlePrev = () => {
    if (currentQuestionInSection > 0) {
      setCurrentQuestionInSection(currentQuestionInSection - 1);
    } else if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
      setCurrentQuestionInSection(questionsPerSection - 1);
    }
  };

  const handleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQuestionIndex] = !newFlagged[currentQuestionIndex];
    setFlagged(newFlagged);
    toast({
      title: newFlagged[currentQuestionIndex]
        ? "Question Flagged"
        : "Flag Removed",
      description: newFlagged[currentQuestionIndex]
        ? "You can review this question later"
        : "Question unflagged",
    });
  };

  const handleSubmit = () => {
    const score = answers.reduce((acc, answer, index) => {
      if (answer === mockQuestions[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    navigate(`/result/${examId}`, {
      state: { score, total: mockQuestions.length },
    });
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Section auto-submitted",
      variant: "destructive",
    });
    handleSubmit();
  };

  const isLastQuestion = currentSection === 5 && currentQuestionInSection === questionsPerSection - 1;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-6">
        {/* Sticky Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6 mb-8 sticky top-20"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Section {currentSection} of 5
              </h2>
              <p className="text-sm text-muted-foreground">{exam.title}</p>
            </div>

            <div className="flex items-center gap-4">
              <TranslateButton
                isMarathi={isMarathi}
                onToggle={() => setIsMarathi(!isMarathi)}
              />
              <Timer initialMinutes={exam.timePerSection} onTimeUp={handleTimeUp} />
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <ProgressBar
              current={currentQuestionInSection + 1}
              total={questionsPerSection}
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Section Progress: {currentQuestionInSection + 1} of {questionsPerSection} questions
            </p>
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-foreground">
                  Question {currentQuestionInSection + 1} of {questionsPerSection}
                </span>
                {flagged[currentQuestionIndex] && (
                  <span className="flex items-center gap-2 text-sm text-primary">
                    <Flag className="w-4 h-4 fill-current" />
                    Flagged for Review
                  </span>
                )}
              </div>

              <QuestionCard
                question={currentQuestionData}
                selectedAnswer={answers[currentQuestionIndex]}
                onSelectAnswer={handleSelectAnswer}
                isMarathi={isMarathi}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4 justify-between"
          >
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePrev}
                disabled={currentSection === 1 && currentQuestionInSection === 0}
                className="px-6 py-3 rounded-lg bg-card border border-border hover:bg-muted font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2">
                  <ChevronLeft className="w-5 h-5" />
                  Previous
                </div>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleFlag}
                className={`px-6 py-3 rounded-lg font-medium ${
                  flagged[currentQuestionIndex]
                    ? "bg-primary text-white"
                    : "bg-card border border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flag
                    className={`w-5 h-5 ${
                      flagged[currentQuestionIndex] ? "fill-current" : ""
                    }`}
                  />
                  Flag
                </div>
              </motion.button>
            </div>

            <div className="flex gap-4">
              {isLastQuestion ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-lg gradient-primary text-white font-semibold"
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Submit Exam
                  </div>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-8 py-3 rounded-lg gradient-primary text-white font-semibold"
                >
                  <div className="flex items-center gap-2">
                    {currentQuestionInSection === questionsPerSection - 1 ? 'Next Section' : 'Next'}
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Question Navigator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6 mt-8"
          >
            <h3 className="text-sm font-semibold mb-4 text-foreground">
              Section {currentSection} - Question Navigator
            </h3>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: questionsPerSection }).map((_, index) => {
                const questionIndex = (currentSection - 1) * questionsPerSection + index;
                return (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestionInSection(index)}
                    className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                      currentQuestionInSection === index
                        ? "gradient-primary text-white border-2 border-primary"
                        : answers[questionIndex] !== null
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    } ${flagged[questionIndex] ? "ring-2 ring-purple-500" : ""}`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-6 mt-6 text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded gradient-primary" />
                <span className="text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-green-500" />
                <span className="text-muted-foreground">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gray-200 border border-gray-400" />
                <span className="text-muted-foreground">Not Visited</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-500" />
                <span className="text-muted-foreground">Marked for Review</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExamStart;
