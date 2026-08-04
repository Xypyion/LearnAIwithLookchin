import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  Lock, 
  Trophy, 
  Flame, 
  Sparkles, 
  Clock,
  Printer,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { QUIZ_SETS } from "../data/quizzes";
import { UserProfile, Badge, QuizSet } from "../types";

interface QuizCenterProps {
  userProfile: UserProfile;
  updateQuizScore: (quizId: string, score: number, earnedBadges: string[]) => void;
  addPoints: (points: number) => void;
}

// Full set of badges
const ALL_BADGES: Badge[] = [
  { id: "ai-beginner", title: "🥇 AI Beginner", description: "สอบผ่านควิซระดับพื้นฐานด้วยคะแนน 70% ขึ้นไป", iconName: "BookOpen" },
  { id: "prompt-master", title: "🤖 Prompt Master", description: "เขียนสูตรประเมินผ่านระดับสูงสุดหรือใช้งาน Playground ครบถ้วน", iconName: "Terminal" },
  { id: "ai-expert", title: "🧠 AI Expert", description: "สอบผ่านควิซระดับสูง (Advanced) ด้วยคะแนน 100% เต็มสำเร็จ", iconName: "Brain" },
  { id: "quiz-champion", title: "🏆 Quiz Champion", description: "สะสมคะแนนจากควิซได้มากกว่า 300 คะแนน", iconName: "Trophy" }
];

