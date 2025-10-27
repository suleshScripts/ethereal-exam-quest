import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";

interface TimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
}

const Timer = ({ initialMinutes, onTimeUp }: TimerProps) => {
  const [seconds, setSeconds] = useState(initialMinutes * 60);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const percentage = (seconds / (initialMinutes * 60)) * 100;

  const isLowTime = seconds < 60;

  return (
    <motion.div
      animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
      transition={{ duration: 1, repeat: isLowTime ? Infinity : 0 }}
      className="glass-card rounded-2xl p-6 flex items-center gap-4"
    >
      <div className="relative w-20 h-20">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            className="text-muted"
          />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 36}`}
            strokeDashoffset={`${2 * Math.PI * 36 * (1 - percentage / 100)}`}
            className={isLowTime ? "text-destructive" : "text-primary"}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Clock
            className={`w-6 h-6 ${isLowTime ? "text-destructive" : "text-primary"}`}
          />
        </div>
      </div>

      <div>
        <p className="text-sm text-muted-foreground mb-1">Time Remaining</p>
        <p
          className={`text-3xl font-bold ${
            isLowTime ? "text-destructive animate-glow-pulse" : "gradient-text"
          }`}
        >
          {String(minutes).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </p>
      </div>
    </motion.div>
  );
};

export default Timer;
