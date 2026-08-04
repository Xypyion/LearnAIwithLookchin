import React from "react";
import { motion, AnimatePresence } from "motion/react";
import ReactMarkdown from "react-markdown";
import { 
  BookOpen, 
  Bookmark, 
  BookmarkCheck, 
  Award, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Flame,
  HelpCircle,
  Smartphone,
  Cpu,
  Tv,
  MessageCircle,
  Lightbulb
} from "lucide-react";
import { LESSONS, LESSON_CATEGORIES, LessonDetail } from "../data/lessons";
import { UserProfile } from "../types";

interface LessonViewerProps {
  userProfile: UserProfile;
  toggleBookmark: (lessonId: string) => void;
  markLessonComplete: (lessonId: string) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;
  setCurrentTab: (tab: string) => void;
}

export default function LessonViewer({
  userProfile,
  toggleBookmark,
  markLessonComplete,
  selectedLessonId,
  setSelectedLessonId,
  setCurrentTab
}: LessonViewerProps) {
  // Select first lesson by default if none selected
  const activeLessonId = selectedLessonId || LESSONS[0].id;
  const activeLesson = LESSONS.find((l) => l.id === activeLessonId) || LESSONS[0];

  const handleNextLesson = () => {
    // Mark current lesson complete first
    markLessonComplete(activeLesson.id);
    
    // Find next lesson
    const currentIndex = LESSONS.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex < LESSONS.length - 1) {
      setSelectedLessonId(LESSONS[currentIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // If completed all, redirect to Quiz!
      setCurrentTab("quiz");
    }
  };

  const handlePrevLesson = () => {
    const currentIndex = LESSONS.findIndex((l) => l.id === activeLesson.id);
    if (currentIndex > 0) {
      setSelectedLessonId(LESSONS[currentIndex - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isBookmarked = userProfile.bookmarks.includes(activeLesson.id);
  const isCompleted = userProfile.completedLessons.includes(activeLesson.id);

  // Overall completion progress
  const completionPercentage = Math.round(
    (userProfile.completedLessons.length / LESSONS.length) * 100
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 font-ui" id="lesson-view">
      
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-6">
        
        {/* Course Progress Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center">
              <Award className="w-5 h-5 text-brand-primary" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-slate-800 dark:text-white">หลักสูตรพื้นฐาน AI</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">ความสำเร็จ: {completionPercentage}%</p>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-1">
            <div 
              className="h-full bg-brand-secondary transition-all duration-500" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>เริ่มต้น</span>
            <span>ความสำเร็จ</span>
          </div>
        </div>

        {/* Chapters list */}
        <div className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
          <h4 className="font-heading text-xs font-bold text-slate-400 tracking-wider uppercase px-2">เนื้อหาบทเรียน</h4>
          
          <nav className="flex flex-col gap-1.5">
            {LESSONS.map((lesson) => {
              const isActive = lesson.id === activeLessonId;
              const isDone = userProfile.completedLessons.includes(lesson.id);
              
              return (
                <button
                  key={lesson.id}
                  onClick={() => setSelectedLessonId(lesson.id)}
                  className={`w-full text-left font-ui text-xs p-3 rounded-xl transition-all duration-200 flex items-center justify-between ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary font-bold dark:bg-brand-primary/20"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center gap-2 max-w-[85%]">
                    <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded-lg text-[10px] font-bold">
                      {lesson.order}
                    </span>
                    <span className="truncate">{lesson.thaiTitle}</span>
                  </div>
                  {isDone ? (
                    <Check className="w-4 h-4 text-brand-secondary flex-shrink-0" />
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200 dark:bg-slate-600"></span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Certificate Claim Button */}
        <div className="mt-auto">
          <button
            onClick={() => setCurrentTab("quiz")}
            className="w-full py-3.5 px-4 bg-slate-100 hover:bg-brand-primary hover:text-white dark:bg-slate-800 text-brand-primary font-bold text-xs rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <Award className="w-4.5 h-4.5" />
            แบบทดสอบเพื่อเกียรติบัตร
          </button>
        </div>
      </aside>

      {/* Main Lesson Content Area */}
      <main className="flex-1 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 md:p-8 shadow-sm">
        
        {/* Lesson Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-700">
          <div className="flex flex-col gap-1.5">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-brand-primary/10 text-brand-primary rounded-full font-bold text-[10px]">
              บทที่ {activeLesson.order} — {activeLesson.readingTime} ในการอ่าน
            </span>
            <h1 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-white">
              {activeLesson.thaiTitle}
            </h1>
            <p className="font-ui text-xs text-slate-500 dark:text-slate-400">
              ชื่อทางการศึกษาอังกฤษ: {activeLesson.title}
            </p>
          </div>

          <div className="flex gap-2">
            {/* Bookmark button */}
            <button
              onClick={() => toggleBookmark(activeLesson.id)}
              className={`p-2.5 rounded-xl border transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold ${
                isBookmarked
                  ? "bg-brand-primary/15 text-brand-primary border-brand-primary/30"
                  : "bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300"
              }`}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-brand-primary" />
                  <span>บันทึกแล้ว</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4" />
                  <span>บุ๊กมาร์กไว้</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real Lesson Content (Markdown render) */}
        <article className="prose dark:prose-invert prose-slate max-w-none py-8 leading-relaxed font-ui text-sm md:text-base text-slate-700 dark:text-slate-200">
          <ReactMarkdown>{activeLesson.contentMarkdown}</ReactMarkdown>
        </article>

        {/* Visual Explainer Flowchart Diagram (Requirement #2) */}
        {activeLesson.diagramSteps && activeLesson.diagramSteps.length > 0 && (
          <div className="my-8 p-6 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200/50 dark:border-slate-800/50">
            <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-brand-primary rounded-full"></span>
              {activeLesson.diagramTitle || "ผังจำลองการทำงานอัจฉริยะ"}
            </h4>

            {/* Grid display for sequential steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {activeLesson.diagramSteps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col gap-2 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm z-10">
                  <span className="font-heading text-xs text-brand-primary font-bold bg-brand-primary/10 dark:bg-brand-primary/20 w-fit px-2 py-0.5 rounded-full">
                    {step.label}
                  </span>
                  <p className="font-ui text-xs text-slate-500 dark:text-slate-400">
                    {step.desc}
                  </p>
                  
                  {/* Arrows connecting steps */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-20">
                      <ArrowRight className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real-world Example Box (Requirement #3) */}
        {activeLesson.realWorldExample && (
          <div className="my-6 p-6 bg-green-50/50 dark:bg-green-950/10 rounded-2xl border border-green-200/30 dark:border-green-900/30 flex items-start gap-4">
            <div className="w-10 h-10 bg-brand-secondary/20 rounded-xl flex items-center justify-center text-brand-secondary flex-shrink-0">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-heading text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wide">
                ตัวอย่างจริงใกล้ตัวเธอนักเรียน!
              </h4>
              <h5 className="font-heading text-sm font-bold text-slate-800 dark:text-white mt-1">
                {activeLesson.realWorldExample.title}
              </h5>
              <p className="font-ui text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                {activeLesson.realWorldExample.description}
              </p>
            </div>
          </div>
        )}

        {/* Next & Previous navigation layout */}
        <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={handlePrevLesson}
            disabled={activeLesson.order === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            ย้อนกลับ
          </button>

          <button
            onClick={handleNextLesson}
            className="flex items-center gap-1.5 px-6 py-3.5 bg-brand-primary hover:bg-brand-primary/95 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 hover:translate-x-0.5"
          >
            {activeLesson.order === LESSONS.length ? (
              <>
                <span>ไปสอบควิซรับเกียรติบัตร</span>
                <Award className="w-4.5 h-4.5" />
              </>
            ) : (
              <>
                <span>บทถัดไป</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </main>
    </div>
  );
}
