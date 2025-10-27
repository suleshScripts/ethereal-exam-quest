import { motion } from "framer-motion";
import { Question } from "@/data/mockData";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  isMarathi: boolean;
}

const QuestionCard = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isMarathi,
}: QuestionCardProps) => {
  const questionText = isMarathi
    ? question.questionTextMarathi
    : question.questionText;
  const options = isMarathi ? question.optionsMarathi : question.options;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card rounded-2xl p-8"
    >
      <h3 className="text-xl font-semibold mb-8 text-foreground">
        {questionText}
      </h3>

      <div className="space-y-4">
        {options.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02, x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectAnswer(index)}
            className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
              selectedAnswer === index
                ? "gradient-primary border-primary neon-border text-white"
                : "glass border-border/50 hover:border-primary/50"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                  selectedAnswer === index
                    ? "bg-white text-primary"
                    : "bg-primary/20 text-primary"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="font-medium">{option}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuestionCard;
