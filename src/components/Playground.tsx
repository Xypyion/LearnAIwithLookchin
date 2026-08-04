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

  // MODULE 2: Prompt Playground State
  const [promptInput, setPromptInput] = useState("");
  const [promptResult, setPromptResult] = useState<any>(null);
  const [promptLoading, setPromptLoading] = useState(false);

  // MODULE 3: Image Gen State
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImgUrl, setGeneratedImgUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageTip, setImageTip] = useState("");

  // MODULE 4: Vision Classifier State
  const [visionImage, setVisionImage] = useState<string | null>(null);
  const [visionMime, setVisionMime] = useState("image/jpeg");
  const [visionResult, setVisionResult] = useState<any>(null);
  const [visionLoading, setVisionLoading] = useState(false);

  // MODULE 5: Sentiment State
  const [sentimentInput, setSentimentInput] = useState("");
  const [sentimentResult, setSentimentResult] = useState<any>(null);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  // MODULE 6: Drawing Game State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingGuess, setDrawingGuess] = useState<{ guess: string; score: number } | null>(null);

  const tabs = [
    { id: "chat", label: "ครูแชทบอทอัจฉริยะ", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "prompt", label: "พรอมต์ประเมิน", icon: <Terminal className="w-4 h-4" /> },
    { id: "image", label: "เอไอวาดรูปศิลปะ", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "vision", label: "ดวงตาวิเคราะห์ภาพ", icon: <Eye className="w-4 h-4" /> },
    { id: "sentiment", label: "วิเคราะห์อารมณ์ข้อความ", icon: <Smile className="w-4 h-4" /> },
    { id: "drawing", label: "เกมวาดทายสเตจ", icon: <PenTool className="w-4 h-4" /> }
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

  // Prompt Grader Submission
  const handleEvaluatePrompt = async () => {
    if (!promptInput.trim() || promptLoading) return;
    setPromptLoading(true);
    try {
      const response = await fetch("/api/gemini/evaluate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptInput }),
      });
      const data = await response.json();
      setPromptResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPromptLoading(false);
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
        body: JSON.stringify({ prompt: imagePrompt }),
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

  // Sentiment Analyzer Submission
  const handleAnalyzeSentiment = async () => {
    if (!sentimentInput.trim() || sentimentLoading) return;
    setSentimentLoading(true);
    try {
      const response = await fetch("/api/gemini/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: sentimentInput }),
      });
      const data = await response.json();
      setSentimentResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSentimentLoading(false);
    }
  };

  // Vision Classify Submission
  const handleClassifyImage = async (base64Str: string, mime: string) => {
    setVisionLoading(true);
    setVisionResult(null);
    try {
      const response = await fetch("/api/gemini/classify-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Str, mimeType: mime }),
      });
      const data = await response.json();
      setVisionResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setVisionLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64Data = resultStr.split(",")[1];
      setVisionImage(resultStr);
      setVisionMime(file.type);
      handleClassifyImage(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  // Trigger classification on default preset image
  const triggerPresetVision = () => {
    const defaultRobotBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="; // Minimal base64
    setVisionImage("https://lh3.googleusercontent.com/aida-public/AB6AXuCUvkJmVLAemaYjqFjdXLjBXSDu0TjpEXmKiOSxooVrLmv57Xf1qBlLHpXq-vPtMBbSVrmcist6sVvhJ_8yHVfHYaM5hmHed4zZeIZQsW9PjRDqXqj_22iTbex_mQRLTyzKAyMF-BTW8NY_3RJgTYGwXrf1ODEuUgFkZdMlrclAzQYVxS0FMWZOjGOgLkU8piY96hccPPTCjyV3KpVeF5uzvR2ExLq_xZ6xDt77C-dqZfLRWxX0aTFkDDLvyQjMbCc9Sdppa0qX0Q");
    setVisionMime("image/png");
    handleClassifyImage(defaultRobotBase64, "image/png");
  };

  // -- MODULE 6: DRAWING CANVAS RECOGNITION --
  useEffect(() => {
    if (activeTab === "drawing" && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#2563eb";
        ctx.lineWidth = 4;
        ctx.lineCap = "round";
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clientX, clientY;
    if ("touches" in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();

    // Perform live heuristic shape guessing
    analyzeDrawingHeuristic();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    setDrawingGuess(null);
  };

  // Local drawing evaluator analyzing geometric aspects of drawn path
  const analyzeDrawingHeuristic = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Read canvas pixels to evaluate density
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    let darkPixels = 0;
    
    // Scan coordinates
    let minX = canvas.width, maxX = 0, minY = canvas.height, maxY = 0;

    for (let y = 0; y < canvas.height; y += 4) {
      for (let x = 0; x < canvas.width; x += 4) {
        const idx = (y * canvas.width + x) * 4;
        const r = data[idx], g = data[idx+1], b = data[idx+2];
        if (r < 200 || g < 200 || b < 200) { // Black pixel drawn
          darkPixels++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (darkPixels < 15) {
      setDrawingGuess(null);
      return;
    }

    const width = maxX - minX;
    const height = maxY - minY;
    const ratio = width / Math.max(1, height);

    let guess = "กำลังวิเคราะห์โครงสร้างหลักของวัตถุ...";
    let score = 55;

    if (ratio > 0.8 && ratio < 1.2) {
      if (darkPixels > 100) {
        guess = "ใบหน้ายิ้มแย้ม (Smile Face) ☺";
        score = 88;
      } else {
        guess = "รูปวงกลมเรขาคณิต (Circle) ◯";
        score = 92;
      }
    } else if (ratio >= 1.5) {
      guess = "รูปสี่เหลี่ยมผืนผ้า (Rectangle) ▭";
      score = 85;
    } else if (height > width * 1.5) {
      guess = "ต้นไม้การศึกษาหรือเส้นตรง (Line) |";
      score = 78;
    } else {
      guess = "รูปสามเหลี่ยมเรขาคณิต (Triangle) △";
      score = 82;
    }

    setDrawingGuess({ guess, score });
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

          {/* TAB 2: Prompt Playground */}
          {activeTab === "prompt" && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white">เครื่องวัดคุณภาพคำสั่ง (Prompt Grader) 🎯</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ลองพิมพ์คำสั่งที่เธออยากจะสั่งให้ AI ทำงาน เพื่อวัดผลคะแนนและเรียนรู้ความลับของการออกแบบ Prompt Engineering!
                  </p>
                </div>

                <div className="flex flex-col gap-1.5">
                  <textarea
                    rows={4}
                    placeholder="ตัวอย่างเช่น: 'ช่วยอธิบายเรื่องดาวอังคารสั้นๆ'"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-white font-mono"
                  ></textarea>
                </div>

                <button
                  onClick={handleEvaluatePrompt}
                  disabled={promptLoading || !promptInput.trim()}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40"
                >
                  <Sparkles className="w-4.5 h-4.5 animate-spin" />
                  {promptLoading ? "สมองกลกำลังวัดสัดส่วนคำสั่ง..." : "ประเมินและเกรดคุณภาพคำสั่ง"}
                </button>
              </div>

              {/* Evaluation Outcome Display */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-center">
                {promptResult ? (
                  <div className="flex flex-col gap-4 text-xs font-ui">
                    <div className="flex justify-between items-center">
                      <span className="font-heading text-sm font-bold text-slate-700 dark:text-slate-300">เกรดประเมิน:</span>
                      <div className="text-right">
                        <span className="font-heading text-3xl font-extrabold text-brand-primary">{promptResult.score}</span>
                        <span className="text-slate-400 font-bold"> /100</span>
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-600 dark:text-slate-300 block">อธิบายประเด็นสำคัญ:</span>
                      <p className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{promptResult.explanation}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <div className="p-3 bg-green-500/5 rounded-xl border border-green-200/20 text-green-700 dark:text-green-400">
                        <strong className="block text-[10px]">🟢 จุดเด่นของเธอ:</strong>
                        <ul className="list-disc pl-3 mt-1 text-[10px] flex flex-col gap-1">
                          {promptResult.strengths?.map((s: string, i: number) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div className="p-3 bg-red-500/5 rounded-xl border border-red-200/20 text-red-700 dark:text-red-400">
                        <strong className="block text-[10px]">🔴 จุดปรับปรุง:</strong>
                        <ul className="list-disc pl-3 mt-1 text-[10px] flex flex-col gap-1">
                          {promptResult.weaknesses?.map((w: string, i: number) => <li key={i}>{w}</li>)}
                        </ul>
                      </div>
                    </div>

                    <div className="p-4 bg-brand-primary/5 rounded-xl border border-brand-primary/10">
                      <strong className="text-brand-primary block text-[10px]">✨ คำสั่งที่ปรับปรุงอัพเกรด (เกรด 100เต็ม):</strong>
                      <p className="text-slate-600 dark:text-slate-200 mt-1 font-mono text-[11px] select-all bg-white dark:bg-slate-800 p-2.5 rounded-lg border border-brand-primary/5">
                        {promptResult.improvedPrompt}
                      </p>
                    </div>

                    <p className="text-[10px] text-brand-accent font-bold">
                      💡 {promptResult.learningTips}
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center gap-2 py-12">
                    <Terminal className="w-10 h-10 text-slate-300 animate-pulse" />
                    <span>ผลลัพธ์การจัดเกรดจะขึ้นแสดงตรงนี้เมื่อเธอกดส่งนะจ๊ะ</span>
                  </div>
                )}
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
                  <p className="text-xs text-slate-500 mt-1">
                    ป้อนข้อความอธิบายภาพที่เธออยากเห็นลงไป แล้ว AI โมเดลศิลปินจะเปลี่ยนประโยคให้กลายเป็นภาพวาดในพริบตา!
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="เช่น: 'แมวนักบินอวกาศกำลังรับประทานแครอทอยู่บนอวกาศแสนสดใส'..."
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-white"
                  />
                  <span className="text-[10px] text-slate-400">
                    *โมเดลหลัก: gemini-3.1-flash-lite-image
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

          {/* TAB 4: Computer Vision Classifier */}
          {activeTab === "vision" && (
            <motion.div
              key="vision"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-4 justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white">ดวงตาปัญญาประดิษฐ์ (Computer Vision) 👁️</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    อัปโหลดรูปภาพจากอุปกรณ์ของเธอ หรือทดสอบใช้ภาพหุ่นยนต์เริ่มต้นเพื่อให้ AI ทำการสแกนและล้อมกรอบคัดแยกวัตถุเหมือนระบบกล้องจับป้ายทะเบียน
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    {/* Native Upload trigger */}
                    <label className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                      <Upload className="w-4 h-4" /> อัปโหลดภาพของเธอ
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <button
                      onClick={triggerPresetVision}
                      className="px-4 py-3 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary font-bold text-xs rounded-xl transition-all"
                    >
                      วิเคราะห์ภาพหุ่นยนต์สาธิต
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800/50 rounded-xl text-[10px] text-slate-500 leading-relaxed font-ui">
                  <strong className="text-slate-700 dark:text-slate-300 block mb-1">🧠 ความรู้ชั้นเรียน: Convolutional Neural Network (CNN)</strong>
                  AI วิเคราะห์ภาพผ่านโมเดล **CNN** โดยคูณค่าพิกเซลด้วยคอร์เนลฟิลเตอร์เพื่อสกัดกลุ่ม 'ขอบมุมเฉดสีสว่าง' จนระบุโครงสร้างกลุ่มวัตถุได้อย่างมหัศจรรย์
                </div>
              </div>

              {/* Analysis Result Display */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-center min-h-[300px]">
                {visionLoading ? (
                  <div className="flex flex-col items-center gap-2.5 text-xs text-slate-400 animate-pulse">
                    <span className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></span>
                    <span>ดวงตาสมองกลกวาดค่าพิกเซลแสง...</span>
                  </div>
                ) : visionResult ? (
                  <div className="flex flex-col gap-4 text-xs font-ui">
                    <div className="flex gap-4 items-center border-b border-slate-200/40 pb-4">
                      {visionImage && (
                        <img
                          src={visionImage}
                          alt="Analyzed preview"
                          className="w-16 h-16 rounded-lg object-cover border border-slate-300/30 shadow-sm"
                        />
                      )}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold block">วัตถุหลักที่ระบุ:</span>
                        <strong className="text-sm font-heading text-slate-800 dark:text-white">{visionResult.primaryObject}</strong>
                        <span className="block text-[10px] text-brand-secondary font-bold mt-0.5">ความมั่นใจ: {visionResult.confidenceScore}%</span>
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-600 dark:text-slate-300 block">องค์ประกอบย่อยที่ตรวจจับพบ:</span>
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {visionResult.detectedItems?.map((item: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 rounded-full font-bold text-[10px]">
                            🔍 {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-bold text-slate-600 dark:text-slate-300 block">คำอธิบายโครงสร้างระบบดวงตา:</span>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{visionResult.explanation}</p>
                    </div>

                    <div className="p-3 bg-brand-primary/5 rounded-xl border border-brand-primary/10 text-brand-primary leading-relaxed text-[10px]">
                      <strong>💡 เกร็ดความรู้:</strong> {visionResult.educationalNote}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center gap-2 py-12">
                    <Eye className="w-10 h-10 text-slate-300" />
                    <span>ภาพพรีวิวผลวิเคราะห์วิชั่นจะขึ้นตรงนี้จ้ะ</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 5: Sentiment Analysis */}
          {activeTab === "sentiment" && (
            <motion.div
              key="sentiment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-4 justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white">เกจวัดอารมณ์ความรู้สึกข้อความ (Sentiment Analysis) 😄</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    พิมพ์ประโยคคำพูดที่พบเจอในเน็ตหรือบทความเพื่อให้นวัตกรรมสมองกลแยกแยะว่าข้อความนั้นเป็นเชิงบวก เชิงลบ หรือมีพลังงานดีแฝงอยู่อย่างไร!
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="เช่น: 'ฉันชอบโครงงานสร้างหุ่นยนต์วันนี้มากเลยมันเจ๋งฝุดๆ'..."
                    value={sentimentInput}
                    onChange={(e) => setSentimentInput(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary text-slate-800 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleAnalyzeSentiment}
                  disabled={sentimentLoading || !sentimentInput.trim()}
                  className="w-full py-3 bg-brand-primary hover:bg-brand-primary/95 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md disabled:opacity-40"
                >
                  <Smile className="w-4.5 h-4.5" />
                  {sentimentLoading ? "หัววัดความรู้สึกกำลังวิเคราะห์ดัชนี..." : "วิเคราะห์ประจุอารมณ์ข้อความ"}
                </button>
              </div>

              {/* Sentiment Outcome display */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-center min-h-[300px]">
                {sentimentLoading ? (
                  <div className="flex flex-col items-center gap-2.5 text-xs text-slate-400 animate-pulse">
                    <span className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></span>
                    <span>สมองกลด้าน NLP กำลังแกะสำนวนทางอารมณ์...</span>
                  </div>
                ) : sentimentResult ? (
                  <div className="flex flex-col gap-4 text-xs font-ui text-center items-center">
                    <span className="text-5xl">{sentimentResult.emoji || "😊"}</span>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">ผลการตรวจจับค่าอารมณ์:</span>
                      <strong className="text-base font-heading text-slate-800 dark:text-white block mt-0.5">{sentimentResult.sentiment}</strong>
                      <span className="text-brand-primary font-bold text-[10px]">ความมั่นใจของผลลัพธ์: {sentimentResult.score}%</span>
                    </div>

                    <div className="border-t border-slate-200/40 w-full pt-4 text-left">
                      <span className="font-bold text-slate-600 dark:text-slate-300 block">เหตุผลของระบบคอมพิวเตอร์:</span>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed mt-1">{sentimentResult.explanation}</p>
                    </div>

                    <div className="p-3 bg-brand-secondary/10 text-brand-secondary rounded-xl border border-brand-secondary/20 leading-relaxed text-left w-full text-[10px]">
                      <strong>💡 คำแนะนำสร้างสรรค์สำหรับเด็กๆ:</strong> {sentimentResult.advice}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center gap-2 py-12">
                    <Smile className="w-10 h-10 text-slate-300" />
                    <span>ผลลัพธ์ดัชนีความรู้สึกจะปรากฏตรงนี้จ้ะ</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 6: Geometric Drawing Game */}
          {activeTab === "drawing" && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="flex flex-col gap-4 justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-slate-800 dark:text-white">เกมทายรูปวาดคอมพิวเตอร์อัจฉริยะ (Drawing Recognition) 🎨</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ลองวาดรูปทรงเรขาคณิต เช่น **วงกลม ◯ สามเหลี่ยม △ สี่เหลี่ยม ▭ หรือใบหน้ายิ้มแย้ม ☺** ลงบนกระดาน แล้ว AI จะทายสิ่งที่คุณวาดแบบเรียลไทม์!
                  </p>
                </div>

                {/* Canvas sketching board */}
                <div className="flex flex-col items-center gap-3">
                  <canvas
                    ref={canvasRef}
                    width={280}
                    height={200}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="border-2 border-dashed border-brand-primary rounded-xl cursor-crosshair bg-white touch-none"
                  ></canvas>

                  <button
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-1"
                  >
                    <Eraser className="w-4 h-4" /> ล้างกระดานวาดใหม่
                  </button>
                </div>
              </div>

              {/* Live drawing estimation display */}
              <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 flex flex-col justify-center items-center text-center">
                {drawingGuess ? (
                  <div className="flex flex-col gap-4 text-xs font-ui">
                    <div className="p-3 bg-brand-primary/10 text-brand-primary rounded-full animate-bounce">
                      <PenTool className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">AI คาดการณ์ว่าเธอกำลังวาด:</span>
                      <strong className="text-lg font-heading text-slate-800 dark:text-white block mt-1">
                        {drawingGuess.guess}
                      </strong>
                      <span className="block text-brand-primary font-bold text-[11px] mt-1">ความเชื่อมโยงเชิงสถิติ: {drawingGuess.score}%</span>
                    </div>
                    
                    <p className="text-[10px] text-slate-500 leading-relaxed mt-2 max-w-xs">
                      *เกร็ดสมองกล: กล้องวิเคราะห์ความสมมาตรทางพิกัดแกน X และ Y (พิกัดสูงสุดลบพิกัดต่ำสุด) เพื่อหาอัตราส่วนโครงสร้างรูปทรงภายนอกจ้ะ!
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-slate-400 flex flex-col items-center gap-2 py-12">
                    <PenTool className="w-10 h-10 text-slate-300 animate-pulse" />
                    <span>เริ่มวาดลงบนกระดานด้านซ้ายเพื่อทดสอบระบบจ้ะ</span>
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
