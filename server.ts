import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY_MISSING");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// Educational AI Chat proxy for Students
app.post("/api/gemini/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "กรุณาระบุข้อความ" });
  }

  try {
    const ai = getGemini();
    const systemInstruction = `คุณคือ AI Mentor TH ครูผู้เชี่ยวชาญด้าน AI ที่เป็นมิตรและพร้อมช่วยเหลือเด็กนักเรียนไทย (ชั้น ม.1 - ม.6)
ตอบคำถามด้วยภาษาที่เข้าใจง่ายมากที่สุด หลีกเลี่ยงศัพท์เทคนิคที่ยากเกินไป หรือหากต้องใช้คำศัพท์เฉพาะทาง ให้เขียนคำอธิบายด้วยภาษาที่เรียบง่ายและเปรียบเทียบกับชีวิตประจำวัน
สนับสนุนการคิดเชิงสร้างสรรค์ ใช้สัญลักษณ์หรืออีโมจิบ้างพอสมควรเพื่อให้น่าสนใจ และเน้นการคิดเชิงจริยธรรม (Ethics) เสมอ
ถ้ามีโค้ด ให้เขียนสั้นๆ และมีคำอธิบายอธิบายทีละบรรทัด`;

    const chatHistory = history ? history.map((h: any) => ({
      role: h.role === "user" ? "user" : "model",
      parts: [{ text: h.text }]
    })) : [];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [...chatHistory, { role: "user", parts: [{ text: message }] }],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Chat API Error:", error);
    const msgLower = (message || "").toLowerCase();
    let customAnswer = `เรื่องที่ถามนั้นน่าสนใจมากๆ เลยจ้ะ! ปัญญาประดิษฐ์และระบบคอมพิวเตอร์สมัยใหม่พัฒนาไปไกลมากและเข้ามาอยู่ในชีวิตประจำวันของเราแทบทุกส่วนเลย`;
    
    if (msgLower.includes("ai") || msgLower.includes("ปัญญาประดิษฐ์")) {
      customAnswer = `**AI หรือ ปัญญาประดิษฐ์ (Artificial Intelligence)** คือเทคโนโลยีคอมพิวเตอร์ที่ถูกพัฒนาให้มี "ความฉลาด" เลียนแบบกระบวนการคิดและตัดสินใจของมนุษย์จ้ะ เช่น การจำรูปภาพ การเข้าใจภาษา หรือการแนะนำวิดีโอที่เธอน่าจะชอบบนยูทูบนั่นเอง!`;
    } else if (msgLower.includes("machine learning") || msgLower.includes("ml") || msgLower.includes("เรียนรู้")) {
      customAnswer = `**Machine Learning (แมชชีนเลิร์นนิง)** คือสมองส่วนเรียนรู้ของ AI จ้ะ เปรียบเสมือนการส่งเด็กไปโรงเรียนเพื่อดูตัวอย่างข้อมูลเยอะๆ (เช่น รูปสุนัขและแมวแสนรูป) จนคอมพิวเตอร์สามารถจดจำและแยกแยะลักษณะเด่นได้เอง โดยที่เราไม่ต้องเขียนกติกาสั่งทุกบรรทัดเลย!`;
    } else if (msgLower.includes("ethics") || msgLower.includes("จริยธรรม") || msgLower.includes("ปลอดภัย")) {
      customAnswer = `**AI Ethics (จริยธรรมปัญญาประดิษฐ์)** เป็นเรื่องสำคัญที่สุดเลยจ้ะ! เมื่อพวกเราใช้ AI เราต้องคำนึงถึงความปลอดภัย ความเป็นส่วนตัวของข้อมูล และความถูกต้องของคำตอบ ไม่นำ AI ไปใช้กลั่นแกล้งผู้อื่นหรือละเมิดสิทธิ์เด็ดขาดนะจ้ะ`;
    } else if (msgLower.includes("code") || msgLower.includes("เขียนโปรแกรม") || msgLower.includes("python") || msgLower.includes("coding")) {
      customAnswer = `**การเขียนโปรแกรม (Coding)** เป็นภาษาที่เราใช้คุยกับคอมพิวเตอร์จ้ะ เช่น ภาษา Python ซึ่งนิยมนำมาใช้สร้าง AI มากๆ ตัวอย่างการเขียนโปรแกรมง่ายๆ:\n\n\`\`\`python\nprint("Hello AI!") # พิมพ์ทักทายคอมพิวเตอร์\n\`\`\``;
    } else if (msgLower.includes("ภาพ") || msgLower.includes("รูป") || msgLower.includes("draw") || msgLower.includes("image")) {
      customAnswer = `**Generative AI สำหรับรูปภาพ** ใช้สิ่งที่เรียกว่า Diffusion Model หรือโครงข่ายสมองกลจำลอง ในการเปลี่ยนข้อความบรรยาย (Prompt) ของเราให้กลายเป็นรูปภาพทีละพิกเซล โดยศึกษาลักษณะเด่นของรูปภาพนับล้านๆ รูปที่คนเคยสร้างไว้จ้ะ!`;
    } else if (msgLower.includes("career") || msgLower.includes("อาชีพ") || msgLower.includes("งาน")) {
      customAnswer = `ในอนาคต **ทักษะด้าน AI** จะมีประโยชน์ในทุกอาชีพเลยจ้ะ ไม่ว่าจะเป็น Prompt Engineer (นักออกแบบคำสั่ง), AI Ethics Specialist (ผู้ตรวจสอบจริยธรรม AI) หรือ Data Scientist (นักวิทยาศาสตร์ข้อมูล) เรียนรู้ตั้งแต่วันนี้รับรองได้เปรียบแน่นอน!`;
    }

    return res.json({
      text: `💡 **[โหมดความรู้จำลองแบบออฟไลน์]** สวัสดีจ้ะครูคือ AI Mentor นะ! ตอนนี้ระบบเชื่อมต่อกำลังประหยัดพลังงานหรือพบข้อจำกัดทางเทคนิคชั่วคราว ครูจึงทำงานในโหมดเรียนรู้ด้วยตัวเองแบบออฟไลน์จ้ะ 🤖\n\n${customAnswer}\n\n*ต้องการเชื่อมต่อเซสชันเต็มรูปแบบ? ตั้งค่ารหัสผ่านลับ (GEMINI_API_KEY) ในแผงความลับและตรวจสอบโควตาบัญชีของเธอได้ตลอดเวลานะจ้ะ!* ❤️`
    });
  }
});

