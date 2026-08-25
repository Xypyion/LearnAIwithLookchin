import React from "react";
import { Brain, Sun, Moon, Search, Bookmark, Menu, X, Award } from "lucide-react";
import { UserProfile } from "../types";

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  userProfile: UserProfile;
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

export default function Header({
  currentTab,
  setCurrentTab,
  darkMode,
  setDarkMode,
  userProfile,
  setSearchQuery,
  searchQuery,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showSearch, setShowSearch] = React.useState(false);

  const tabs = [
    { id: "home", label: "หน้าแรก" },
    { id: "learn", label: "บทเรียน" },
    { id: "quiz", label: "ควิซ" },
    { id: "playground", label: "สนามเด็กเล่น" },
    { id: "ethics", label: "จริยธรรม AI" },
    { id: "about", label: "เกี่ยวกับผู้จัดทำ" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center w-full px-4 md:px-8 max-w-7xl mx-auto h-16">
          {/* Brand Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { setCurrentTab("home"); setMobileMenuOpen(false); }}
            id="brand-logo"
          >
            <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading text-base md:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                AI MENTOR <span className="text-brand-primary">TH</span>
              </span>
            </div>
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden md:flex gap-8 text-sm font-medium h-full items-center">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(tab.id)}
                  className={`font-ui text-sm h-full flex items-center transition-all duration-200 ${
                    isActive
                      ? "text-brand-primary border-b-2 border-brand-primary font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-brand-primary"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Trailing Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search Toggle */}
            <div className="relative flex items-center">
              {showSearch && (
                <input
                  type="text"
                  placeholder="ค้นหาบทเรียน/คำศัพท์..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="font-ui text-xs px-3 py-1.5 w-32 md:w-48 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-white mr-2 transition-all"
                />
              )}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="ค้นหา"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Bookmarks Count */}
            <button
              onClick={() => setCurrentTab("learn")}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors relative"
              title="บทเรียนที่บันทึก"
            >
              <Bookmark className="w-5 h-5" />
              {userProfile.bookmarks.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-brand-primary text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                  {userProfile.bookmarks.length}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              title={darkMode ? "เปิดโหมดสว่าง" : "เปิดโหมดมืด"}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* User Score / Profile Pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200/50 dark:border-slate-700/50">
              <Award className="w-4 h-4 text-brand-accent animate-bounce" />
              <span className="font-ui text-xs font-bold text-slate-700 dark:text-slate-300">
                {userProfile.points} คะแนน
              </span>
              <div className="w-6 h-6 rounded-full bg-brand-primary text-white text-xs flex items-center justify-center font-bold">
                {userProfile.name.slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Mobile Menu Burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex flex-col gap-3">
            {tabs.map((tab) => {
              const isActive = currentTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setCurrentTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`font-ui text-left text-sm p-2.5 rounded-lg transition-all ${
                    isActive
                      ? "bg-brand-primary/10 text-brand-primary font-bold dark:bg-brand-primary/20"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}

