
function optimizeCaptionForLinkedIn(caption) {
    const parts = caption.split(/\s+/);
    const hashtags = parts.filter(word => word.startsWith('#'));
    const text = parts.filter(word => !word.startsWith('#')).join(' ');
    const selectedHashtags = hashtags.slice(0, 5).join(' ');
    const professionalText = text
        .replace(/🪁|🎉|🎊/g, '')
        .replace(/!+/g, '.')
        .trim();
    return `${professionalText}\n\n${selectedHashtags}`.trim();
}

const testCases = [
    "Simple caption with #hashtag",
    "Longer caption with multiple words and #multiple #hashtags",
    "Caption with newlines\nand more text\n#hashtag",
    "Caption with emojis 🪁 🎉 🎊 and exclamation!!!",
    "Check this out & more things here #cool",
    "A very long paragraph that should definitely be more than two or three words. It has sentences. It has meaning. It should be fully preserved.",
];

testCases.forEach(test => {
    console.log("--- Input ---");
    console.log(test);
    console.log("--- Output ---");
    console.log(optimizeCaptionForLinkedIn(test));
    console.log("----------------");
});
