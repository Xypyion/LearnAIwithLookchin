import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  MessageSquare, 
  Sparkles, 
  Cpu, 
  Compass, 
  Terminal, 
  Image as ImageIcon, 
  Smile, 
  Eye, 
  Eraser, 
  Send, 
  RotateCcw, 
  Upload, 
  AlertCircle,
  TrendingUp,
  BrainCircuit,
  PenTool
} from "lucide-react";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function Playground() {
  const [activeTab, setActiveTab] = useState<"chat" | "prompt" | "image" | "vision" | "sentiment" | "drawing">("chat");

  // MODULE 1: AI Chat Tutor State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<Message[]>([
    { role: "model", text: "สวัสดีจ้า! ครูคือ AI Mentor TH ยินดีต้อนรับเข้าสู่ห้องปฏิบัติการสุดสนุกของพวกเราจ้ะ มีวิชาหรือแนวคิดเกี่ยวกับ AI ตรงไหนที่เธอสงสัยไหมจ๊ะ ถามครูได้เลยนะ!" }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // MODULE 3: Image Gen State
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageModel, setImageModel] = useState("gemini");
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageTip, setImageTip] = useState("");

  const tabs = [
    { id: "chat", label: "ครูแชทบอทอัจฉริยะ", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "image", label: "เอไอวาดรูปศิลปะ", icon: <ImageIcon className="w-4 h-4" /> }
  ] as const;

  // -- API OPERATIONS --

  // Chat Submission
  const handleSendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput;
    setChatInput("");
    setChatHistory((prev) => [...prev, { role: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: chatHistory }),
      });
      const data = await response.json();
      setChatHistory((prev) => [...prev, { role: "model", text: data.text }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { role: "model", text: "โอ๊ะโอ... เกิดขัดข้องในการเชื่อมต่อสมองส่วนแชท ลองพิมพ์อีกทีนะจ๊ะ" }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Image Generation Submission
  const handleGenerateImage = async () => {
    if (!imagePrompt.trim() || imageLoading) return;
    setImageLoading(true);
    setGeneratedImgUrl(null);
    setImageTip("");
    try {
      const response = await fetch("/api/gemini/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, model: imageModel }),
      });
      const data = await response.json();
      setGeneratedImgUrl(data.imageUrl);
      if (data.offline) {
        setImageTip(data.tip);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col gap-8 font-ui" id="playground">
      
      {/* Page Header */}
      <div>
        <h1 className="font-heading text-2xl md:text-4xl font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-brand-primary" />
          ห้องปฏิบัติการ AI อัจฉริยะ (Interactive Lab)
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
          เรียนรู้ผ่านการทดสอบและลองคุย ลองเล่นจริงกับ AI ตัวจริงเพื่อพัฒนาทักษะวิชาชีพในอนาคต!
        </p>
      </div>

      {/* Tabs navigation list */}
      <div className="flex flex-wrap gap-2.5 border-b border-slate-200 dark:border-slate-800 pb-3">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-brand-primary text-white shadow-md shadow-brand-primary/10"
                  : "bg-white dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Demonstration Viewport */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm min-h-[450px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: Chat Tutor */}
          {activeTab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col h-[500px]"
            >
              <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 mb-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-[80%] ${msg.role === "user" ? "ml-auto items-end" : "mr-auto items-start"}`}
                  >
                    <div className={`p-4 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.role === "user" 
                        ? "bg-brand-primary text-white rounded-br-none" 
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-100 dark:border-slate-700/50"
                    }`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                    <span className="text-[9px] text-slate-400 mt-1 font-bold">
                      {msg.role === "user" ? "คุณ" : "AI Tutor"}
                    </span>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                    <span className="w-2.5 h-2.5 bg-brand-primary rounded-full animate-bounce"></span>
                    <span>AI Mentor กำลังเรียบเรียงความคิดภาษาคนให้เธอ...</span>
                  </div>
                )}
              </div>

              {/* Chat Input Area */}
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="เขียนถามครู AI เช่น 'Deep Learning กับ ML ต่างกันตรงไหนจ๊ะ'..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendChat(); }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="px-5 py-3 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl shadow-md flex items-center justify-center disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* TAB 3: Image Generator */}
          {activeTab === "image" && (
            <motion.div
              key="image"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-4 justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white">วาดฝันจินตนาการด้วย AI ภาพนิ่ง 🎨</h3>
                  <p className="text-xs text-slate-500 mt-1 mb-2">
                    ป้อนข้อความอธิบายภาพที่เธออยากเห็นลงไป แล้ว AI โมเดลศิลปินจะเปลี่ยนประโยคให้กลายเป็นภาพวาดในพริบตา!
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a href="https://gemini.google.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1.5 rounded-full font-bold hover:bg-indigo-200 transition-colors">
                      <Sparkles className="w-3 h-3" /> ลองสร้างรูปบน Gemini
                    </a>
                    <a href="https://chatgpt.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 px-3 py-1.5 rounded-full font-bold hover:bg-teal-200 transition-colors">
                      <ImageIcon className="w-3 h-3" /> ลองสร้างรูปบน ChatGPT
                    </a>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <select
                      value={imageModel}
                      onChange={(e) => setImageModel(e.target.value)}
                      className="px-3 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-white"
                    >
                      <option value="gemini">Gemini</option>
                      <option value="chatgpt">ChatGPT (DALL-E)</option>
                      <option value="claude">Claude</option>
                    </select>
                    <input
                      type="text"
                      placeholder="เช่น: 'แมวนักบินอวกาศกำลังรับประทานแครอทอยู่บนอวกาศแสนสดใส'..."
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-white"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    *โมเดลที่เลือก: {imageModel === "gemini" ? "Gemini" : imageModel === "chatgpt" ? "ChatGPT" : "Claude"}
                  </span>
                </div>

                <button
                  onClick={handleGenerateImage}
                  disabled={imageLoading || !imagePrompt.trim()}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40"
                >
                  <Sparkles className="w-4.5 h-4.5 animate-spin" />
                  {imageLoading ? "กำลังผสมสีในอวกาศศิลปะ..." : "สร้างรูปภาพจินตนาการ"}
                </button>

                {/* Educational notes */}
                <div className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-[10px] text-slate-500 leading-relaxed font-ui">
                  <strong className="text-slate-700 dark:text-slate-300 block mb-1">💡 ความรู้: AI วาดรูปได้อย่างไร?</strong>
                  AI วาดรูปผ่านกระบวนการที่เรียกว่า **Latent Diffusion** เริ่มต้นจากกลุ่ม 'เม็ดฝุ่นสัญญาณรบกวนสีขาว' (Gaussian Noise) แล้ว AI จะค่อยๆ ใช้ทฤษฎีเดาลดปริมาณฝุ่นนั้นออกไปทีละสเต็ปตามคำคีย์เวิร์ดของเธอจนเกิดภาพเป็นวัตถุคมชัดจ้ะ!
                </div>
              </div>

              {/* Rendered Artwork view */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-center items-center min-h-[300px]">
                {imageLoading ? (
                  <div className="flex flex-col items-center gap-2.5 text-xs text-slate-400 animate-pulse">
                    <span className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></span>
                    <span>ศิลปินโมเดลสกัดเม็ดพิกเซลสีให้เธอ...</span>
                  </div>
                ) : generatedImgUrl ? (
                  <div className="flex flex-col items-center gap-4 w-full">
                    <img
                      src={generatedImgUrl}
                      alt="Gemini generated result"
                      className="max-w-[280px] w-full aspect-square rounded-xl shadow-md border border-slate-200/30 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {imageTip && (
                      <span className="text-[10px] bg-amber-50 dark:bg-amber-950/20 text-amber-600 px-3 py-1.5 rounded-lg border border-amber-200/30 font-bold leading-relaxed text-center max-w-xs">
                        {imageTip}
                      </span>
                    )}
                    <a
                      href={generatedImgUrl}
                      download="ai-mentor-artwork.png"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-950 text-white font-bold text-xs rounded-xl transition-all"
                    >
                      ดาวน์โหลดภาพเก็บไว้ส่งงาน
                    </a>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center gap-2 py-12">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                    <span>ภาพวาดศิลปินจะขึ้นแสดงตรงนี้เมื่อป้อนคำสั่งจ้ะ</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}



        </AnimatePresence>
      </div>

    </div>
  );
}
