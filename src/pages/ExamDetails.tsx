import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { mockExams } from "@/data/mockData";
import {
  Clock,
  FileText,
  IndianRupee,
  CheckCircle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ExamDetails = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const exam = mockExams.find((e) => e.id === examId);

  if (!exam) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Exam Not Found</h1>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-full gradient-primary text-white"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful! 🎉",
        description: "You can now start your examination.",
      });
      setTimeout(() => {
        navigate(`/exam/${examId}/start`);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="glass-card rounded-3xl p-8 mb-8 neon-border">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-3 gradient-text">
                  {exam.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {exam.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-2">Exam Fee</p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-8 h-8 text-accent" />
                  <span className="text-4xl font-bold gradient-text">
                    {exam.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6"
            >
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Exam Structure</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {exam.sections} Sections
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {exam.questionsPerSection} Questions per Section
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Total {exam.totalQuestions} Questions
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6"
            >
              <Clock className="w-10 h-10 text-secondary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Time Allocation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  {exam.timePerSection} Minutes per Section
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Total {exam.timePerSection * exam.sections} Minutes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  Auto-submit on Timeout
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-8 mb-8"
          >
            <Shield className="w-10 h-10 text-accent mb-4" />
            <h3 className="text-2xl font-semibold mb-4">Exam Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Bilingual Support (English/Marathi)",
                "Question Flagging for Review",
                "Section-wise Time Management",
                "Instant Result Generation",
                "Detailed Performance Analytics",
                "Secure Examination Environment",
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="group px-12 py-5 rounded-full gradient-primary text-white text-lg font-semibold neon-glow hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Processing Payment...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  Pay ₹{exam.price} & Start Exam
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>
            <p className="text-sm text-muted-foreground mt-4">
              Secure payment • Instant access after payment
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExamDetails;
