import {GoogleGenerativeAI} from "@google/generative-ai";

// Gemini setup using 2.5 Flash model for faster, efficient responses. Supports markdown.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateResponse(prompt) {
    if (!apiKey) {
        throw new Error("Gemini API key missing in .env");
    }
    const model = genAI.getGenerativeModel({model: "gemini-2.5-flash"}); // Updated to 2.5 Flash
    const result = await model.generateContent(
        `You are a helpful AI for maternal and child health in Hausa. Respond in Hausa using simple markdown (e.g., **bold**, *italic*, - lists) for clarity. Be empathetic and concise. Query: ${prompt}`
    );
    return result.response.text();
}
