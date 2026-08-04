import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Cpu, 
  BookOpen, 
  GraduationCap, 
  Gamepad2, 
  ChevronRight, 
  Lightbulb,
  Smartphone,
  Music,
  ShoppingBag,
  History,
  TrendingUp,
  MapPin,
  MessageSquare,
  Download
} from "lucide-react";
import { UserProfile } from "../types";
import { LESSONS } from "../data/lessons";

interface HomeViewProps {
  setCurrentTab: (tab: string) => void;
  setSelectedLessonId: (id: string | null) => void;
  userProfile: UserProfile;
}

// Student-friendly AI facts
const DAILY_FACTS = [
  "รู้หรือไม่? ทุกๆ ครั้งที่คุณกดไลก์รูปภาพใน Instagram ระบบ AI จะประมวลผลวิเคราะห์ประเภทภาพนั้นเพื่อจัดคัดสรรสิ่งที่คุณสนใจมาแสดงเพิ่มในอนาคต!",
  "รู้หรือไม่? ในปี 1997 ซูเปอร์คอมพิวเตอร์ชื่อ Deep Blue ของ IBM เป็นคอมพิวเตอร์ตัวแรกที่ชนะแชมป์โลกหมากรุกที่เป็นมนุษย์ได้สำเร็จ!",
  "รู้หรือไม่? ปัญญาประดิษฐ์ไม่ได้เข้าใจวิดีโอเป็นภาพสวยๆ แต่แปลงภาพทั้งหมดในแต่ละวินาทีออกเป็นตัวเลขพิกเซลและระดับเฉดสีเพื่อคำนวณ",
  "รู้หรือไม่? ChatGPT ถูกขับเคลื่อนด้วยสถาปัตยกรรมที่เรียกว่า Large Language Model (LLM) ซึ่งสามารถคาดเดาความน่าจะเป็นของอักษรตัวถัดไปได้เหมือนรถไฟขบวนคำ!",
  "รู้หรือไม่? รถยนต์ไร้คนขับประกอบไปด้วยเซนเซอร์ LiDAR คลื่นวิทยุ และกล้องรอบตัว โดยมี Computer Vision ทำหน้าที่เป็นดวงตานำทาง",
  "รู้หรือไม่? ปัจจุบันหุ่นยนต์ AI สามารถช่วยคุณหมอคัดแยกฟิล์มเอกซเรย์เพื่อค้นหาเนื้องอกขนาดเล็กจิ๋วได้ไวกว่าตาเปล่าถึง 5 เท่า!"
];

