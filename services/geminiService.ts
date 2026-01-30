
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
};

export class ChatService {
  private chat: Chat;

  constructor() {
    const ai = getAIClient();
    this.chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });
  }

  async sendMessage(message: string): Promise<string> {
    try {
      const result: GenerateContentResponse = await this.chat.sendMessage({ message });
      return result.text || "عذراً، لم أستطع الحصول على رد في الوقت الحالي.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("حدث خطأ أثناء التواصل مع خادم الذكاء الاصطناعي.");
    }
  }

  async *sendMessageStream(message: string) {
    try {
      const stream = await this.chat.sendMessageStream({ message });
      for await (const chunk of stream) {
        yield (chunk as GenerateContentResponse).text || "";
      }
    } catch (error) {
      console.error("Gemini Streaming Error:", error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
