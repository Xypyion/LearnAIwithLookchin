import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Hello",
    });
    console.log(res.text);
  } catch (e: any) {
    console.error("Error with gemini-2.5-flash:", e.message);
  }
}
test();
