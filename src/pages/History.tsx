import { motion } from "framer-motion";
import { mockHistory } from "@/data/mockData";
import { Calendar, TrendingUp, Clock, Award } from "lucide-react";

const History = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-3 gradient-text">
              Examination History
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your progress and review past performance
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <Award className="w-10 h-10 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {mockHistory.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Exams</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <TrendingUp className="w-10 h-10 text-accent mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">
                {(
                  mockHistory.reduce((acc, h) => acc + h.accuracy, 0) /
                  mockHistory.length
                ).toFixed(1)}
                %
              </div>
              <div className="text-sm text-muted-foreground">
                Average Score
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 text-center"
            >
              <Clock className="w-10 h-10 text-secondary mx-auto mb-3" />
              <div className="text-3xl font-bold mb-1">92</div>
              <div className="text-sm text-muted-foreground">Avg Time (min)</div>
            </motion.div>
          </div>

          {/* History List */}
          <div className="space-y-4">
            {mockHistory.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                whileHover={{ x: 8 }}
                className="glass-card rounded-2xl p-6 neon-border group cursor-pointer"
              >
                <div className="flex flex-wrap items-center justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 group-hover:gradient-text transition-all">
                      {item.examTitle}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {new Date(item.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {item.timeTaken}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">
                        Score
                      </div>
                      <div className="text-2xl font-bold gradient-text">
                        {item.score}/{item.totalQuestions}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-muted-foreground mb-1">
                        Accuracy
                      </div>
                      <div
                        className={`text-2xl font-bold ${
                          item.accuracy >= 85
                            ? "text-accent"
                            : item.accuracy >= 60
                            ? "text-primary"
                            : "text-destructive"
                        }`}
                      >
                        {item.accuracy}%
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 rounded-full gradient-primary text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.accuracy}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className={`h-full rounded-full ${
                        item.accuracy >= 85
                          ? "gradient-accent"
                          : item.accuracy >= 60
                          ? "gradient-primary"
                          : "bg-destructive"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default History;
