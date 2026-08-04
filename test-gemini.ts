import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  console.log("API Key:", apiKey);
  const ai = new GoogleGenAI({ apiKey });
  try {
    const res = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: "Hello",
    });
    console.log(res.text);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
test();
