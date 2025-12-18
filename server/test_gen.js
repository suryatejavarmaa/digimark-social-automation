import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGen() {
    const modelName = "gemini-pro"; // Trying gemini-pro
    console.log(`Testing generation with model: ${modelName}`);

    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent("Explain how AI works in one sentence.");
        const response = await result.response;
        const text = response.text();
        console.log(`✅ SUCCESS! Response: ${text}`);
    } catch (error) {
        console.log(`❌ FAILED: ${error.message}`);
        if (error.response) {
            console.log(`Status: ${error.response.status}`);
            console.log(`Status Text: ${error.response.statusText}`);
        }
    }
}

testGen();
