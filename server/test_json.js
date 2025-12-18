import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testJson() {
    console.log("Testing Gemini JSON Mode...");

    try {
        const model = genAI.getGenerativeModel({
            model: "models/gemini-2.0-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
        You are a social media post generator.
        INPUTS:
        - Topic: "New Year Sales"
        - Platform: "LinkedIn"
        
        OUTPUT FORMAT:
        Return a JSON object with a single key "caption".
        `;

        console.log("Sending prompt...");
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("--- RAW RESPONSE ---");
        console.log(text);
        console.log("--------------------");

        try {
            const parsed = JSON.parse(text);
            console.log("✅ Valid JSON parsed:", parsed);
        } catch (e) {
            console.error("❌ Failed to parse JSON:", e.message);
        }

    } catch (error) {
        console.error("API Error:", error);
    }
}

testJson();
