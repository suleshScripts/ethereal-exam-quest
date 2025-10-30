import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { mockExams } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronLeft } from "lucide-react";

const ExamInstructions = () => {
  const { examId, setId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("english");
  const [agreedToInstructions, setAgreedToInstructions] = useState(false);

  const exam = mockExams.find((e) => e.id === examId);
  const questionSet = exam?.questionSets.find((s) => s.id === setId);

  if (!exam || !questionSet) {
    return <div>Exam or Question Set not found</div>;
  }

  const handleBegin = () => {
    if (agreedToInstructions) {
      navigate(`/exam/${examId}/start/${setId}`, { state: { selectedLanguage: language } });
    }
  };

  return (
    <div className="flex-1 bg-background pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-8"
        >
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {exam.title} - {questionSet.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              20 Multiple Choice Questions • {exam.timeAllowed} Minutes
            </p>
          </div>

          {/* Instructions Content */}
          <div className="prose prose-sm max-w-none mb-6 space-y-4">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h2 className="text-lg font-bold text-foreground mb-4">
                परीक्षा सूचना / Exam Instructions
              </h2>

              <div className="space-y-4 text-foreground">
                <div>
                  <h3 className="font-semibold mb-2">A. General Instructions / सर्वसामान्य सूचना:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Total Duration: {exam.timeAllowed} minutes / एकूण कालावधी: {exam.timeAllowed} मिनिटे</li>
                    <li>Number of Questions: 20 / प्रश्नांची संख्या: 20</li>
                    <li>
                      All questions are multiple choice type with 4 options each. Only one answer is correct. /
                      सर्व प्रश्न वस्तुनिष्ठ प्रकारचे आहेत. प्रत्येक प्रश्नाला चार पर्याय दिलेले आहेत त्यापैकी केवळ एक उत्तर बरोबर असेल.
                    </li>
                    <li>
                      Press "Save & Next" to save your answer, otherwise it won't be saved. /
                      उत्तराचे जतन करण्यासाठी Save & Next हे बटन दाबा.
                    </li>
                    <li>
                      The remaining time will be displayed by the countdown timer. /
                      उरलेला वेळ countdown timer द्वारे दर्शवला जाईल.
                    </li>
                    <li>
                      When the timer reaches zero, the exam will auto-submit. /
                      जेव्हा timer शून्यावर पोहोचेल, परीक्षा स्वतःहून submit होईल.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">B. Question Status Indicators / प्रश्न स्थिती:</h3>
                  <ul className="list-none space-y-2 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-200 border border-gray-400 rounded"></span>
                      <span>Not Visited / अद्याप भेट दिलेली नाही</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-red-500 rounded"></span>
                      <span>Not Answered / उत्तर दिलेले नाही</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-500 rounded"></span>
                      <span>Answered / उत्तर दिले आहे</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-500 rounded"></span>
                      <span>Marked for Review / पुनरावलोकनासाठी चिन्हांकित</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">C. How to Answer / उत्तर कसे द्यावे:</h3>
                  <ul className="list-none space-y-2 ml-4">
                    <li>• Click on one of the option buttons to select your answer / पर्यायांपैकी एका बटनावर क्लिक करा</li>
                    <li>• Click again on the selected option to deselect / निवड रद्द करण्यासाठी पुन्हा क्लिक करा</li>
                    <li>• Click "Save & Next" to save your answer / उत्तर जतन करण्यासाठी Save & Next दाबा</li>
                    <li>• Use "Mark for Review" to flag questions you want to revisit / पुन्हा पहायचे असल्यास Mark for Review वापरा</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6 pb-6 border-b border-border">
            <label className="block text-sm font-medium mb-2 text-foreground">
              Choose your default language / तुमची डिफॉल्ट भाषा निवडा:
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="-- Select --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="marathi">Marathi / मराठी</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground mt-2">
              You can change the language for individual questions during the exam. /
              परीक्षेदरम्यान तुम्ही वैयक्तिक प्रश्नांसाठी भाषा बदलू शकता.
            </p>
          </div>

          {/* Agreement Checkbox */}
          <div className="mb-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agreedToInstructions}
                onCheckedChange={(checked) => setAgreedToInstructions(checked as boolean)}
              />
              <label htmlFor="agree" className="text-sm text-foreground leading-relaxed cursor-pointer">
                I have read and understood the instructions. I declare that I am not in possession of any prohibited gadgets or materials. I agree that in case of not adhering to the instructions, I shall be liable to disciplinary action.
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleBegin}
              disabled={!agreedToInstructions}
              className="bg-primary hover:bg-primary/90"
            >
              I am ready to begin
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExamInstructions;