export default function QuizCenter({ userProfile, updateQuizScore, addPoints }: QuizCenterProps) {
  const [selectedQuiz, setSelectedQuiz] = React.useState<QuizSet | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const [answered, setAnswered] = React.useState(false);
  const [correctCount, setCorrectCount] = React.useState(0);
  const [quizFinished, setQuizFinished] = React.useState(false);
  const [nameForCert, setNameForCert] = React.useState(userProfile.name || "สมชาย นามสมมุติ");
  const [certUnlocked, setCertUnlocked] = React.useState(false);

  // Active quiz parameters
  const activeQuestion = selectedQuiz?.questions[currentQuestionIdx];

  const handleSelectQuiz = (quiz: QuizSet) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedKey(null);
    setAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const handleAnswerClick = (key: string) => {
    if (answered) return;
    setSelectedKey(key);
    setAnswered(true);

    const isCorrect = key === activeQuestion?.correctKey;
    if (isCorrect) {
      setCorrectCount((prev) => prev + 1);
      addPoints(10); // +10 points for every correct answer
    }
  };

  const handleNextQuestion = () => {
    if (!selectedQuiz) return;
    
    if (currentQuestionIdx < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedKey(null);
      setAnswered(false);
    } else {
      // Finished the quiz!
      setQuizFinished(true);
      const percentage = (correctCount / selectedQuiz.questions.length) * 100;
      
      // Determine badge unlocks
      const newBadges: string[] = [...userProfile.unlockedBadges];
      if (selectedQuiz.level === "Beginner" && percentage >= 70 && !newBadges.includes("ai-beginner")) {
        newBadges.push("ai-beginner");
      }
      if (selectedQuiz.level === "Advanced" && percentage === 100 && !newBadges.includes("ai-expert")) {
        newBadges.push("ai-expert");
      }
      if (userProfile.points + (correctCount * 10) >= 300 && !newBadges.includes("quiz-champion")) {
        newBadges.push("quiz-champion");
      }

      updateQuizScore(selectedQuiz.id, correctCount, newBadges);

      if (percentage >= 70) {
        setCertUnlocked(true);
      }
    }
  };

  const handlePrintCert = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 font-ui" id="quiz-center">
      
      <AnimatePresence mode="wait">
        {!selectedQuiz ? (
          /* Quiz list selection view */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-8"
          >
            <div>
              <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                <Trophy className="w-8 h-8 text-brand-primary" />
                ศูนย์ทดสอบความรู้ AI (Quiz Center)
              </h1>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                สะสมความสำเร็จ ปลดล็อกควิซระดับสูง และท้าทายเพื่อคว้าเกียรติบัตรการศึกษา!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {QUIZ_SETS.map((quiz) => {
                const maxScore = userProfile.quizScores[quiz.id] || 0;
                const totalQuestions = quiz.questions.length;
                const isPassed = (maxScore / totalQuestions) * 100 >= 70;

                return (
                  <div
                    key={quiz.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-ambient-level-2 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          quiz.level === "Beginner" 
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                            : quiz.level === "Intermediate"
                            ? "bg-green-50 dark:bg-green-900/20 text-green-600"
                            : "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                        }`}>
                          ระดับ {quiz.level === "Beginner" ? "ปฐมวัย" : quiz.level === "Intermediate" ? "มัธยมต้น" : "มัธยมปลาย"}
                        </span>
                        
                        {isPassed && (
                          <span className="flex items-center gap-0.5 text-xs text-brand-secondary font-bold">
                            <CheckCircle className="w-4 h-4" /> สอบผ่าน
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white mt-2">
                        {quiz.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                        {quiz.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                      <span className="text-xs text-slate-400">
                        {totalQuestions} ข้อ • คะแนนสุงสุด: {maxScore}/{totalQuestions}
                      </span>
                      <button
                        onClick={() => handleSelectQuiz(quiz)}
                        className="px-4 py-2 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl transition-all"
                      >
                        เริ่มสอบควิซ
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Badges Cabinet showcase */}
            <div className="bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-200/30 dark:border-slate-800/30 mt-4">
              <h3 className="font-heading text-lg md:text-xl font-bold text-slate-800 dark:text-white mb-6">
                ตู้รางวัลความสำเร็จของเธอ (Achievements) 🏆
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {ALL_BADGES.map((badge) => {
                  const isUnlocked = userProfile.unlockedBadges.includes(badge.id);

                  return (
                    <div
                      key={badge.id}
                      className={`p-5 rounded-2xl border flex flex-col items-center text-center gap-3 relative transition-all ${
                        isUnlocked
                          ? "bg-white dark:bg-slate-800 border-brand-primary/30 shadow-md"
                          : "bg-slate-100/50 dark:bg-slate-800/40 border-slate-200/40 dark:border-slate-700/40 opacity-50"
                      }`}
                    >
                      {!isUnlocked && (
                        <div className="absolute top-3 right-3 text-slate-400">
                          <Lock className="w-3.5 h-3.5" />
                        </div>
                      )}
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                        isUnlocked ? "bg-brand-primary/10 text-brand-primary" : "bg-slate-200 text-slate-400"
                      }`}>
                        {badge.id === "ai-beginner" && "🥇"}
                        {badge.id === "prompt-master" && "🤖"}
                        {badge.id === "ai-expert" && "🧠"}
                        {badge.id === "quiz-champion" && "🏆"}
                      </div>

                      <div>
                        <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-white">
                          {badge.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ) : quizFinished ? (
          /* Finished Quiz summary view */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8 max-w-3xl mx-auto py-12"
          >
            <div className="text-center flex flex-col items-center gap-3">
              <Trophy className="w-16 h-16 text-brand-accent animate-bounce" />
              <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
                ยินดีด้วยจ้ะ สอบวิชาวิทยาศาสตร์ AI ผ่านพ้นแล้ว!
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                คุณทำคะแนนในชุดทดสอบ {selectedQuiz.title} ได้ดังนี้:
              </p>
            </div>

            {/* Score summary panel */}
            <div className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-8 shadow-md w-full text-center flex flex-col gap-6">
              <div className="flex justify-center items-end gap-1.5">
                <span className="font-heading text-5xl font-extrabold text-brand-primary">
                  {correctCount}
                </span>
                <span className="font-heading text-2xl text-slate-400">
                  / {selectedQuiz.questions.length} ข้อ
                </span>
              </div>

              <div className="w-full bg-slate-100 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-brand-secondary" 
                  style={{ width: `${(correctCount / selectedQuiz.questions.length) * 100}%` }}
                ></div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-300">
                {(correctCount / selectedQuiz.questions.length) * 100 >= 70
                  ? "👍 เก่งมากจ้ะ! คุณทำคะแนนผ่านเกณฑ์ 70% ปลดล็อกสิทธิ์เคลมใบประกาศนียบัตรอัจฉริยะเป็นทางการเรียบร้อย!"
                  : "💡 ใกล้เคียงแล้วจ้ะ! ลองทบทวนเนื้อหาบทเรียนใหม่อีกสักรอบแล้วมาสอบใหม่เพื่อคว้าใบเกียรติบัตรนะคนเก่ง"}
              </p>

              {/* Certificate Input Name */}
              {(correctCount / selectedQuiz.questions.length) * 100 >= 70 && (
                <div className="flex flex-col gap-2 bg-slate-50 dark:bg-slate-900/20 p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-left">
                  <label className="font-ui text-xs font-bold text-slate-700 dark:text-slate-300">
                    พิมพ์ชื่อ-นามสกุลจริงของเธอเพื่อติดบนเกียรติบัตร:
                  </label>
                  <input
                    type="text"
                    value={nameForCert}
                    onChange={(e) => setNameForCert(e.target.value)}
                    className="font-ui text-sm px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    placeholder="เช่น สมชาย นามสมมุติ"
                  />
                </div>
              )}
            </div>

            {/* Printable Certificate Showcase card (Requirement #6 certificate outcome) */}
            {(correctCount / selectedQuiz.questions.length) * 100 >= 70 && (
              <div 
                className="w-full bg-white text-slate-900 border-[12px] border-double border-brand-primary p-8 md:p-12 shadow-2xl relative flex flex-col items-center justify-between text-center font-ui overflow-hidden min-h-[400px] print:border-brand-primary print:shadow-none print:m-0"
                id="certificate-print-area"
              >
                {/* Background watermark seals */}
                <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, #004ac6 1px, transparent 1px)" }}></div>
                
                <div className="flex flex-col items-center gap-2">
                  <Award className="w-14 h-14 text-brand-primary mb-2 animate-pulse" />
                  <span className="font-heading text-xs tracking-widest text-brand-primary font-bold uppercase">
                    AI Mentor TH — Thailand Digital Literacy Academy
                  </span>
                  <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 border-b-2 border-brand-primary/20 pb-2 px-8">
                    เกียรติบัตรรับรองความรู้ AI
                  </h2>
                </div>

                <div className="my-8 flex flex-col items-center gap-3">
                  <span className="text-xs text-slate-500 font-ui">เกียรติบัตรฉบับนี้ออกไว้เพื่อแสดงว่า</span>
                  <p className="font-heading text-2xl md:text-3xl font-bold text-slate-800 underline decoration-slate-400 underline-offset-8">
                    {nameForCert}
                  </p>
                  <p className="text-xs text-slate-600 max-w-md leading-relaxed mt-2">
                    ได้ผ่านการเรียนรู้วิชาวิทยาศาสตร์สมองกลและสอบผ่านชุดคำถามความรู้ **{selectedQuiz.title}** จากโครงการส่งเสริมดิจิทัลเทคโนโลยีเพื่อโรงเรียนไทยยุคใหม่สำเร็จเป็นทางการ
                  </p>
                </div>

                <div className="w-full flex justify-between items-end mt-4 border-t border-slate-100 pt-6">
                  <div className="text-left">
                    <span className="block text-[10px] text-slate-400">ระดับทักษะที่ประเมิน</span>
                    <span className="font-heading text-xs font-bold text-slate-700">{selectedQuiz.level} Developer</span>
                  </div>
                  
                  {/* Verified Seal */}
                  <div className="flex flex-col items-center bg-brand-primary/10 px-3 py-2 rounded-xl border border-brand-primary/20">
                    <ShieldCheck className="w-6 h-6 text-brand-primary" />
                    <span className="text-[8px] font-bold text-brand-primary tracking-widest mt-1">VERIFIED SYSTEM</span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400">วันที่ได้รับการรับรอง</span>
                    <span className="font-ui text-xs text-slate-700">{new Date().toLocaleDateString("th-TH")}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Certificate and return controls */}
            <div className="flex flex-wrap gap-4 mt-2">
              {(correctCount / selectedQuiz.questions.length) * 100 >= 70 && (
                <button
                  onClick={handlePrintCert}
                  className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md"
                >
                  <Printer className="w-4 h-4" /> พิมพ์หรือเซฟเกียรติบัตร (PDF)
                </button>
              )}
              <button
                onClick={() => setSelectedQuiz(null)}
                className="px-5 py-3 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" /> กลับหน้าควิซทั้งหมด
              </button>
            </div>
          </motion.div>
        ) : (
          /* Active Question display view */
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full max-w-3xl mx-auto flex flex-col gap-6"
          >
            {/* Question set subheader with Back button */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setSelectedQuiz(null)}
                className="text-xs font-bold text-brand-primary flex items-center gap-1 hover:underline"
              >
                <RotateCcw className="w-3.5 h-3.5" /> กลับหน้ารายการควิซ
              </button>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {selectedQuiz.title}
              </span>
            </div>

            {/* Visual Header Progression */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-end mb-1">
                <div>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-full font-bold text-[10px] mb-2">
                    🎓 บทที่ {selectedQuiz.level === "Beginner" ? "1" : selectedQuiz.level === "Intermediate" ? "2" : "3"}
                  </span>
                  <h2 className="font-heading text-lg md:text-xl font-bold text-slate-800 dark:text-white">
                    {selectedQuiz.level === "Beginner" ? "พื้นฐาน AI" : selectedQuiz.level === "Intermediate" ? "Machine Learning" : "Advanced Ethics"}
                  </h2>
                </div>
                <div className="text-right">
                  <span className="font-heading text-xl font-extrabold text-brand-primary">
                    {currentQuestionIdx + 1}
                  </span>
                  <span className="text-xs text-slate-400 font-bold"> / {selectedQuiz.questions.length}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner relative">
                <div 
                  className="h-full bg-brand-secondary rounded-full transition-all duration-500" 
                  style={{ width: `${((currentQuestionIdx + 1) / selectedQuiz.questions.length) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>เริ่มต้น</span>
                <span>ความคืบหน้า {Math.round(((currentQuestionIdx + 1) / selectedQuiz.questions.length) * 100)}%</span>
                <span>เส้นชัย</span>
              </div>
            </div>

            {/* Illustration Canvas Context (Requirement #6 card decoration matching the provided image) */}
            <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden shadow-md relative bg-slate-100 dark:bg-slate-800">
              <div 
                className="w-full h-full bg-cover bg-center" 
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCUvkJmVLAemaYjqFjdXLjBXSDu0TjpEXmKiOSxooVrLmv57Xf1qBlLHpXq-vPtMBbSVrmcist6sVvhJ_8yHVfHYaM5hmHed4zZeIZQsW9PjRDqXqj_22iTbex_mQRLTyzKAyMF-BTW8NY_3RJgTYGwXrf1ODEuUgFkZdMlrclAzQYVxS0FMWZOjGOgLkU8piY96hccPPTCjyV3KpVeF5uzvR2ExLq_xZ6xDt77C-dqZfLRWxX0aTFkDDLvyQjMbCc9Sdppa0qX0Q')" }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white">
                <span className="text-[10px] font-bold bg-brand-primary px-2.5 py-1 rounded-full uppercase tracking-widest">
                  AI Context Visualizer
                </span>
              </div>
            </div>

            {/* Question Text Card */}
            {activeQuestion && (
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200/50 dark:border-slate-700/50 -mt-10 relative z-10 mx-2 md:mx-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0 mt-0.5">
                    <span className="font-heading text-sm font-bold">Q</span>
                  </div>
                  <h3 className="font-heading text-sm md:text-base font-bold text-slate-800 dark:text-white leading-relaxed">
                    {activeQuestion.questionText}
                  </h3>
                </div>
              </div>
            )}

            {/* Options grid */}
            {activeQuestion && (
              <div className="grid grid-cols-1 gap-3.5 mt-2">
                {activeQuestion.options.map((option) => {
                  const isSelected = selectedKey === option.key;
                  const isCorrectAnswer = option.key === activeQuestion.correctKey;
                  
                  // Color codes
                  let optionStyle = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-brand-primary/40";
                  let letterStyle = "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300";

                  if (answered) {
                    if (isCorrectAnswer) {
                      // Correct selection
                      optionStyle = "border-brand-secondary bg-green-500/10 dark:bg-green-500/5 ring-2 ring-brand-secondary";
                      letterStyle = "bg-brand-secondary text-white";
                    } else if (isSelected) {
                      // Incorrect selection
                      optionStyle = "border-brand-error bg-red-500/10 dark:bg-red-500/5 animate-shake ring-2 ring-brand-error";
                      letterStyle = "bg-brand-error text-white";
                    } else {
                      // Muted non-selected options
                      optionStyle = "border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/50 opacity-40 cursor-not-allowed";
                    }
                  }

                  return (
                    <button
                      key={option.key}
                      onClick={() => handleAnswerClick(option.key)}
                      disabled={answered}
                      className={`w-full text-left font-ui text-xs p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 focus:outline-none ${optionStyle}`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-heading text-sm font-bold flex-shrink-0 transition-colors ${letterStyle}`}>
                        {option.key}
                      </div>
                      <span className="text-slate-700 dark:text-slate-200 font-medium flex-1">
                        {option.text}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Explanation & Action area */}
            {answered && activeQuestion && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl flex flex-col gap-3 mt-2"
              >
                <div className="flex items-center gap-2 text-xs font-bold">
                  {selectedKey === activeQuestion.correctKey ? (
                    <span className="text-brand-secondary flex items-center gap-1">
                      <CheckCircle className="w-4.5 h-4.5" /> ถูกต้องจ้ะคนเก่ง! (+10 แต้ม)
                    </span>
                  ) : (
                    <span className="text-brand-error flex items-center gap-1">
                      <XCircle className="w-4.5 h-4.5" /> ไม่เป็นไรจ้ะ ลองศึกษาข้อมูลนี้ดูนะ
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-ui">
                  {activeQuestion.explanation}
                </p>

                <button
                  onClick={handleNextQuestion}
                  className="w-fit ml-auto mt-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1 shadow-md"
                >
                  {currentQuestionIdx < selectedQuiz.questions.length - 1 ? "ข้อถัดไป" : "สรุปผลคะแนน"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
