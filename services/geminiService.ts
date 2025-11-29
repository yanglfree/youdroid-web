import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateBlogContent = async (topic: string, type: 'outline' | 'full' | 'summary'): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    
    let prompt = "";
    if (type === 'outline') {
      prompt = `Create a structured blog post outline for the topic: "${topic}". Use Markdown format.`;
    } else if (type === 'summary') {
      prompt = `Summarize the following text into a catchy 2-sentence excerpt for a blog card: "${topic}"`;
    } else {
      prompt = `Write a comprehensive, engaging blog post about "${topic}". The tone should be professional yet accessible. Use Markdown formatting. Include a title.`;
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Failed to generate content.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key.";
  }
};
