
export interface GeneratedContent {
    text?: string;
    imageUrl?: string;
}

export const AIService = {
    generateCaption: async (prompt: string, platform: string, tones: string[], userId?: string | null): Promise<string> => {
        try {
            const response = await fetch('http://127.0.0.1:5001/generate-caption', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    topic: prompt,
                    platform: platform,
                    tone: tones.join(', ')
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate caption');
            }

            const data = await response.json();
            return data.caption;
        } catch (error) {
            console.error("AI Generation Error:", error);
            return `Error generating caption: ${(error as Error).message}. Please ensure the backend server is running.`;
        }
    },

    generateImage: async (prompt: string, style: string, ratio: string, userId?: string | null): Promise<{ images: string[], prompts: string[] }> => {
        try {
            const response = await fetch('http://127.0.0.1:5001/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    prompt: prompt,
                    style: style,
                    ratio: ratio
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate image');
            }

            const data = await response.json();
            return {
                images: data.images || [],
                prompts: data.prompts || []
            };
        } catch (error) {
            console.error("AI Image Generation Error:", error);
            // Fallback
            return {
                images: [
                    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
                    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
                ],
                prompts: [prompt, prompt, prompt]
            };
        }
    }
};