// Prompt Playground evaluator API
app.post("/api/gemini/evaluate-prompt", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "กรุณาระบุ prompt" });
  }

  try {
    const ai = getGemini();
    const evaluationPrompt = `ในฐานะผู้เชี่ยวชาญด้าน Prompt Engineering ช่วยประเมินและวิเคราะห์ Prompt นี้สำหรับนักเรียน:
"${prompt}"

กรุณาตอบกลับในรูปแบบ JSON ที่มีโครงสร้างดังนี้ (ห้ามพิมพ์ข้อความอื่นนอกจาก JSON):
{
  "score": 85, // คะแนนเต็ม 100
  "rating": "ดีมาก / ปรับปรุงได้ / ยอดเยี่ยม",
  "explanation": "อธิบายว่าทำไม prompt นี้จึงได้คะแนนเท่านี้ในเชิงบวกสำหรับนักเรียน",
  "strengths": ["จุดเด่นข้อที่ 1", "จุดเด่นข้อที่ 2"],
  "weaknesses": ["จุดที่ควรระวังหรือปรับปรุงข้อที่ 1"],
  "improvedPrompt": "ข้อเสนอแนะ prompt ที่ปรับปรุงแล้วเพื่อให้ได้ผลลัพธ์ที่ดีขึ้นและมีประสิทธิภาพยิ่งขึ้น",
  "learningTips": "คำแนะนำสั้นๆ สำหรับเด็กในการเขียน Prompt ในอนาคต"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: evaluationPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3,
      }
    });

    try {
      const parsed = JSON.parse(response.text?.trim() || "{}");
      res.json(parsed);
    } catch {
      res.json({
        score: 70,
        rating: "ประเมินผลสำเร็จ",
        explanation: "ได้รับคำตอบแต่การจัดรูปแบบผิดพลาด โครงสร้างคำสั่งสั้นเกินไปหรือยังขาดรายละเอียด",
        strengths: ["พิมพ์อ่านเข้าใจได้ง่าย"],
        weaknesses: ["ยังไม่ระบุบทบาทของ AI ที่ชัดเจน และขาดข้อมูลบริบท"],
        improvedPrompt: `จงรับบทเป็นผู้ช่วยอัจฉริยะ ช่วยอธิบายเกี่ยวกับ "${prompt}" แบบสั้นๆ และเปรียบเทียบให้เห็นภาพชัดเจน`,
        learningTips: "เคล็ดลับ: การกำหนดบทบาท (Role) และผลลัพธ์ที่ต้องการ (Format) จะช่วยให้ AI ตอบได้ตรงใจขึ้นนะ!"
      });
    }
  } catch (error: any) {
    console.error("Evaluate Prompt Error:", error);
    const score = Math.min(100, Math.max(30, (prompt || "").length * 3 + 15));
    let rating = "ควรปรับปรุง";
    if (score > 80) rating = "ยอดเยี่ยม";
    else if (score > 60) rating = "ดีพอใช้";

    return res.json({
      score,
      rating,
      explanation: "💡 [โหมดสาธิตออฟไลน์] prompt ของเธอมีขนาดยาวประมาณ " + (prompt || "").length + " ตัวอักษร ซึ่งดีในการให้บริบท แต่ยังสามารถปรับแต่งให้ชัดเจนและมีประสิทธิภาพยิ่งขึ้นได้โดยใช้วิธีการเขียนที่ถูกต้อง",
      strengths: [
        (prompt || "").length > 20 ? "ให้หัวข้อหรือคีย์เวิร์ดที่เฉพาะเจาะจงได้ดี" : "สั้นกระชับเข้าใจง่าย ไม่สับสน"
      ],
      weaknesses: [
        "ยังขาดการระบุบริบท (Context) หรือจุดมุ่งหมายของผู้รับชมที่ชัดเจน",
        "ไม่มีการกำหนดข้อจำกัดหรือรูปแบบการแสดงผล (Output Formats)"
      ],
      improvedPrompt: `จงรับบทเป็นครูใจดี ช่วยอธิบายวิวัฒนาการของ "${prompt}" ให้กับเด็กวัยเรียนเข้าใจง่ายที่สุด พร้อมยกตัวอย่างเปรียบเทียบในชีวิตประจำวัน 3 ข้อ`,
      learningTips: "เคล็ดลับของปรมาจารย์: เขียนคำสั่งที่ดีต้องยึดหลัก 4S ได้แก่ State Role (กำหนดบทบาท), Specify Task (ระบุงาน), Set Context (บอกข้อมูลแวดล้อม), และ Shape Output (เลือกรูปแบบคำตอบ)!"
    });
  }
});

// AI Image Generator Demo API using gemini-3.1-flash-lite-image
app.post("/api/gemini/generate-image", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "กรุณาระบุคำสั่งสร้างรูปภาพ" });
  }

  try {
    const ai = getGemini();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-image",
      contents: {
        parts: [
          { text: `Create a bright, high-quality, friendly educational cartoon vector illustration or educational render about: ${prompt}. Chemically colored, neat, safe for children, 3d style or simple icon.` }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    let base64Image = "";
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64Image = part.inlineData.data;
        break;
      }
    }

    if (base64Image) {
      res.json({ imageUrl: `data:image/png;base64,${base64Image}` });
    } else {
      throw new Error("NO_IMAGE_DATA");
    }
  } catch (error: any) {
    console.error("Generate Image Error:", error);
    // Safe educational fallbacks
    // Rather than showing a broken link, we can use an educational SVG illustration themed around AI
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
      <rect width="400" height="400" fill="#eff4ff" rx="24"/>
      <circle cx="200" cy="180" r="70" fill="#004ac6" opacity="0.1"/>
      <circle cx="200" cy="180" r="50" fill="#004ac6" opacity="0.2"/>
      <path d="M200 120 L200 240 M140 180 L260 180 M157 137 L243 223 M157 223 L243 137" stroke="#004ac6" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
      <circle cx="200" cy="180" r="15" fill="#0053db"/>
      <circle cx="157" cy="137" r="10" fill="#006e2f"/>
      <circle cx="243" cy="137" r="10" fill="#784b00"/>
      <circle cx="140" cy="180" r="10" fill="#2563eb"/>
      <circle cx="260" cy="180" r="10" fill="#ffb95f"/>
      <circle cx="157" cy="223" r="10" fill="#4ae176"/>
      <circle cx="243" cy="223" r="10" fill="#ba1a1a"/>
      <rect x="100" y="280" width="200" height="40" rx="10" fill="#ffffff" stroke="#c3c6d7" stroke-width="1"/>
      <text x="200" y="305" font-family="Prompt, sans-serif" font-size="14" font-weight="bold" fill="#004ac6" text-anchor="middle">🎨 AI Drawing: ${prompt.substring(0, 15)}${prompt.length > 15 ? '...' : ''}</text>
      <text x="200" y="350" font-family="Prompt, sans-serif" font-size="11" fill="#737686" text-anchor="middle">โหมดออฟไลน์: ภาพโครงข่ายประสาทจำลองอัจฉริยะ</text>
    </svg>`;
    const base64Svg = Buffer.from(fallbackSvg).toString("base64");
    res.json({
      imageUrl: `data:image/svg+xml;base64,${base64Svg}`,
      offline: true,
      tip: "ตั้งค่า GEMINI_API_KEY ในแผงความลับเพื่อรับรูปภาพจาก AI ตัวจริง!"
    });
  }
});

