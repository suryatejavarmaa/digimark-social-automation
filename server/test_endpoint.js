
// Using global fetch

async function test() {
    try {
        const response = await fetch('http://localhost:5001/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: 'test-user',
                prompt: 'A futuristic city',
                style: 'Cyberpunk',
                ratio: '1:1'
            })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Body:', text);
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
