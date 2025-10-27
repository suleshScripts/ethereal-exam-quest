import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import QuestionCard from "@/components/QuestionCard";
import Timer from "@/components/Timer";
import ProgressBar from "@/components/ProgressBar";
import TranslateButton from "@/components/TranslateButton";
import { mockQuestions, mockExams } from "@/data/mockData";
import { Flag, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Canvas } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";

const BackgroundSpheres = () => {
  return (
    <>
      <Sphere args={[1, 32, 32]} position={[-4, 3, -5]}>
        <meshStandardMaterial
          color="#a259ff"
          emissive="#a259ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </Sphere>
      <Sphere args={[0.7, 32, 32]} position={[4, -2, -8]}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </Sphere>
    </>
  );
};

const ExamStart = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(mockQuestions.length).fill(null)
  );
  const [flagged, setFlagged] = useState<boolean[]>(
    new Array(mockQuestions.length).fill(false)
  );
  const [isMarathi, setIsMarathi] = useState(false);
  const [currentSection] = useState(1);

  const exam = mockExams.find((e) => e.id === examId);

  if (!exam) {
    return <div>Exam not found</div>;
  }

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleFlag = () => {
    const newFlagged = [...flagged];
    newFlagged[currentQuestion] = !newFlagged[currentQuestion];
    setFlagged(newFlagged);
    toast({
      title: newFlagged[currentQuestion]
        ? "Question Flagged"
        : "Flag Removed",
      description: newFlagged[currentQuestion]
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

  return (
    <div className="min-h-screen pt-24 pb-16 relative overflow-hidden">
      {/* 3D Background */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <Canvas camera={{ position: [0, 0, 10] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <BackgroundSpheres />
        </Canvas>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Sticky Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-8 sticky top-20"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                Section {currentSection}
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
              current={currentQuestion + 1}
              total={mockQuestions.length}
            />
          </motion.div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-muted-foreground">
                  Question {currentQuestion + 1} of {mockQuestions.length}
                </span>
                {flagged[currentQuestion] && (
                  <span className="flex items-center gap-2 text-sm text-accent">
                    <Flag className="w-4 h-4 fill-current" />
                    Flagged for Review
                  </span>
                )}
              </div>

              <QuestionCard
                question={mockQuestions[currentQuestion]}
                selectedAnswer={answers[currentQuestion]}
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
                disabled={currentQuestion === 0}
                className="px-6 py-3 rounded-full glass-card hover:bg-white/10 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                className={`px-6 py-3 rounded-full font-medium ${
                  flagged[currentQuestion]
                    ? "gradient-accent text-white"
                    : "glass-card hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flag
                    className={`w-5 h-5 ${
                      flagged[currentQuestion] ? "fill-current" : ""
                    }`}
                  />
                  Flag
                </div>
              </motion.button>
            </div>

            <div className="flex gap-4">
              {currentQuestion === mockQuestions.length - 1 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-full gradient-primary text-white font-semibold neon-glow"
                >
                  <div className="flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    Submit Section
                  </div>
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNext}
                  className="px-8 py-3 rounded-full gradient-primary text-white font-semibold neon-glow"
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
            className="glass-card rounded-2xl p-6 mt-8"
          >
            <h3 className="text-sm font-semibold mb-4 text-muted-foreground">
              Question Navigator
            </h3>
            <div className="grid grid-cols-10 gap-2">
              {mockQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`aspect-square rounded-lg font-semibold text-sm transition-all ${
                    currentQuestion === index
                      ? "gradient-primary text-white neon-border"
                      : answers[index] !== null
                      ? "bg-accent/20 text-accent border border-accent/50"
                      : "glass-card hover:bg-white/10"
                  } ${flagged[index] ? "ring-2 ring-accent" : ""}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex gap-6 mt-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded gradient-primary" />
                <span className="text-muted-foreground">Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-accent/20 border border-accent/50" />
                <span className="text-muted-foreground">Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded glass-card" />
                <span className="text-muted-foreground">Not Answered</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ExamStart;