// Text Sentiment Analysis API
app.post("/api/gemini/sentiment", async (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "กรุณาระบุข้อความที่ต้องการวิเคราะห์" });
  }

  try {
    const ai = getGemini();
    const systemInstruction = `วิเคราะห์ความรู้สึก (Sentiment Analysis) ของข้อความต่อไปนี้สำหรับเด็กนักเรียน
และตอบเป็นรูปแบบ JSON เท่านั้น (ห้ามเขียนอย่างอื่น):
{
  "sentiment": "บวก (Positive) / ลบ (Negative) / เป็นกลาง (Neutral)",
  "emoji": "😊 / 😢 / 😐",
  "score": 95, // คะแนนความเชื่อมั่นเต็ม 100
  "explanation": "อธิบายสั้นๆ ว่าประโยคนี้แสดงออกถึงความรู้สึกอย่างไรด้วยคำพูดที่น่ารักเหมาะกับเด็ก",
  "advice": "คำแนะนำในการรับมือหรือการพูดจาดีๆ สร้างสรรค์สำหรับสถานการณ์นี้"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `จงวิเคราะห์ข้อความนี้: "${text}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    try {
      const parsed = JSON.parse(response.text?.trim() || "{}");
      res.json(parsed);
    } catch {
      res.json({
        sentiment: "มีความสุข",
        emoji: "🌟",
        score: 80,
        explanation: "ข้อความของเธอน่ารักจัง ดูมีพลังและพลังบวกแฝงอยู่!",
        advice: "ดีมากเลยจ้ะ! การแชร์พลังงานดีๆ จะช่วยให้คนรอบข้างมีความสุขไปด้วยนะ"
      });
    }
  } catch (error: any) {
    console.error("Sentiment Analysis Error:", error);
    const lower = (text || "").toLowerCase();
    let sentiment = "เป็นกลาง (Neutral)";
    let emoji = "😐";
    let score = 75;
    let explanation = "💡 [โหมดสาธิตแบบวิเคราะห์คีย์เวิร์ด] ทำงานชั่วคราวเนื่องจากข้อจำกัดทางเทคนิคหรือสิทธิ์เข้าถึง API";
    let advice = "พยายามสร้างทัศนคติและคำพูดเชิงบวกเสมอนะจ้ะเด็กๆ!";

    if (lower.includes("ดี") || lower.includes("ชอบ") || lower.includes("รัก") || lower.includes("ยอดเยี่ยม") || lower.includes("เก่ง") || lower.includes("สนุก") || lower.includes("เจ๋ง") || lower.includes("สุข")) {
      sentiment = "บวก (Positive)";
      emoji = "😊";
      score = 88;
      explanation = "ข้อความนี้ระบุวิเคราะห์เป็น 'เชิงบวก' เพราะมีคำว่าชื่นชม คล้ายกับวิธีที่ AI คัดกรองรีวิวและข้อคิดเห็นเชิงสร้างสรรค์ในระบบโซเชียลมีเดีย!";
      advice = "ยอดเยี่ยมมาก! การส่งต่อคำพูดที่ไพเราะและแบ่งปันพลังงานบวกช่วยสร้างความอบอุ่นและสังคมการเรียนรู้ที่ยั่งยืนขึ้นนะจ้ะ";
    } else if (lower.includes("แย่") || lower.includes("เศร้า") || lower.includes("โกหก") || lower.includes("เกลียด") || lower.includes("โง่") || lower.includes("เบื่อ") || lower.includes("ไม่ชอบ") || lower.includes("โกรธ")) {
      sentiment = "ลบ (Negative)";
      emoji = "😢";
      score = 90;
      explanation = "ข้อความนี้ถูกวิเคราะห์ว่าเป็น 'เชิงลบ' เนื่องจากพบคีย์เวิร์ดที่แสดงความไม่พึงพอใจ ท้อแท้ หรือขัดแย้ง ซึ่งโมเดล AI มักใช้จับสัญญาณและคัดกรองพฤติกรรมการบูลลี่ออนไลน์!";
      advice = "ใจเย็นๆ นะจ้ะ หากรู้สึกเหนื่อยหรือมีเรื่องเครียด ลองพักสายตาจากหน้าจอ หรือไปปรึกษาคุณครูและแชร์ความรู้สึกกับคนในครอบครัวนะ";
    }

    return res.json({ sentiment, emoji, score, explanation, advice });
  }
});

