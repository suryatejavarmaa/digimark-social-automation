import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

import fs from 'fs';

async function fetchModels() {
    try {
        const response = await fetch(url);
        const data = await response.json();

        let output = "";
        if (data.models) {
            output += "Available Models:\n";
            data.models.forEach(m => {
                if (m.name.includes('gemini')) {
                    output += `${m.name}\n`;
                    output += `- Methods: ${m.supportedGenerationMethods.join(', ')}\n`;
                }
            });
        } else {
            output += "No models found or error: " + JSON.stringify(data);
        }
        fs.writeFileSync('server/available_models.txt', output);
        console.log("Models written to server/available_models.txt");
    } catch (error) {
        console.error("Fetch error:", error);
    }
}

fetchModels();
