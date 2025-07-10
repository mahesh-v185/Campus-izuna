
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateBlogPost = async (topic: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API key is not configured. Please set the API_KEY environment variable.");
  }
  
  try {
    const systemInstruction = "You are an expert academic writer. Your task is to generate a well-structured, informative, and engaging blog post on the given topic. The blog post should be suitable for college students. Structure it with a clear introduction, body paragraphs, and a conclusion. Use markdown for formatting, like headings (#, ##) and lists (*).";

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate a blog post about: "${topic}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        topP: 1,
        topK: 32,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error generating blog post:", error);
    if (error instanceof Error) {
        return `Failed to generate blog post. Error: ${error.message}`;
    }
    return "An unknown error occurred while generating the blog post.";
  }
};
