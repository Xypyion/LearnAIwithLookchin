import React from "react";
import { Newspaper, Calendar, ArrowUpRight, Award, Compass } from "lucide-react";
import { NEWS_ITEMS } from "../data/news";

export default function NewsSection() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 font-ui" id="news-section">
      
      {/* Title */}
      <div>
        <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <Newspaper className="w-8 h-8 text-brand-primary" />
          สรุปข่าวเด่นสมองกล (AI News for Students)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          เกาะติดความก้าวหน้าและข่าวลิขสิทธิ์ความรู้ AI ทั่วโลก สรุปใจความสำคัญแบบเข้าใจง่าย สอดแทรกป้ายบอกความยากของการอ่าน!
        </p>
      </div>

      {/* News list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {NEWS_ITEMS.map((item) => {
          return (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-ambient-level-2 transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex flex-col gap-4">
                {/* Header dates & level */}
                <div className="flex justify-between items-center text-[10px]">
                  <span className="flex items-center gap-1 text-slate-400 font-medium">
                    <Calendar className="w-3.5 h-3.5" /> {item.date}
                  </span>
                  
                  {/* Difficulty labels */}
                  <span className={`px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    item.difficulty === "Beginner"
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600"
                      : item.difficulty === "Intermediate"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                      : "bg-amber-50 dark:bg-amber-900/20 text-amber-600"
                  }`}>
                    {item.difficulty === "Beginner" ? "🟢 ง่ายมาก" : item.difficulty === "Intermediate" ? "🟡 กลางๆ" : "🔴 ซับซ้อน"}
                  </span>
                </div>

                {/* Categories */}
                <span className="text-[10px] text-brand-primary font-bold uppercase tracking-widest">{item.category}</span>

                {/* News Title */}
                <h3 className="font-heading text-base font-bold text-slate-800 dark:text-white leading-snug">
                  {item.title}
                </h3>

                {/* Brief Summary */}
                <p className="text-xs text-slate-400 dark:text-slate-400 font-bold leading-relaxed italic">
                  &ldquo;{item.summary}&rdquo;
                </p>

                {/* Deep Contents */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                  {item.content}
                </p>
              </div>

              {/* Bottom tag indicator */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/50 text-[10px] text-slate-400 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-brand-primary" />
                <span>เขียนโดยกองบรรณาธิการเยาวชนดิจิทัล</span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
