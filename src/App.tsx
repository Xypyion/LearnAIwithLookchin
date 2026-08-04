import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import HomeView from "./components/HomeView";
import LessonViewer from "./components/LessonViewer";
import QuizCenter from "./components/QuizCenter";
import Playground from "./components/Playground";
import EthicsSimulator from "./components/EthicsSimulator";
import CareerExplorer from "./components/CareerExplorer";
import Dictionary from "./components/Dictionary";
import NewsSection from "./components/NewsSection";
import { UserProfile } from "./types";
import { BookOpen, Newspaper, Briefcase, Award } from "lucide-react";

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Initialize gamified user profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("ai_mentor_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      name: "สมชาย มีความรู้",
      level: "มัธยมศึกษาตอนปลาย (ม.5)",
      points: 120,
      completedLessons: ["what-is-ai"],
      bookmarks: [],
      unlockedBadges: ["ai-beginner"],
      quizScores: {}
    };
  });

  // Save profile state whenever it changes
  useEffect(() => {
    localStorage.setItem("ai_mentor_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  // Sync dark mode class to HTML
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleBookmark = (lessonId: string) => {
    setUserProfile((prev) => {
      const isBookmarked = prev.bookmarks.includes(lessonId);
      const newBookmarks = isBookmarked
        ? prev.bookmarks.filter((id) => id !== lessonId)
        : [...prev.bookmarks, lessonId];
      return { ...prev, bookmarks: newBookmarks };
    });
  };

  const markLessonComplete = (lessonId: string) => {
    setUserProfile((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      return {
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        points: prev.points + 15 // +15 points for every lesson completed
      };
    });
  };

  const updateQuizScore = (quizId: string, score: number, earnedBadges: string[]) => {
    setUserProfile((prev) => {
      const oldScore = prev.quizScores[quizId] || 0;
      const newScores = { ...prev.quizScores, [quizId]: Math.max(oldScore, score) };
      return {
        ...prev,
        quizScores: newScores,
        unlockedBadges: earnedBadges
      };
    });
  };

  const addPoints = (points: number) => {
    setUserProfile((prev) => ({
      ...prev,
      points: prev.points + points
    }));
  };

  // Switch to Dictionary or Lessons if global search query changes
  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setCurrentTab("dictionary");
    }
  }, [searchQuery]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-text dark:bg-brand-dark-bg dark:text-slate-200 transition-colors duration-300">
      
      {/* Global Navigation Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        userProfile={userProfile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Stage with top margin to account for fixed navbar header */}
      <main className="flex-grow pt-20 pb-16">
        {currentTab === "home" && (
          <HomeView
            setCurrentTab={setCurrentTab}
            setSelectedLessonId={setSelectedLessonId}
            userProfile={userProfile}
          />
        )}

        {currentTab === "learn" && (
          <LessonViewer
            userProfile={userProfile}
            toggleBookmark={toggleBookmark}
            markLessonComplete={markLessonComplete}
            selectedLessonId={selectedLessonId}
            setSelectedLessonId={setSelectedLessonId}
            setCurrentTab={setCurrentTab}
          />
        )}

        {currentTab === "quiz" && (
          <QuizCenter
            userProfile={userProfile}
            updateQuizScore={updateQuizScore}
            addPoints={addPoints}
          />
        )}

        {currentTab === "playground" && <Playground />}

        {currentTab === "ethics" && (
          <EthicsSimulator addPoints={addPoints} />
        )}

        {currentTab === "careers" && <CareerExplorer />}

        {currentTab === "dictionary" && <Dictionary />}

        {currentTab === "news" && <NewsSection />}
      </main>

      {/* Footer Navigation Section */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/50 dark:border-slate-800/50 py-12 px-6 font-ui">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          
          {/* Logo Brand Footer */}
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-slate-800 dark:text-white font-heading font-bold text-lg">
              <span className="w-6 h-6 bg-brand-primary/10 rounded-lg flex items-center justify-center">🤖</span>
              AI Mentor TH
            </div>
            <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
              นวัตกรรมแพลตฟอร์มการศึกษาไทย เพื่อขับเคลื่อนและสร้างความเท่าเทียมทางองค์ความรู้เทคโนโลยีระดับโลกสำหรับโรงเรียนเยาวชนทั่วไทย
            </p>
          </div>

          {/* Quick-links for specialized tabs (Dictionary, News, Careers) */}
          <div className="flex flex-wrap justify-center gap-6 text-xs font-bold text-slate-500">
            <button
              onClick={() => { setCurrentTab("dictionary"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-brand-primary flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" /> พจนานุกรมศัพท์
            </button>
            <button
              onClick={() => { setCurrentTab("news"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-brand-primary flex items-center gap-1.5"
            >
              <Newspaper className="w-4 h-4" /> ข่าวเด่นสมองกล
            </button>
            <button
              onClick={() => { setCurrentTab("careers"); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="hover:text-brand-primary flex items-center gap-1.5"
            >
              <Briefcase className="w-4 h-4" /> เข็มทิศวิชาชีพ
            </button>
          </div>

          {/* Developer Credentials / Educational Seal */}
          <div className="text-xs text-slate-400">
            <span className="block">© {new Date().getFullYear()} AI Mentor TH. สงวนลิขสิทธิ์ทางการศึกษา</span>
            <span className="text-[10px] text-brand-primary font-bold block mt-1">
              โครงการพัฒนาทักษะพลเมืองดิจิทัลกระทรวงศึกษาธิการไทย 🇹🇭
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}
