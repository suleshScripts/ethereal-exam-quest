import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
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
      <div className="min-h-screen w-full bg-background flex flex-col">
        <Navbar />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/exam/:examId" element={<ExamDetails />} />
            <Route path="/exam/:examId/instructions/:setId" element={<ExamInstructions />} />
            <Route path="/exam/:examId/start/:setId" element={<ExamStart />} />
            <Route path="/result/:examId/:setId" element={<Result />} />
            <Route path="/history" element={<History />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </BrowserRouter>
  </>
);

export default App;
