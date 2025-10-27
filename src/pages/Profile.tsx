import { motion } from "framer-motion";
import { mockUserProfile, mockHistory } from "@/data/mockData";
import {
  User,
  Mail,
  Calendar,
  Award,
  TrendingUp,
  Trophy,
  Target,
} from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Profile Header */}
          <div className="glass-card rounded-3xl p-8 mb-8 neon-border relative overflow-hidden">
            <div className="absolute inset-0 gradient-primary opacity-5" />

            <div className="relative flex flex-wrap gap-8 items-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="w-32 h-32 rounded-full overflow-hidden neon-glow ring-4 ring-primary/20"
              >
                <img
                  src={mockUserProfile.avatar}
                  alt={mockUserProfile.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2 gradient-text">
                  {mockUserProfile.name}
                </h1>

                <div className="flex flex-wrap gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {mockUserProfile.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined{" "}
                    {new Date(mockUserProfile.joinedDate).toLocaleDateString(
                      "en-IN",
                      { month: "short", year: "numeric" }
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 rounded-full gradient-primary flex items-center justify-center mx-auto mb-3 neon-glow">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div className="text-3xl font-bold gradient-text">
                  #{mockUserProfile.rank}
                </div>
                <div className="text-sm text-muted-foreground">Global Rank</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 text-center group hover:neon-border transition-all"
            >
              <Award className="w-12 h-12 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold mb-2 gradient-text">
                {mockUserProfile.totalExams}
              </div>
              <div className="text-muted-foreground">Exams Completed</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card rounded-2xl p-6 text-center group hover:neon-border transition-all"
            >
              <TrendingUp className="w-12 h-12 text-accent mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold mb-2 gradient-text">
                {mockUserProfile.averageScore}%
              </div>
              <div className="text-muted-foreground">Average Score</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card rounded-2xl p-6 text-center group hover:neon-border transition-all"
            >
              <Target className="w-12 h-12 text-secondary mx-auto mb-4 group-hover:scale-110 transition-transform" />
              <div className="text-4xl font-bold mb-2 gradient-text">
                {mockHistory.filter((h) => h.accuracy >= 85).length}
              </div>
              <div className="text-muted-foreground">Exams Passed (85%+)</div>
            </motion.div>
          </div>

          {/* Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-8"
          >
            <h2 className="text-2xl font-bold mb-6 gradient-text">
              Recent Performance
            </h2>

            <div className="space-y-6">
              {mockHistory.map((item, index) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      {item.examTitle}
                    </span>
                    <span className="text-sm font-bold gradient-text">
                      {item.accuracy}%
                    </span>
                  </div>

                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
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
              ))}
            </div>
          </motion.div>

          {/* Personal Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-8 mt-8"
          >
            <h2 className="text-2xl font-bold mb-6 gradient-text">
              Account Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 rounded-xl glass">
                <User className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Full Name
                  </div>
                  <div className="font-semibold">{mockUserProfile.name}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl glass">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Email Address
                  </div>
                  <div className="font-semibold">{mockUserProfile.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl glass">
                <Calendar className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Member Since
                  </div>
                  <div className="font-semibold">
                    {new Date(mockUserProfile.joinedDate).toLocaleDateString(
                      "en-IN",
                      { day: "numeric", month: "long", year: "numeric" }
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl glass">
                <Trophy className="w-6 h-6 text-primary mt-1" />
                <div>
                  <div className="text-sm text-muted-foreground mb-1">
                    Current Rank
                  </div>
                  <div className="font-semibold">#{mockUserProfile.rank}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
