import React from "react";
import { motion } from "motion/react";
import { ExternalLink, Sparkles } from "lucide-react";

export default function Playground() {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-10 md:py-16 flex flex-col items-center gap-10 font-ui" id="playground">
      {/* Title & Introduction */}
      <motion.div 
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl flex flex-col items-center gap-3"
      >
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 shadow-sm">
          <Sparkles className="w-4 h-4 text-brand-accent" />
          AI Playground & Direct Portals
        </span>
        <h1 className="font-heading text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ห้องทดลองปัญญาประดิษฐ์
        </h1>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-300">
          คลิกที่โลโก้เพื่อเปิดใช้งานและสนทนากับ AI ชั้นนำระดับโลกได้ทันทีในแท็บใหม่
        </p>
      </motion.div>

      {/* Main 2 Big AI Portal Cards */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {/* Card 1: ChatGPT */}
        <motion.a
          href="https://chatgpt.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex flex-col items-center justify-center p-8 md:p-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-slate-900 dark:hover:border-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
          id="chatgpt-portal-card"
        >
          {/* Subtle Background Glow on Hover */}
          <div className="absolute inset-0 bg-slate-500/5 group-hover:bg-slate-500/10 transition-colors pointer-events-none" />

          {/* Top Right External Link Badge */}
          <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors">
            <span>เปิด ChatGPT</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          {/* Big ChatGPT Logo */}
          <div className="w-full max-w-[280px] md:max-w-[340px] aspect-video flex items-center justify-center text-slate-900 dark:text-white p-4">
            <svg 
              viewBox="0 0 1600 900" 
              className="w-full h-full object-contain filter group-hover:drop-shadow-md transition-all duration-300"
            >
              <g transform="translate(800, 450) scale(1.25)">
                <path 
                  fill="currentColor" 
                  fillRule="evenodd" 
                  clipRule="evenodd" 
                  d="M 28.5,-162.7 C 49.3,-162.7 69.1,-153.8 83,-138.2 L 95.8,-123.9 L 95.8,-53.4 L 140.2,-27.8 C 160.8,-15.9 174.5,4.7 176.8,28.4 C 179.1,52 169.7,75.1 151.7,90.4 L 139.3,101 L 78.4,136.2 L 78.4,206.8 C 78.4,230.8 65.6,252.9 44.8,264.9 C 24,276.9 -1.8,276.9 -22.6,264.9 L -35,257.7 L -95.8,222.6 L -140.2,248.2 C -160.8,260.1 -186.2,258.9 -205.6,245.1 C -225,231.3 -235.1,207.2 -231.8,183.4 L -229.5,167 L -168.6,131.8 L -168.6,61.2 C -168.6,37.2 -155.8,15.1 -135,-3.1 L -122.6,-10.3 L -61.8,-45.4 L -61.8,-115.9 C -61.8,-139.9 -49,-162 -28.2,-174 C -10.9,-184 8.8,-185.8 28.5,-162.7 Z M -5.2,-132.8 C -14.6,-132.8 -23.6,-127.6 -28.3,-119.5 C -33,-111.4 -33,-101.4 -28.3,-93.3 L 5.3,-35 L 35.8,-52.6 L 35.8,-119.5 C 35.8,-123.1 34.4,-126.5 31.9,-129 C 29.4,-131.5 26,-132.8 22.4,-132.8 L -5.2,-132.8 Z M 64.6,-88.7 L 64.6,-18.4 L 125.4,16.7 C 133.5,21.4 138.7,30.4 138.7,39.8 C 138.7,49.2 133.5,58.2 125.4,62.9 L 67.5,96.3 L 67.5,61.2 L 6.7,26.1 L 64.6,-88.7 Z M 13.9,61.2 L 13.9,131.5 L -46.9,96.4 C -55,91.7 -60.2,82.7 -60.2,73.3 C -60.2,63.9 -55,54.9 -46.9,50.2 L 11,16.8 L 13.9,61.2 Z M -67.5,35 L -67.5,-35.3 L -6.7,-70.4 L 54.1,-35.3 L 54.1,35 L -6.7,70.1 L -67.5,35 Z M -125.4,-16.7 L -64.6,-51.8 L -64.6,-122.1 L -3.8,-157.2 C -1.8,-158.4 -0.2,-160 0.9,-162 C -9.8,-160.8 -20,-155.6 -26.5,-147.2 L -74.7,-84.9 L -125.4,-16.7 Z M -138.7,-39.8 C -138.7,-49.2 -133.5,-58.2 -125.4,-62.9 L -67.5,-96.3 L -98,-149.2 C -107.4,-143.7 -114.7,-135.1 -118.6,-124.7 C -122.5,-114.3 -122.7,-102.9 -119.2,-92.4 L -116.5,-84.2 L -135.7,-51 C -137.7,-47.5 -138.7,-43.7 -138.7,-39.8 Z"
                />
              </g>
            </svg>
          </div>

          {/* Card Caption / Action */}
          <div className="mt-4 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              ChatGPT
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              โดย OpenAI • เข้าใช้งานโมเดลภาษาและการตอบคำถามอัจฉริยะ
            </p>
          </div>
        </motion.a>

        {/* Card 2: Gemini */}
        <motion.a
          href="https://gemini.google.com"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group relative flex flex-col items-center justify-center p-8 md:p-12 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
          id="gemini-portal-card"
        >
          {/* Subtle Background Glow on Hover */}
          <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

          {/* Top Right External Link Badge */}
          <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 rounded-full text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors">
            <span>เปิด Gemini</span>
            <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>

          {/* Big Gemini Logo */}
          <div className="w-full max-w-[280px] md:max-w-[340px] aspect-video flex items-center justify-center text-slate-900 dark:text-white p-4">
            <svg 
              viewBox="0 0 1600 900" 
              className="w-full h-full object-contain filter group-hover:drop-shadow-md transition-all duration-300"
            >
              <defs>
                <linearGradient id="geminiCardGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#1aa260"/>
                  <stop offset="25%" stopColor="#ffce44"/>
                  <stop offset="50%" stopColor="#1a73e8"/>
                  <stop offset="75%" stopColor="#4285f4"/>
                  <stop offset="100%" stopColor="#ea4335"/>
                </linearGradient>
              </defs>

              <g transform="translate(60, 160)">
                {/* 4-point curved Gemini Sparkle Star */}
                <g transform="translate(160, 290) scale(1.55)">
                  <path fill="url(#geminiCardGrad)" d="M 0,-150 C 0,-40 40,0 150,0 C 40,0 0,40 0,150 C 0,40 -40,0 -150,0 C -40,0 0,-40 0,-150 Z" />
                </g>

                {/* Gemini Typography */}
                <g transform="translate(470, 390)">
                  <text 
                    fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Google Sans', 'SF Pro Display', Roboto, sans-serif" 
                    fontSize="280" 
                    fontWeight="700" 
                    fill="currentColor" 
                    letterSpacing="-4"
                  >
                    Gemini
                  </text>
                </g>
              </g>
            </svg>
          </div>

          {/* Card Caption / Action */}
          <div className="mt-4 text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Gemini
            </h2>
            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
              โดย Google • สัมผัสพลังโมเดล AI มัลติโมดอลที่ทรงพลังและรวดเร็ว
            </p>
          </div>
        </motion.a>
      </div>
    </div>
  );
}
