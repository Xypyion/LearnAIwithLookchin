import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Scale, AlertCircle, CheckCircle, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { ETHICS_SCENARIOS } from "../data/ethics";
import { EthicsScenario } from "../types";

interface EthicsSimulatorProps {
  addPoints: (points: number) => void;
}

export default function EthicsSimulator({ addPoints }: EthicsSimulatorProps) {
  const [selectedScenarioIdx, setSelectedScenarioIdx] = React.useState(0);
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const [hasChosen, setHasChosen] = React.useState(false);

  const activeScenario = ETHICS_SCENARIOS[selectedScenarioIdx];

  const handleChoiceClick = (key: string, impact: number) => {
    if (hasChosen) return;
    setSelectedKey(key);
    setHasChosen(true);
    addPoints(impact); // reward points for moral exploration
  };

  const handleNextScenario = () => {
    if (selectedScenarioIdx < ETHICS_SCENARIOS.length - 1) {
      setSelectedScenarioIdx((prev) => prev + 1);
      setSelectedKey(null);
      setHasChosen(false);
    } else {
      // Loop back to start
      setSelectedScenarioIdx(0);
      setSelectedKey(null);
      setHasChosen(false);
    }
  };

  const activeOption = activeScenario?.options.find((o) => o.key === selectedKey);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 font-ui" id="ethics-simulator">
      
      {/* Header banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 text-white p-6 md:p-8 border border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full font-bold text-[10px] uppercase tracking-wider mb-2">
            <Scale className="w-4 h-4 text-brand-primary animate-pulse" /> AI Ethics & Human Values
          </span>
          <h1 className="font-heading text-2xl md:text-3xl font-extrabold">
            จำลองสถานการณ์ความปลอดภัยและจริยธรรม AI
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed mt-1">
            ในฐานะเยาวชนยุคใหม่ ลองร่วมคิดวิพากษ์และประเมินผลกระทบต่อความเป็นอยู่ส่วนบุคคล ความสะดวก และผลทางกฎหมายเมื่อเรานำปัญญาประดิษฐ์มาใช้งานจริงในโรงเรียน!
          </p>
        </div>
        
        {/* Statistics or visual badge */}
        <div className="flex items-center gap-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/30 flex-shrink-0">
          <ShieldCheck className="w-10 h-10 text-brand-secondary" />
          <div>
            <span className="block text-[10px] text-slate-400">ระดับทักษะวิจารณญาณ</span>
            <span className="font-heading text-xs font-bold text-green-400">พลเมืองดิจิทัลยุค 5G</span>
          </div>
        </div>
      </div>

      {/* Main active dilemma content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Scenario and Options column */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-sm flex flex-col justify-between min-h-[450px]">
          <AnimatePresence mode="wait">
            {activeScenario && (
              <motion.div
                key={activeScenario.id}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="flex flex-col gap-6"
              >
                {/* Index marker */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-xs text-brand-primary font-bold">สถานการณ์ที่ {selectedScenarioIdx + 1} / {ETHICS_SCENARIOS.length}</span>
                  <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-300 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Dilemma Lab
                  </span>
                </div>

                {/* Question title */}
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white leading-snug">
                    {activeScenario.title}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed font-ui">
                    {activeScenario.description}
                  </p>
                </div>

                {/* Moral Question box */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/40 dark:border-slate-800/40 rounded-xl">
                  <h4 className="font-heading text-xs font-bold text-slate-400 uppercase tracking-wider">คำถามประเมินความคิด</h4>
                  <p className="font-ui text-sm font-bold text-slate-800 dark:text-white mt-1 leading-snug">
                    {activeScenario.question}
                  </p>
                </div>

                {/* Interactive choice options list */}
                <div className="flex flex-col gap-3.5 mt-2">
                  {activeScenario.options.map((option) => {
                    const isSelected = selectedKey === option.key;
                    
                    let btnStyle = "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-brand-primary/40";
                    if (hasChosen) {
                      if (isSelected) {
                        btnStyle = "border-brand-primary bg-brand-primary/10 ring-2 ring-brand-primary";
                      } else {
                        btnStyle = "border-slate-100 dark:border-slate-700/50 opacity-40 cursor-not-allowed";
                      }
                    }

                    return (
                      <button
                        key={option.key}
                        onClick={() => handleChoiceClick(option.key, option.scoreImpact)}
                        disabled={hasChosen}
                        className={`w-full text-left font-ui text-xs p-4 rounded-xl border transition-all duration-200 flex items-center gap-3.5 focus:outline-none ${btnStyle}`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-heading text-sm font-bold flex-shrink-0 ${
                          isSelected ? "bg-brand-primary text-white" : "bg-slate-100 dark:bg-slate-700 text-slate-600"
                        }`}>
                          {option.key}
                        </div>
                        <span className="text-slate-700 dark:text-slate-200 font-bold flex-1 leading-snug">
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom actions control */}
          {hasChosen && (
            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
              <button
                onClick={handleNextScenario}
                className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center gap-1 shadow-md transition-all active:scale-95 hover:translate-x-0.5"
              >
                <span>ศึกษาพล็อตประเด็นอื่น</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Tradeoffs and Comparative analysis column (Requirement #11 tradeoffs) */}
        <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 p-6 rounded-2xl flex flex-col justify-center min-h-[450px]">
          {hasChosen && activeOption ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col gap-5 text-xs font-ui"
            >
              <div className="flex items-center gap-2 border-b border-slate-200/40 pb-4">
                <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                  <Scale className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">จุดยืนทางจริยธรรมที่เธอเลือก:</span>
                  <strong className="text-sm font-heading text-slate-800 dark:text-white">การประเมินทางศีลธรรม</strong>
                </div>
              </div>

              {/* Multi-layered Tradeoff items */}
              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm leading-relaxed">
                <strong className="block text-slate-700 dark:text-slate-300 text-xs mb-2">⚖️ บทวิเคราะห์ผลกระทบเปรียบเทียบ:</strong>
                
                {/* Parse newline tradeoffs */}
                <div className="flex flex-col gap-3 text-[11px] text-slate-600 dark:text-slate-300">
                  {activeOption.tradeoffs.split("\n").map((line, idx) => {
                    const isPro = line.trim().startsWith("🟢");
                    return (
                      <p 
                        key={idx} 
                        className={`p-2.5 rounded-lg border leading-relaxed ${
                          isPro 
                            ? "bg-green-500/5 border-green-200/10 text-green-800 dark:text-green-400" 
                            : "bg-red-500/5 border-red-200/10 text-red-800 dark:text-red-400"
                        }`}
                      >
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl border border-amber-500/20 leading-relaxed text-[10px]">
                <strong>💡 ข้อสรุปสำหรับนักเรียน:</strong> เทคโนโลยีทุกชนิดเปรียบเหมือนมีดสองคม ความสะดวกมักแลกมาด้วยความเป็นส่วนตัวเสมอ การตระหนักรู้สิทธิ์และข้อจำกัดจึงเป็นเกราะคุ้มกันดิจิทัลที่ดีที่สุดสำหรับเธอนะจ๊ะ!
              </div>
            </motion.div>
          ) : (
            <div className="text-center text-slate-400 flex flex-col items-center gap-2.5 py-12">
              <Scale className="w-10 h-10 text-slate-300 animate-pulse" />
              <span>ผลลัพธ์บทวิเคราะห์จุดแข็ง-จุดอ่อนเปรียบเทียบ จะประมวลผลขึ้นตรงนี้หลังจากเธอเลือกข้างความเห็นจ้ะ</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