export default function HomeView({ setCurrentTab, setSelectedLessonId, userProfile }: HomeViewProps) {
  const [dailyFact, setDailyFact] = React.useState("");

  React.useEffect(() => {
    // Pick a random fact on mount
    const randomIdx = Math.floor(Math.random() * DAILY_FACTS.length);
    setDailyFact(DAILY_FACTS[randomIdx]);
  }, []);

  const featuredCards = [
    {
      id: "what-is-ai",
      title: "ปัญญาประดิษฐ์คืออะไร?",
      subtitle: "เรียนรู้จุดเริ่มต้นเบื้องต้น",
      icon: <BookOpen className="w-5 h-5 text-brand-primary" />,
      color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600",
      tab: "learn"
    },
    {
      id: "machine-learning",
      title: "ความลับของสมองกล",
      subtitle: "Machine & Deep Learning",
      icon: <Cpu className="w-5 h-5 text-green-600" />,
      color: "bg-green-50 dark:bg-green-900/20 text-green-600",
      tab: "learn"
    },
    {
      id: "ai-ethics",
      title: "ใช้งานอย่างปลอดภัยและเป็นธรรม",
      subtitle: "จริยธรรม & ลิขสิทธิ์ AI",
      icon: <GraduationCap className="w-5 h-5 text-amber-500" />,
      color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600",
      tab: "ethics"
    }
  ];

  const timelineEvents = [
    { year: "1956", title: "การกำเนิดคำว่า AI", desc: "เกิดการตกลงใช้คำว่า Artificial Intelligence ขึ้นครั้งแรกในงานประชุม Dartmouth Workshop" },
    { year: "1997", title: "Deep Blue ชนะแชมป์โลก", desc: "คอมพิวเตอร์ตัวแรกเอาชนะ มนุษย์แชมป์โลกหมากรุก ถือเป็นจุดเปลี่ยนครั้งใหญ่" },
    { year: "2011", title: "Siri ถือกำเนิดขึ้น", desc: "ระบบจดจำเสียงอัจฉริยะในสมาร์ทโฟนระดับผู้บริโภคทั่วไปเริ่มเบ่งบาน" },
    { year: "2016", title: "AlphaGo ปราบเซียนโกะ", desc: "Google พัฒนาระบบลองผิดลองถูก ชนะแชมป์ล้อมหมากระดับตำนานด้วยคะแนนขาดลอย" },
    { year: "2022", title: "ยุค ChatGPT รุ่งเรือง", desc: "เปิดประตูปฏิวัติวงการสู่ Generative AI ที่สามารถแต่งเนื้อหา วาดรูป และเขียนโปรแกรมได้เอง" },
    { year: "2026", title: "ผู้ช่วยปัญญาประดิษฐ์ในชั้นเรียน", desc: "AI พัฒนาเป็นผู้ร่วมคิดแก้ปัญหาและปรับปรุงการศึกษาไทยแบบเจาะจงเฉพาะบุคคล" }
  ];

  const aiAroundUs = [
    {
      title: "กล้องถ่ายภาพมือถือ",
      context: "วิเคราะห์ใบหน้าโฟกัส",
      desc: "ระบุความตื้นลึกของผิว ปรับแสงสว่างเฉดสี และเบลอพื้นหลังให้ภาพพอร์เทรตสวยงามสะกดสายตา",
      icon: <Smartphone className="w-6 h-6 text-blue-600" />
    },
    {
      title: "ระบบคัดสรรดนตรี Spotify",
      context: "แนะนำเพลงที่คุณถูกใจ",
      desc: "วิเคราะห์ความถี่ดนตรี คีย์เพลง และประวัติการฟังเพื่อเลือกจัดลิสต์เพลงใหม่ๆ ที่สอดคล้องกับหัวใจคุณ",
      icon: <Music className="w-6 h-6 text-green-600" />
    },
    {
      title: "แผนที่ Google Maps",
      context: "เลือกเส้นทางเลี่ยงรถติด",
      desc: "คาดเดาปริมาณรถติดแบบเรียลไทม์จากพิกเซลจีพีเอส และจัดเวลาถึงที่หมายได้อย่างรวดเร็ว",
      icon: <MapPin className="w-6 h-6 text-amber-600" />
    },
    {
      title: "ระบบสนทนา ChatGPT",
      context: "คู่หูการบ้านเขียนเรียงความ",
      desc: "ประมวลคลังข้อมูลทางภาษาทั่วโลกเพื่อเรียบเรียงและสรุปประเด็นซับซ้อนให้เข้าใจในสามสิบวินาที",
      icon: <MessageSquare className="w-6 h-6 text-emerald-600" />
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-12 font-ui" id="home-view">
      {/* Main Hero Section & Featured Cards — Clean Utility Theme Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch" id="hero-section">
        <div className="lg:col-span-7 flex flex-col justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-3xl shadow-sm">
          <span className="inline-block w-fit px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs font-bold rounded-full mb-4 uppercase tracking-wider">
            Education Thailand 🇹🇭
          </span>
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] text-slate-900 dark:text-white mb-6">
            Learn Artificial Intelligence <span className="text-brand-primary">Today.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-lg leading-relaxed">
            สำรวจโลกของแมชชีนเลิร์นนิง, ปัญญาประดิษฐ์สำหรับการสร้างสรรค์ (Generative AI) และความปลอดภัยยุคดิจิทัล ผ่านบทเรียนจำลองสุดตื่นเต้นและควิซฝึกสมองในที่เดียว
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { setCurrentTab("learn"); setSelectedLessonId("what-is-ai"); }}
              className="px-6 py-4 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-2xl font-bold text-base shadow-lg shadow-brand-primary/20 transition-all active:scale-95 cursor-pointer"
            >
              เริ่มต้นเรียนรู้เลย (Start)
            </button>
            <button
              onClick={() => setCurrentTab("quiz")}
              className="px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl font-bold text-base shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-all active:scale-95 cursor-pointer"
            >
              ทดสอบความรู้ (Quiz)
            </button>
          </div>
        </div>

        {/* Featured Learning Cards */}
        <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            onClick={() => { setSelectedLessonId("what-is-ai"); setCurrentTab("learn"); }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-brand-primary/30 transition-all cursor-pointer hover:shadow-md group"
          >
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-850 dark:text-white group-hover:text-brand-primary transition-colors">What is AI?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">บทเรียนปูพื้นฐานง่ายๆ</p>
            </div>
          </div>

          <div 
            onClick={() => { setSelectedLessonId("machine-learning"); setCurrentTab("learn"); }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-brand-primary/30 transition-all cursor-pointer hover:shadow-md group"
          >
            <div className="w-12 h-12 bg-green-100 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-850 dark:text-white group-hover:text-brand-primary transition-colors">ML Basics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">สมองกลเรียนรู้ได้อย่างไร</p>
            </div>
          </div>

          <div 
            onClick={() => { setSelectedLessonId("ai-ethics"); setCurrentTab("learn"); }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-brand-primary/30 transition-all cursor-pointer hover:shadow-md group"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-850 dark:text-white group-hover:text-brand-primary transition-colors">AI Ethics</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">จริยธรรม & การใช้งานปลอดภัย</p>
            </div>
          </div>

          <div 
            onClick={() => setCurrentTab("learn")}
            className="bg-brand-primary p-6 rounded-3xl text-white shadow-sm flex flex-col justify-between hover:bg-brand-primary/95 transition-all cursor-pointer hover:shadow-lg hover:-translate-y-0.5"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 text-white font-black text-sm">
              {LESSONS && LESSONS.length > 0 ? Math.round((userProfile.completedLessons.length / LESSONS.length) * 100) : 0}%
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">เรียนต่อเนื่อง</h3>
              <p className="text-xs text-white/80 mt-1">เข้าสู่บทเรียนปัจจุบันของเธอ</p>
            </div>
          </div>
        </div>
      </section>

      {/* Offline Portable Website & Single-Page Download Section */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-3xl p-6 md:p-10 shadow-lg border border-blue-800 flex flex-col gap-6" id="offline-download-section">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full font-bold text-xs border border-blue-400/30">
              <Download className="w-3.5 h-3.5" />
              Portable Offline Distribution
            </span>
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white mt-2">
              ดาวน์โหลดสื่อการเรียนรู้แบบ Offline พกพาไปใช้ได้ทุกที่
            </h2>
            <p className="text-xs md:text-sm text-blue-200 mt-1 max-w-2xl leading-relaxed">
              สำหรับโรงเรียน คณะครู และนักเรียนที่ต้องการใช้งานในห้องเรียนคอมพิวเตอร์ หรือพื้นที่ไร้สัญญาณอินเทอร์เน็ต
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Node.js Portable ZIP */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-base text-white flex items-center gap-2">
                  📦 1. Portable Node.js Server (ZIP)
                </span>
                <span className="text-[10px] bg-blue-500/30 text-blue-200 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
                  Node.js App
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                ไฟล์ ZIP รันเว็บไซต์ฉบับเต็มผ่าน Node.js ในเครื่อง ดับเบิลคลิก <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300">start.bat</code> (Windows) หรือ <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-300">start.sh</code> (Mac/Linux) เพื่อเปิดใช้งานแบบเต็มระบบ!
              </p>
            </div>
            <a
              href="/ai-mentor-th-offline.zip"
              download="ai-mentor-th-offline.zip"
              className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              ดาวน์โหลด ai-mentor-th-offline.zip (Node.js)
            </a>
          </div>

          {/* Card 2: Standalone Single HTML File */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex flex-col justify-between gap-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-base text-white flex items-center gap-2">
                  🌐 2. Standalone Single HTML Page
                </span>
                <span className="text-[10px] bg-green-500/30 text-green-200 font-bold px-2 py-0.5 rounded-full border border-green-400/30">
                  Single File HTML
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                ไฟล์ HTML เดี่ยวเปิดใช้งานได้ทันทีบนเว็บเบราว์เซอร์ทุกชนิด โดยไม่ต้องติดตั้งโปรแกรมหรือ Server เพิ่มเติม ดับเบิลคลิกเปิดไฟล์เพื่อเรียนรู้และทำควิซออฟไลน์ได้ 100%!
              </p>
            </div>
            <a
              href="/standalone.html"
              download="ai-mentor-th-standalone.html"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs rounded-xl text-center shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-900" />
              ดาวน์โหลด/เปิด standalone.html (Single Page)
            </a>
          </div>
        </div>
      </section>

      {/* AI Around You section */}
      <section className="flex flex-col gap-6 bg-slate-50 dark:bg-slate-900/40 p-6 md:p-8 rounded-3xl border border-slate-200/30 dark:border-slate-800/30">
        <div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-800 dark:text-white">
            AI อยู่รอบตัวเรา (AI Around You)
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            มาสำรวจกันสิว่า เทคโนโลยีและแอปยอดฮิตที่พวกเธอสไลด์เล่นทุกวัน แอบมีสมองกลตรงไหนกันบ้างนะ!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiAroundUs.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-heading text-sm font-bold text-slate-800 dark:text-white">{item.title}</h4>
                  <span className="text-[10px] text-brand-primary font-bold">{item.context}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive AI Timeline */}
      <section className="flex flex-col gap-6">
        <div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
            <History className="w-6 h-6 text-brand-primary" />
            เส้นทางแห่งสติปัญญา: ไทม์ไลน์ประวัติศาสตร AI
          </h2>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            เลื่อนผ่านความก้าวหน้าที่เปลี่ยนวิถีชีวิตมนุษยชาติในแต่ละห้วงสิบปีสำคัญ
          </p>
        </div>

        {/* Timeline Desktop horizontal view / Mobile vertical view */}
        <div className="relative border-l-2 md:border-l-0 md:border-t-2 border-slate-200 dark:border-slate-700 pl-6 md:pl-0 pt-0 md:pt-8 grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-4 mt-4">
          {timelineEvents.map((ev, idx) => (
            <div key={idx} className="relative flex flex-col items-start gap-1">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] md:left-0 -top-1 md:-top-[41px] w-4 h-4 rounded-full bg-brand-primary border-4 border-white dark:border-slate-900 shadow-md"></div>
              
              <span className="font-heading text-lg font-bold text-brand-primary">{ev.year}</span>
              <h4 className="font-ui text-xs font-bold text-slate-800 dark:text-white mt-1">{ev.title}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                {ev.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Achievements & Statistics overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-900 text-white rounded-3xl p-8 border border-slate-800">
        <div className="flex flex-col justify-center gap-4">
          <h3 className="font-heading text-xl md:text-2xl font-bold">
            สถิติการเรียนรู้ของเธอ 📊
          </h3>
          <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
            ติดตามความคืบหน้าสะสมแต้มคะแนน ปลดล็อกเข็มเกียรติยศเพื่อพิสูจน์ฝีมือตนเองบนบอร์ดคะแนนผู้นำของโรงเรียน!
          </p>
          <button
            onClick={() => setCurrentTab("quiz")}
            className="w-fit px-5 py-2.5 bg-brand-secondary hover:bg-brand-secondary/90 text-slate-900 font-bold text-xs rounded-xl transition-all"
          >
            เปิดตู้รางวัล
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/30">
            <span className="block text-xl md:text-3xl font-extrabold text-brand-primary">
              {userProfile.completedLessons.length}
            </span>
            <span className="text-[10px] text-slate-400 font-ui mt-1 block">บทเรียนที่เรียนสำเร็จ</span>
          </div>
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/30">
            <span className="block text-xl md:text-3xl font-extrabold text-brand-accent">
              {userProfile.points}
            </span>
            <span className="text-[10px] text-slate-400 font-ui mt-1 block">คะแนนสะสม</span>
          </div>
          <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/30">
            <span className="block text-xl md:text-3xl font-extrabold text-green-400">
              {userProfile.unlockedBadges.length}
            </span>
            <span className="text-[10px] text-slate-400 font-ui mt-1 block">ตราเกียรติยศ</span>
          </div>
        </div>
      </section>
    </div>
  );
}
