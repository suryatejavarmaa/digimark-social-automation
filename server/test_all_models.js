import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const logFile = 'server/test_results.txt';

function log(message) {
    console.log(message);
    fs.appendFileSync(logFile, message + '\n');
}

async function testAll() {
    fs.writeFileSync(logFile, '--- STARTING TEST ---\n');

    const models = [
        'gemini-1.5-flash',
        'models/gemini-1.5-flash',
        'gemini-1.0-pro',
        'models/gemini-1.0-pro',
        'gemini-pro',
        'models/gemini-pro'
    ];

    for (const modelName of models) {
        log(`\nTesting: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            const response = await result.response;
            log(`✅ SUCCESS: ${modelName}`);
            log(`Response: ${response.text()}`);
            return; // Stop after first success
        } catch (error) {
            log(`❌ FAILED: ${modelName}`);
            log(`Error: ${error.message}`);
            if (error.response) {
                log(`Status: ${error.response.status} ${error.response.statusText}`);
                log(`URL: ${error.response.url}`);
            }
        }
    }
    log('\n--- TEST COMPLETE ---');
}

testAll();
