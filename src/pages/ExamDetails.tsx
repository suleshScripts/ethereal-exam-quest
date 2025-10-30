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
  BookMarked,
} from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const ExamDetails = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedSet, setSelectedSet] = useState<string | null>(null);

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
    if (!selectedSet) {
      toast({
        title: "Please Select a Question Set",
        description: "Choose one of the 5 available question sets to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful! 🎉",
        description: "You can now start your examination.",
      });
      setTimeout(() => {
        navigate(`/exam/${examId}/instructions/${selectedSet}`);
      }, 1000);
    }, 2000);
  };

  return (
    <div className="flex-1 pt-24 pb-16 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="bg-card border border-border rounded-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-3 gradient-text text-foreground">
                  {exam.title}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {exam.description}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-2">Exam Fee</p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-8 h-8 text-primary" />
                  <span className="text-4xl font-bold gradient-text">
                    {exam.price}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Set Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-8 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <BookMarked className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Select Question Set</h2>
            </div>
            <p className="text-muted-foreground mb-6">
              Choose one of the 5 available question sets. Each set contains 20 unique MCQs.
            </p>
            <div className="grid md:grid-cols-5 gap-4">
              {exam.questionSets.map((set) => (
                <motion.button
                  key={set.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSet(set.id)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    selectedSet === set.id
                      ? "border-primary bg-primary/10 shadow-lg"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {set.setNumber}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {set.title}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Exam Information */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <FileText className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Exam Structure</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  5 Different Question Sets
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  20 MCQs per Set
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Select Any One Set
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card border border-border rounded-lg p-6"
            >
              <Clock className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">Time Allocation</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  {exam.timeAllowed} Minutes Total
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  ~{Math.floor(exam.timeAllowed / 20)} Minute per Question
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" />
                  Auto-submit on Timeout
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-8 mb-8"
          >
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-2xl font-semibold mb-4 text-foreground">Exam Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Bilingual Support (English/Marathi)",
                "Question Flagging for Review",
                "Real-time Progress Tracking",
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
            transition={{ delay: 0.5 }}
            className="text-center"
          >
            <button
              onClick={handlePayment}
              disabled={isProcessing || !selectedSet}
              className="group px-12 py-5 rounded-lg gradient-primary text-white text-lg font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
            {!selectedSet && (
              <p className="text-sm text-red-500 mt-4">
                Please select a question set to continue
              </p>
            )}
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