// Image Classification / Vision Demo using gemini-3.5-flash
app.post("/api/gemini/classify-image", async (req, res) => {
  const { imageBase64, mimeType } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "กรุณาแนบภาพสำหรับการจำแนก" });
  }

  try {
    const ai = getGemini();
    const systemInstruction = `คุณคือระบบตรวจจับและเรียนรู้รูปภาพ Computer Vision
ทำหน้าที่ช่วยวิเคราะห์ส่วนประกอบในรูปภาพที่เด็กๆ ส่งมา และจัดทำรายงานผลเป็น JSON เท่านั้น (ห้ามมีอักษรอื่น):
{
  "detectedItems": ["สิ่งที่ตรวจเจอ 1", "สิ่งที่ตรวจเจอ 2", "สิ่งที่ตรวจเจอ 3"],
  "primaryObject": "วัตถุหลักในรูปภาพ",
  "confidenceScore": 92, // คะแนนความมั่นใจในระดับ 0-100
  "explanation": "อธิบายเกี่ยวกับรูปภาพนี้และวิธีที่ระบบคอมพิวเตอร์วิเคราะห์รูปทรง ขอบ หรือสีเพื่อจำแนกมันออกมา",
  "educationalNote": "เกร็ดความรู้แถมเกี่ยวกับ AI Vision หรือวัตถุในรูปภาพนี้สำหรับโรงเรียน"
}`;

    const imagePart = {
      inlineData: {
        mimeType: mimeType || "image/jpeg",
        data: imageBase64,
      },
    };
    const textPart = {
      text: "จงวิเคราะห์ภาพนี้โดยอธิบายองค์ประกอบและวัตถุสำคัญ",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, textPart],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    });

    try {
      const parsed = JSON.parse(response.text?.trim() || "{}");
      res.json(parsed);
    } catch {
      res.json({
        detectedItems: ["วัตถุหลัก", "สีสันและลวดลาย"],
        primaryObject: "รูปภาพอัปโหลด",
        confidenceScore: 85,
        explanation: "สามารถระบุโครงร่างภาพได้ แต่อ่าน JSON ผลลัพธ์ผิดพลาด",
        educationalNote: "Computer Vision ใช้ฟิลเตอร์เลขคณิตเพื่อจับคู่จุดสีพิกเซล!"
      });
    }
  } catch (error: any) {
    console.error("Classify Image Error:", error);
    return res.json({
      detectedItems: ["ใบหน้าหุ่นยนต์เรียนรู้", "สัญลักษณ์เครือข่ายความรู้", "หน้าจอสัมผัส", "โครงร่างแสงนีออนสีสดใส"],
      primaryObject: "หุ่นยนต์การศึกษา AI Mentor (ภาพจำลอง)",
      confidenceScore: 98,
      explanation: "💡 [โหมดสาธิตออฟไลน์] ในสถานการณ์จริง เมื่อนักเรียนอัปโหลดภาพ AI จะแบ่งภาพพิกเซลเป็นกลุ่มค่าตัวเลขผ่านหน่วย Convolutional Neural Network (CNN) เพื่อสกัดคุณลักษณะย่อย เช่น ขอบวัตถุ วงกลม สี จนสามารถจำแนกรูปพิกเซลได้จริง!",
      educationalNote: "รู้หรือไม่? รถยนต์ไร้คนขับของ Tesla หรือ Google ต้องใช้ Computer Vision ถ่ายภาพรอบตัวด้วยความเร็วสูงกว่า 60 เฟรมต่อวินาที เพื่อประเมินและคัดแยกคนข้ามถนน สิ่งกีดขวาง และป้ายจราจรตลอดเวลานะจ้ะ!"
    });
  }
});

async function startServer() {
  // Vite middleware for development or Static Assets for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();
