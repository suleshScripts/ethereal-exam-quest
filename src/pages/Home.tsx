import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sphere } from "@react-three/drei";
import { motion } from "framer-motion";
import ExamCard from "@/components/ExamCard";
import { mockExams } from "@/data/mockData";
import { GraduationCap, Sparkles } from "lucide-react";

const FloatingBook = () => {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group>
        <mesh>
          <boxGeometry args={[2, 3, 0.3]} />
          <meshStandardMaterial color="#a259ff" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.16]}>
          <boxGeometry args={[1.8, 2.8, 0.05]} />
          <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
};

const Home = () => {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative mb-20 overflow-hidden rounded-3xl glass-card p-12"
        >
          <div className="absolute inset-0 gradient-primary opacity-10" />
          
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium">Advanced Online Examination Platform</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl font-bold mb-6 leading-tight"
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
                <button className="px-8 py-4 rounded-full gradient-primary text-white font-semibold neon-glow hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Explore Exams
                  </div>
                </button>
              </motion.div>
            </div>

            <div className="h-[400px] relative">
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <Canvas camera={{ position: [0, 0, 8] }}>
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <pointLight position={[-10, -10, -10]} color="#a259ff" intensity={0.5} />
                  <FloatingBook />
                  <Sphere args={[0.5, 32, 32]} position={[3, 2, 0]}>
                    <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.5} />
                  </Sphere>
                  <Sphere args={[0.3, 32, 32]} position={[-3, -1, 2]}>
                    <meshStandardMaterial color="#ff6ec7" emissive="#ff6ec7" emissiveIntensity={0.5} />
                  </Sphere>
                  <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
                </Canvas>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Available Exams */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Available Examinations</h2>
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
