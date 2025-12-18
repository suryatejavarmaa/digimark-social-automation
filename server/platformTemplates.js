// Platform-Specific Caption Generation Templates
// Returns the configured prompt and max length for each platform

export function getPlatformCaptionPrompt(platform, safeTopic, companyContext, tone) {
    let platformPrompt = '';
    let maxLength = 2000;

    if (platform.toLowerCase().includes('linkedin')) {
        maxLength = 3000;
        platformPrompt = `Write a professional, engaging LinkedIn post like real thought leaders do.

CONTEXT:
Company: ${companyContext || "a business"}
Topic: "${safeTopic}"
Tone: ${tone || 'Professional, insightful'}

LINKEDIN POST STRUCTURE (people actually use this format):
- Start with a hook (question, bold statement, or surprising stat)
- 2-3 short paragraphs with line breaks between them
- Key insights formatted as bullet points using → 
- Closing thought or call-to-action
- 3-5 relevant hashtags at the end

EXAMPLE REAL FORMAT:
Ever wondered why some companies grow 10x faster than others?

I've spent the last 3 years analyzing successful businesses, and here's what I found.

The secret isn't more capital. It's not smarter people. It's this:

→ They prioritize speed over perfection
→ They listen to customers obsessively
→ They adapt faster than competitors

What's your take? Drop a comment below.

#GrowthMindset #BusinessStrategy #Entrepreneurship

Write naturally. Use line breaks. Be authentic. Maximum ${maxLength} characters.`;

    } else if (platform.toLowerCase().includes('twitter') || platform.toLowerCase().includes('x')) {
        maxLength = 280;
        platformPrompt = `Write a scroll-stopping Twitter/X post.

Topic: "${safeTopic}"
Company: ${companyContext || "a business"}

TWITTER POST RULES:
- STRICT 280 character limit
- Start with emoji or bold hook
- Be punchy and direct
- Maximum 2 hashtags
- Make it quotable

Write it now. No fluff. Direct impact.`;

    } else if (platform.toLowerCase().includes('instagram')) {
        maxLength = 2200;
        platformPrompt = `Write an engaging Instagram caption like influencers do.

Topic: "${safeTopic}"
Company: ${companyContext || "a business"}  
Tone: ${tone || 'Authentic, relatable'}

INSTAGRAM CAPTION STRUCTURE:
- Opening hook with emoji 🎯
- Tell a mini-story in 2-3 short paragraphs
- Use emojis throughout for visual appeal ✨
- Include a call-to-action (Double tap, Save this, Tag someone)
- Add line break before hashtags
- Include 8-15 relevant hashtags

Make it feel personal and authentic. Maximum ${maxLength} characters.`;

    } else if (platform.toLowerCase().includes('facebook')) {
        maxLength = 5000;
        platformPrompt = `Write a conversational Facebook post.

Topic: "${safeTopic}"
Company: ${companyContext || "a business"}
Tone: ${tone || 'Friendly, community-focused'}

FACEBOOK POST STYLE:
- Start conversationally like talking to friends
- Share a story or insight in 2-4 paragraphs
- Use line breaks for readability
- Include a call-to-action or question
- Add 2-4 hashtags (Facebook users don't use many)

Make it feel warm and community-oriented. Maximum ${maxLength} characters.`;

    } else {
        // Generic fallback
        platformPrompt = `Write an engaging social media post about "${safeTopic}" for ${platform}.

Company context: ${companyContext || "a business"}
Tone: ${tone || 'Professional'}

Keep it concise with 2-3 relevant hashtags. Maximum 300 characters.`;
        maxLength = 300;
    }

    return { prompt: platformPrompt, maxLength };
}
