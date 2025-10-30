import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";
import TranslateButton from "@/components/TranslateButton";
import { mockExams } from "@/data/mockData";
import { Flag, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ExamStart = () => {
  const { examId, setId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [flagged, setFlagged] = useState<boolean[]>([]);
  const [isMarathi, setIsMarathi] = useState(false);

  const exam = mockExams.find((e) => e.id === examId);
  const questionSet = exam?.questionSets.find((s) => s.id === setId);

  useEffect(() => {
    const selectedLanguage = location.state?.selectedLanguage;
    if (selectedLanguage === "marathi") {
      setIsMarathi(true);
    }
    if (questionSet) {
      setAnswers(new Array(questionSet.questions.length).fill(null));
      setFlagged(new Array(questionSet.questions.length).fill(false));
    }
  }, [location.state, questionSet]);

  if (!exam || !questionSet) {
    return <div>Exam or Question Set not found</div>;
  }

  const currentQuestion = questionSet.questions[currentQuestionIndex];
  const totalQuestions = questionSet.questions.length;

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
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
      if (answer === questionSet.questions[index].correctAnswer) {
        return acc + 1;
      }
      return acc;
    }, 0);

    navigate(`/result/${examId}/${setId}`, {
      state: { score, total: totalQuestions },
    });
  };

  const handleTimeUp = () => {
    toast({
      title: "Time's Up!",
      description: "Exam auto-submitted",
      variant: "destructive",
    });
    handleSubmit();
  };

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  return (
    <div className="flex-1 pt-24 pb-16 bg-background">
      <div className="container mx-auto px-6">
        {/* Sticky Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-6 mb-8 sticky top-20 z-10"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {exam.title} - {questionSet.title}
              </h2>
              <p className="text-sm text-muted-foreground">20 MCQs • {exam.timeAllowed} Minutes</p>
            </div>

            <div className="flex items-center gap-4">
              <TranslateButton
                isMarathi={isMarathi}
                onToggle={() => setIsMarathi(!isMarathi)}
              />
              <Timer initialMinutes={exam.timeAllowed} onTimeUp={handleTimeUp} />
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
              current={currentQuestionIndex + 1}
              total={totalQuestions}
            />
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Progress: {currentQuestionIndex + 1} of {totalQuestions} questions
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
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                {flagged[currentQuestionIndex] && (
                  <span className="flex items-center gap-2 text-sm text-primary">
                    <Flag className="w-4 h-4 fill-current" />
                    Flagged for Review
                  </span>
                )}
              </div>

              <QuestionCard
                question={currentQuestion}
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
                disabled={currentQuestionIndex === 0}
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
                    Next
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
              Question Navigator
            </h3>
            <div className="grid grid-cols-10 gap-2">
              {questionSet.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                    currentQuestionIndex === index
                      ? "gradient-primary text-white border-2 border-primary"
                      : answers[index] !== null
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  } ${flagged[index] ? "ring-2 ring-purple-500" : ""}`}
                >
                  {index + 1}
                </button>
              ))}
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
