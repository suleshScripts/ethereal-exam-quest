import { motion } from "framer-motion";
import { Languages } from "lucide-react";

interface TranslateButtonProps {
  isMarathi: boolean;
  onToggle: () => void;
}

const TranslateButton = ({ isMarathi, onToggle }: TranslateButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all ${
        isMarathi
          ? "gradient-accent text-white neon-border"
          : "glass-card hover:bg-white/10"
      }`}
    >
      <Languages className="w-4 h-4" />
      <span>{isMarathi ? "मराठी" : "English"}</span>
    </motion.button>
  );
};

export default TranslateButton;
