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
  const { examId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState("english");
  const [agreedToInstructions, setAgreedToInstructions] = useState(false);

  const exam = mockExams.find((e) => e.id === examId);

  if (!exam) {
    return <div>Exam not found</div>;
  }

  const handleBegin = () => {
    if (agreedToInstructions) {
      navigate(`/exam/${examId}/start`, { state: { selectedLanguage: language } });
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-8"
        >
          {/* Header */}
          <div className="mb-6 pb-6 border-b border-border">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {exam.title}
            </h1>
            <p className="text-sm text-red-600 font-medium">
              The instructions are not available in the chosen language.
            </p>
          </div>

          {/* Instructions Content */}
          <div className="prose prose-sm max-w-none mb-6 space-y-4">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h2 className="text-lg font-bold text-foreground mb-4">
                सूचना कृपया काळजीपूर्वक वाचा
              </h2>

              <div className="space-y-4 text-foreground">
                <div>
                  <h3 className="font-semibold mb-2">A. सर्वसामान्य सूचना:</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>परीक्षेचा एकूण कालावधी: 120 मिनिटे.</li>
                    <li>प्रश्नांची संख्या: 100</li>
                    <li>
                      सर्व प्रश्न वस्तुनिष्ठ प्रकारचे आहेत. प्रत्येक प्रश्नाला चार पर्याय दिलेले आहेत त्यापैकी केवळ एक उत्तर बरोबर असेल.
                    </li>
                    <li>
                      तुमच्या उत्तराचे जतन करण्यासाठी प्रत्येक प्रश्नाचे उत्तर दिल्यानंतर Save & Next हे बटन दाबा, अन्यथा तुमच्या उत्तराचे जतन होणार नाही.
                    </li>
                    <li>स्क्रीनवर एकावेळी एक प्रश्न दर्शवला जाईल.</li>
                    <li>
                      तुम्हाला परीक्षा पूर्ण करण्यासाठी उपलब्ध असलेली वेळ स्क्रीनच्या vail bhaagaatil उजव्या कोपऱ्यातील उलटगणती वेळदर्शकाद्वारे (countdown timer) दर्शविली जाईल. उरलेला वेळ Time Left असा दर्शवला जाईल. परीक्षेच्या सुरुवातीला वेळदर्शक (timer) 120 मिनिटे दर्शवेल, वेळ संपत तसतशी ती हळूहळू कमी होत जाईल. जेव्हा वेळदर्शक (timer) शून्यावर पोहोचेल, परीक्षा स्वतःहून संपुष्टात येईल आणि यंत्रणेद्वारे तुमची उत्तर पत्रिका आपोआप अधीन (सबमिट) होईल.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">B प्रश्न क्रमांक बॉक्स (Question Number Box):</h3>
                  <p className="mb-2">
                    स्क्रीनच्या उजवीकडे दर्शविलेला प्रश्न क्रमांक बॉक्स (Question Number Box) खालीलपैकी एक चिन्ह वापरुन प्रत्येक प्रश्नाची स्थिती दर्शवेल:
                  </p>
                  <ul className="list-none space-y-2 ml-4">
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-gray-200 border border-gray-400 rounded"></span>
                      <span>You have not visited the question yet. / तुम्ही अद्याप प्रश्नाला भेट दिलेली नाही.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-red-500 rounded"></span>
                      <span>You have not answered the question. / तुम्ही प्रश्नाचे उत्तर दिलेले नाही.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-green-500 rounded"></span>
                      <span>You have answered the question. / तुम्ही प्रश्नाचे उत्तर दिले आहे.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-500 rounded"></span>
                      <span>You have NOT answered the question but have marked the question for review. / तुम्ही प्रश्नाचे उत्तर दिलेले नाही, पण प्रश्न पुनरावलोकनासाठी चिन्हांकित केला आहे.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-purple-500 rounded flex items-center justify-center text-white font-bold">✓</span>
                      <span>The question(s) "Answered and Marked for Review" will be considered for evaluation. / तुम्ही प्रश्नाचे उत्तर दिले आहे आणि पुनरावलोकनासाठी चिन्हांकित केला आहे, हे मूल्यमापनासाठी विचारात घेतले जाईल.</span>
                    </li>
                  </ul>
                  <ul className="list-disc pl-6 space-y-2 mt-4">
                    <li>एखाद्या प्रश्नाची 'Marked for Review' ही स्थिती असे दर्शवते की, तुम्ही तो प्रश्न पुन्हा पाहू इच्छिता.</li>
                    <li>
                      प्रश्न क्रमांक बॉक्स कमी करण्यासाठी (minimise) प्रश्न क्रमांक बॉक्सच्या डावीकडे दिसणाऱ्या {'>'} बाणावर क्लिक करू शकता. त्यामुळे तुम्हाला स्क्रीनच्या मोठ्या क्षेत्रावर प्रश्न पाहता येईल. प्रश्न क्रमांक बॉक्स पुन्हा पाहण्यासाठी तुम्ही स्क्रीनच्या उजव्या बाजूला दिसणाऱ्या {'<'} बाणावर क्लिक करू शकता.
                    </li>
                    <li>
                      स्क्रोलिंग (scrolling) न करता प्रश्नाच्या शेवटचा सर्वात तळाला जाण्यासाठी तुम्ही [Down Arrow] या बटनावर क्लिक करू शकता आणि सर्वात वरच्या बाजूला जाण्यासाठी [Up Arrow] या बटनावर क्लिक करू शकता.
                    </li>
                    <li>
                      उत्तर दिलेल्या, उत्तर न दिलेल्या, भेट न दिलेल्या, पुनरावलोकनासाठी चिन्हांकित केलेल्या आणि पुनरावलोकनासाठी उत्तरे दिलेल्या तसेच चिन्हांकित केलेल्या प्रश्नांच्या संख्येचा सारांश/ गोषवारा (summary) प्रश्न क्रमांक बॉक्समध्ये वर दिसेल.
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">C एका प्रश्नाचे उत्तर देणे</h3>
                  <p className="mb-2">
                    स्क्रीनवर प्रश्न क्रमांक 1 ते 100 पर्यंत्चे प्रश्न अनुक्रमे दिसतील, त्यांची उत्तरे खालीलप्रमाणे एकमागून एक देता येऊ शकतात :
                  </p>
                  <ul className="list-none space-y-2 ml-4">
                    <li>a. तुमचे उत्तर निवडण्यासाठी, पर्यायांपैकी एका पर्यायाच्या बटनावर क्लिक करा</li>
                    <li>b. तुमच्या निवडलेल्या उत्तराची निवड रद्द करण्यासाठी निवडलेल्या पर्यायाच्या बटनावर पुन्हा क्लिक करा किंवा Clear Response या बटनावर क्लिक करा</li>
                    <li>c. तुमचे निवडलेले उत्तर बदलण्यासाठी, तुम्ही निवडू इच्छित असलेल्या पर्यायाच्या बटनावर क्लिक करा.</li>
                    <li>d. तुमचे उत्तर जतन (save) करण्यासाठी, तुम्हाला Save & Next या बटनावर क्लिक करणे आवश्यक आहे.</li>
                    <li>
                      e.एखाद्या प्रश्नासाठी चिन्हांकित केलेल्या पर्यायाबाबत शंका असल्यास, Mark for Review & Next बटनावर क्लिक करून तुम्ही तो प्रश्न पुनरावलोकनासाठी चिन्हांकित करू शकता, जर चिन्हांकित पर्यायाचे पुनरावलोकन केले गेले नाही, तर मूल्यमापनासाठी मूळ चिन्हांकित पर्याय विचारात घेतला जाईल.
                    </li>
                  </ul>
                  <p className="mt-4">
                    आधीच उत्तर दिलेल्या प्रश्नांचे तुमचे उत्तर बदलण्याकरिता, प्रश्न क्रमांक बॉक्समधील प्रश्न क्रमांकावर क्लिक करा आणि 1 वर नमूद केल्याप्रमाणे उत्तर देण्याच्या प्रक्रियेचे अनुसरण करा.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Language Selection */}
          <div className="mb-6 pb-6 border-b border-border">
            <label className="block text-sm font-medium mb-2 text-foreground">
              Choose your default language:
            </label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="-- Select --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="marathi">Marathi</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-red-500 mt-2">
              Please note all questions will appear in your default language. This language can be changed for a particular question later on.
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
                I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc. /any prohibited material with me into the Examination Hall. I agree that in case of not adhering to the instructions, I shall be liable to be debarred from this Test and/or to disciplinary action, which may include ban from future Tests / Examinations
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
