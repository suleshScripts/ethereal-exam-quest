import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Award, Home, TrendingUp, Clock, Target } from "lucide-react";
import { useEffect, useState } from "react";

const Confetti = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * window.innerWidth,
            y: -20,
            rotate: Math.random() * 360,
          }}
          animate={{
            y: window.innerHeight + 20,
            rotate: Math.random() * 720,
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            delay: Math.random() * 2,
            repeat: Infinity,
          }}
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: [
              "#a259ff",
              "#00d4ff",
              "#ff6ec7",
              "#ffd700",
            ][Math.floor(Math.random() * 4)],
          }}
        />
      ))}
    </div>
  );
};

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const { score = 0, total = 5 } = location.state || {};
  const percentage = ((score / total) * 100).toFixed(1);
  const isPassed = parseFloat(percentage) >= 40;

  useEffect(() => {
    if (isPassed) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  }, [isPassed]);

  const stats = [
    {
      icon: Target,
      label: "Total Questions",
      value: total,
      color: "text-primary",
    },
    {
      icon: Award,
      label: "Correct Answers",
      value: score,
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      label: "Accuracy",
      value: `${percentage}%`,
      color: "text-secondary",
    },
    {
      icon: Clock,
      label: "Time Taken",
      value: "18 min",
      color: "text-foreground",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 relative">
      {showConfetti && <Confetti />}

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Result Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center justify-center w-32 h-32 rounded-full gradient-primary mb-6 neon-glow"
            >
              <Award className="w-16 h-16 text-white" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold mb-4"
            >
              {isPassed ? "Congratulations! 🎉" : "Exam Completed"}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-muted-foreground"
            >
              {isPassed
                ? "You've successfully passed the examination!"
                : "Keep practicing to improve your score!"}
            </motion.p>
          </div>

          {/* Score Circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-3xl p-12 mb-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-primary opacity-5" />

            <div className="relative flex items-center justify-center">
              <div className="relative w-64 h-64">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <motion.circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 120}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 120 }}
                    animate={{
                      strokeDashoffset:
                        2 * Math.PI * 120 * (1 - parseFloat(percentage) / 100),
                    }}
                    transition={{ duration: 2, ease: "easeOut" }}
                    strokeLinecap="round"
                    className="neon-glow"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#a259ff" />
                      <stop offset="100%" stopColor="#00d4ff" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    <div className="text-6xl font-bold gradient-text mb-2">
                      {percentage}%
                    </div>
                    <div className="text-muted-foreground">
                      {score} / {total} Correct
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="glass-card rounded-2xl p-6 text-center"
                >
                  <Icon className={`w-10 h-10 ${stat.color} mx-auto mb-3`} />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <button
              onClick={() => navigate("/")}
              className="px-8 py-4 rounded-full gradient-primary text-white font-semibold neon-glow hover:scale-105 transition-transform"
            >
              <div className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                Back to Home
              </div>
            </button>

            <button
              onClick={() => navigate("/history")}
              className="px-8 py-4 rounded-full glass-card hover:bg-white/10 font-semibold"
            >
              View All Results
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Result;
