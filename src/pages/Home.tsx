import { motion } from "framer-motion";
import ExamCard from "@/components/ExamCard";
import { mockExams } from "@/data/mockData";
import { GraduationCap, Sparkles, Trophy, Clock, Shield } from "lucide-react";

const Home = () => {
  const scrollToExams = () => {
    document.getElementById('exams-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 backdrop-blur-sm border border-primary/20">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-primary">Next Generation Examination Platform</span>
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
              Ace Your Exams with{" "}
              <span className="gradient-text">ExamPortal</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
            >
              Choose from 5 subjects, 5 question sets each. Professional MCQ exams with bilingual support, instant results, and comprehensive analytics.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-6 justify-center mb-16"
            >
              <button 
                onClick={scrollToExams}
                className="group px-8 py-4 rounded-full gradient-primary text-white font-bold text-lg hover:scale-105 transition-transform neon-glow"
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-6 h-6" />
                  Start Learning
                </div>
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-3 gap-8 max-w-3xl mx-auto"
            >
              <div className="text-center">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">5</div>
                <div className="text-sm text-muted-foreground">Subjects</div>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">25</div>
                <div className="text-sm text-muted-foreground">Question Sets</div>
              </div>
              <div className="text-center">
                <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-3xl font-bold text-foreground">20</div>
                <div className="text-sm text-muted-foreground">MCQs per Set</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Available Subjects */}
      <section id="exams-section" className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 text-foreground">
              Available <span className="gradient-text">Subjects</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Select your subject and choose from 5 different question sets. Each set contains 20 carefully curated MCQs.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {mockExams.map((exam, index) => (
              <ExamCard key={exam.id} exam={exam} index={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
