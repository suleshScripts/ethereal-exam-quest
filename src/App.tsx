import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ExamDetails from "./pages/ExamDetails";
import ExamInstructions from "./pages/ExamInstructions";
import ExamStart from "./pages/ExamStart";
import Result from "./pages/Result";
import History from "./pages/History";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const App = () => (
  <>
    <Toaster />
    <Sonner />
    <BrowserRouter>
      <div className="min-h-screen w-full bg-background">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exam/:examId" element={<ExamDetails />} />
            <Route path="/exam/:examId/instructions" element={<ExamInstructions />} />
            <Route path="/exam/:examId/start" element={<ExamStart />} />
            <Route path="/result/:examId" element={<Result />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  </>
);

export default App;
