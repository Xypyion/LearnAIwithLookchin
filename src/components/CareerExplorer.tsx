import React from "react";
import { Cpu, Terminal, ShieldCheck, DollarSign, GraduationCap, MapPin, Briefcase } from "lucide-react";
import { CAREERS } from "../data/careers";

export default function CareerExplorer() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 font-ui" id="career-explorer">
      
      {/* Title block */}
      <div>
        <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <Briefcase className="w-8 h-8 text-brand-primary" />
          เข็มทิศวิชาชีพ AI (AI Career Explorer)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          สำรวจรายได้ หน้าที่ ความรับผิดชอบ และเส้นทางการศึกษาต่อในระดับมหาวิทยาลัยของสายอาชีพแห่งอนาคตอัจฉริยะ!
        </p>
      </div>

      {/* Career cards list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {CAREERS.map((career, idx) => {
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm hover:shadow-ambient-level-2 hover:border-brand-primary/20 transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header branding */}
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 rounded-xl bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-brand-primary">
                    {career.iconName === "Cpu" && <Cpu className="w-6 h-6" />}
                    {career.iconName === "Terminal" && <Terminal className="w-6 h-6" />}
                    {career.iconName === "ShieldCheck" && <ShieldCheck className="w-6 h-6" />}
                  </div>
                  
                  {/* Estimated Salary badge */}
                  <span className="inline-flex items-center gap-0.5 bg-green-500/10 text-brand-secondary font-bold text-[10px] px-2.5 py-1 rounded-full border border-green-500/10">
                    <DollarSign className="w-3.5 h-3.5" /> {career.salary}
                  </span>
                </div>

                {/* Job titles */}
                <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white">
                  {career.title}
                </h3>
                <h4 className="font-heading text-xs font-bold text-brand-primary uppercase tracking-wide mt-1">
                  {career.thaiTitle}
                </h4>

                {/* Divider */}
                <hr className="my-4 border-slate-100 dark:border-slate-700/50" />

                {/* Responsibilities list */}
                <div className="flex flex-col gap-3">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block">📋 หน้าที่ความรับผิดชอบหลัก:</span>
                  <ul className="list-disc pl-4 text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-2 leading-relaxed">
                    {career.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                </div>

                {/* Required Skills list */}
                <div className="flex flex-col gap-3 mt-5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block">🧠 ทักษะจำเป็นสำหรับสมอง:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {career.skills.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-100 dark:border-slate-600/30">
                        ⚡ {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Universities to pursue */}
                <div className="flex flex-col gap-3 mt-5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block flex items-center gap-1">
                    <GraduationCap className="w-4 h-4 text-brand-primary" /> คณะ/สาขาในมหาวิทยาลัยที่แนะนำ:
                  </span>
                  <ul className="list-disc pl-4 text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1.5 leading-relaxed">
                    {career.universities.map((uni, i) => (
                      <li key={i}>{uni}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Career Path Roadmap (Requirement #10 roadmap) */}
              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-xs block mb-2 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-brand-primary" /> เส้นทางการก้าวสู่อาชีพ (Path Roadmap):
                </span>
                <p className="text-[11px] bg-slate-50 dark:bg-slate-900/30 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 text-slate-600 dark:text-slate-300 leading-relaxed font-ui italic">
                  {career.careerPath}
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
