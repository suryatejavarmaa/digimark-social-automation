// =============== FACEBOOK OAUTH & AUTO-POSTING ===============
// Add this code to server/index.js AFTER line 1561 (after the Twitter status endpoint)
// BEFORE line 1563 (before "console.log('--- STARTING WEBSITE SUMMARIZER SERVER v4 ---')")

// Facebook OAuth Step 1: Initiate OAuth
app.get('/auth/facebook', (req, res) => {
    const { userId, redirect_origin } = req.query;

    if (!userId) {
        return res.status(400).send('❌ userId is required');
    }

    console.log('[Facebook OAuth] Initiating for user:', userId);
    console.log('[Facebook OAuth] Redirect origin:', redirect_origin || 'not provided');

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${process.env.FACEBOOK_APP_ID}` +
        `&redirect_uri=${encodeURIComponent('http://localhost:5001/auth/facebook/callback')}` +
        `&state=${userId}:::${redirect_origin || 'http://localhost:3002'}` +
        `&scope=pages_manage_posts,pages_read_engagement`;

    console.log('[Facebook OAuth] Redirecting to:', authUrl);
    res.redirect(authUrl);
});

// Facebook OAuth Step 2: Callback - Exchange code for token
app.get('/auth/facebook/callback', async (req, res) => {
    const { code, state } = req.query;

    if (!code || !state) {
        console.error('[Facebook OAuth] Missing code or state');
        return res.redirect('http://localhost:3002?connected=facebook&error=missing_params');
    }

    const [userId, origin] = state.split(':::');

    try {
        console.log('[Facebook OAuth] Processing callback for user:', userId);

        // Step 1: Exchange code for access token
        const tokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?` +
            `client_id=${process.env.FACEBOOK_APP_ID}` +
            `&client_secret=${process.env.FACEBOOK_APP_SECRET}` +
            `&redirect_uri=${encodeURIComponent('http://localhost:5001/auth/facebook/callback')}` +
            `&code=${code}`;

        const tokenResponse = await fetch(tokenUrl);
        const tokenData = await tokenResponse.json();

        if (!tokenData.access_token) {
            throw new Error('Failed to get access token');
        }

        console.log('[Facebook OAuth] User access token received');

        // Step 2: Get user's Facebook Pages
        const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${tokenData.access_token}`;
        const pagesResponse = await fetch(pagesUrl);
        const pagesData = await pagesResponse.json();

        if (!pagesData.data || pagesData.data.length === 0) {
            console.error('[Facebook OAuth] No pages found for this user');
            return res.redirect(`${origin}?connected=facebook&error=no_pages`);
        }

        // Use first page (or let user choose in future)
        const firstPage = pagesData.data[0];
        console.log('[Facebook OAuth] Using page:', firstPage.name, firstPage.id);

        // Step 3: Save Page Access Token to Firestore
        const tokensRef = doc(db, 'users', userId, 'tokens', 'facebook');
        await setDoc(tokensRef, {
            access_token: firstPage.access_token, // PAGE access token, not user token!
            page_id: firstPage.id,
            page_name: firstPage.name,
            connectedAt: new Date().toISOString()
        });

        console.log('✅ Facebook OAuth successful for user:', userId);
        res.redirect(`${origin}?connected=facebook&success=true&page=${encodeURIComponent(firstPage.name)}`);

    } catch (error) {
        console.error('[Facebook OAuth] Error:', error);
        res.redirect(`${origin}?connected=facebook&error=callback_failed`);
    }
});
