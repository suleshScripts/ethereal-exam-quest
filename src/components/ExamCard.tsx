import { motion } from "framer-motion";
import { Clock, FileText, IndianRupee, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Exam } from "@/data/mockData";

interface ExamCardProps {
  exam: Exam;
  index: number;
}

const ExamCard = ({ exam, index }: ExamCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="glass-card rounded-2xl p-6 neon-border group relative overflow-hidden"
    >
      <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-5 transition-opacity" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-xl font-bold text-foreground group-hover:gradient-text transition-all">
            {exam.title}
          </h3>
          {!exam.isPaid && (
            <Lock className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <p className="text-muted-foreground mb-6 line-clamp-2">
          {exam.description}
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <FileText className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {exam.sections} Sections
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              {exam.timePerSection} min/section
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-accent" />
            <span className="text-2xl font-bold gradient-text">
              {exam.price}
            </span>
          </div>

          <Link to={`/exam/${exam.id}`}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 rounded-full gradient-primary text-white font-medium neon-glow"
            >
              View Details
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ExamCard;
