import { motion } from "framer-motion";
import ExamCard from "@/components/ExamCard";
import { mockExams } from "@/data/mockData";
import { GraduationCap, Sparkles, BookOpen } from "lucide-react";

const Home = () => {
  const scrollToExams = () => {
    document.getElementById('exams-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-20 overflow-hidden rounded-lg bg-card border border-border p-12"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted mb-6"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Advanced Online Examination Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-foreground"
              >
                Master Your{" "}
                <span className="gradient-text">Future</span> with Smart Exams
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-muted-foreground mb-8"
              >
                Take professional exams with advanced features, real-time translation, and detailed analytics.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex gap-4"
              >
                <button 
                  onClick={scrollToExams}
                  className="px-8 py-4 rounded-lg gradient-primary text-white font-semibold hover:opacity-90 transition-opacity"
                >
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Explore Exams
                  </div>
                </button>
              </motion.div>
            </div>

            <div className="h-[400px] relative flex items-center justify-center">
              <motion.div
                animate={{ 
                  y: [0, -20, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-primary"
              >
                <BookOpen size={200} strokeWidth={1.5} />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Available Exams */}
        <motion.div
          id="exams-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-foreground">Available Examinations</h2>
              <p className="text-muted-foreground">
                Choose from our curated collection of professional exams
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockExams.map((exam, index) => (
              <ExamCard key={exam.id} exam={exam} index={index} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
