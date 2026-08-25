import React from "react";
import { Users, Award, Star } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  const members = [
    { name: "ศุภวิชญ์ ลุผล", class: "6/2", number: "1" },
    { name: "กันต์ สุวรรณเพชร", class: "6/2", number: "15" },
    { name: "เรน มิฮาระ", class: "6/2", number: "17" },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col items-center gap-10 font-ui" id="about-us">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-full text-sm font-bold mb-4">
          <Users className="w-5 h-5" />
          ทีมผู้จัดทำโครงงาน (Creators)
        </div>
        <h1 className="font-heading text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-4">
          เกี่ยวกับผู้จัดทำ
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          พวกเราคือกลุ่มนักเรียนที่มุ่งมั่นพัฒนาแพลตฟอร์มการศึกษา AI Mentor TH เพื่อเผยแพร่ความรู้และเทคโนโลยีให้เข้าถึงได้ง่ายยิ่งขึ้นสำหรับเยาวชนไทย
        </p>
      </motion.div>

      {/* Image Section in the Middle */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800"
      >
        <img 
          src="/image.png" 
          alt="รูปภาพสมาชิกผู้จัดทำโครงงาน" 
          className="w-full h-auto object-cover max-h-[650px] transition-transform duration-500 hover:scale-[1.01]"
          loading="eager"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-md">
            <span className="font-heading text-xs md:text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> สมาชิกกลุ่มผู้จัดทำโครงงาน
            </span>
          </div>
        </div>
      </motion.div>

      {/* Members List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {members.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 bg-brand-secondary/10 text-brand-secondary rounded-full flex items-center justify-center mb-4">
              <Award className="w-8 h-8" />
            </div>
            
            <h3 className="font-heading text-xl font-bold text-slate-800 dark:text-white mb-2">
              {member.name}
            </h3>
            
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-bold">
                ชั้น {member.class}
              </span>
              <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary rounded-lg text-sm font-bold">
                เลขที่ {member.number}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
