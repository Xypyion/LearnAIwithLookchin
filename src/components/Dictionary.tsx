import React from "react";
import { BookOpen, Search, ArrowRight, Lightbulb, Image as ImageIcon } from "lucide-react";
import { VOCABUARY_DICTIONARY } from "../data/dictionary";

export default function Dictionary() {
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredVocab = VOCABUARY_DICTIONARY.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.term.toLowerCase().includes(query) ||
      item.translation.toLowerCase().includes(query) ||
      item.definition.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 font-ui" id="vocab-dictionary">
      
      {/* Title section with Search input integration */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-brand-primary" />
            พจนานุกรมศัพท์สมองกล (AI Vocabulary)
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            ค้นหาและทำความเข้าใจคำศัพท์ทางวิศวกรรมปัญญาประดิษฐ์และวิทยาศาสตร์ข้อมูลผ่านประโยคเปรียบเทียบที่เข้าใจง่ายเหมือนปอกกล้วย!
          </p>
        </div>

        {/* Big Search Input */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="ค้นหา เช่น 'Machine Learning' หรือ 'Prompt'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent transition-all"
          />
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Vocabulary list grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredVocab.map((vocab, idx) => {
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 p-6 rounded-2xl shadow-sm hover:shadow-ambient-level-1 transition-all flex flex-col justify-between gap-5"
            >
              <div className="flex flex-col gap-3">
                <div>
                  <h3 className="font-heading text-base md:text-lg font-bold text-slate-800 dark:text-white">
                    {vocab.term}
                  </h3>
                  <span className="text-[11px] text-brand-primary font-bold">{vocab.translation}</span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-300 leading-relaxed font-ui">
                  {vocab.definition}
                </p>

                {/* Example card decoration */}
                <div className="p-3.5 bg-green-500/5 rounded-xl border border-green-200/10 flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[9px] text-green-700 dark:text-green-400 font-bold uppercase tracking-wider">ตัวอย่างเปรียบเทียบในชีวิตจริง:</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed italic">
                      &ldquo;{vocab.example}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Graphic Illustration Description (Requirement #9 illustration) */}
                <div className="p-3 bg-blue-500/5 rounded-xl border border-blue-200/10 flex items-start gap-2.5">
                  <ImageIcon className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[9px] text-brand-primary font-bold uppercase tracking-wider font-ui">ภาพจำลองเชิงจินตภาพ (Graphic Illustration):</span>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-ui">
                      {vocab.illustrationDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Related terms indicators */}
              <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 dark:border-slate-700/50 pt-3 text-[10px]">
                <span className="text-slate-400 font-bold mr-1">คำเชื่อมโยง:</span>
                {vocab.relatedTerms.map((term, i) => (
                  <span
                    key={i}
                    onClick={() => setSearchQuery(term)}
                    className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 hover:bg-brand-primary/10 hover:text-brand-primary rounded-full cursor-pointer transition-colors text-slate-500 dark:text-slate-300 font-medium"
                  >
                    {term}
                  </span>
                ))}
              </div>

            </div>
          );
        })}

        {filteredVocab.length === 0 && (
          <div className="md:col-span-2 text-center text-slate-400 py-12 flex flex-col items-center gap-2">
            <Search className="w-10 h-10 text-slate-300 animate-pulse" />
            <span>ไม่พบคำศัพท์ที่ตรงกับการค้นหาจ้ะ ลองเปลี่ยนคำค้นหาดูนะจ๊ะ</span>
          </div>
        )}
      </div>

    </div>
  );
}
