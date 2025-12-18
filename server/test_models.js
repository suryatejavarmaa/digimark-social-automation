import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("Fetching available models...");
        console.log(`API Key loaded: ${process.env.GEMINI_API_KEY ? 'YES' : 'NO'} (${process.env.GEMINI_API_KEY?.substring(0, 5)}...)`);

        const modelsToTest = ['models/gemini-1.5-flash', 'gemini-1.5-flash', 'models/gemini-pro', 'gemini-pro'];

        for (const modelName of modelsToTest) {
            console.log(`Testing model: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                const response = await result.response;
                console.log(`✅ SUCCESS: ${modelName} is working.`);
                return; // Found a working one
            } catch (error) {
                console.log(`❌ FAILED: ${modelName}`);
                if (error.response) {
                    console.log(`Status: ${error.response.status}`);
                    console.log(`Status Text: ${error.response.statusText}`);
                }
                console.log(`Error Message: ${error.message}`);
            }
        }
        console.log("No working models found.");
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
