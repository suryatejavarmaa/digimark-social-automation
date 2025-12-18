import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import Groq from 'groq-sdk';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, query, where, orderBy, limit, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { SchedulerService } from './schedulerService.js';
import crypto from 'crypto';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCP441OctDxPAIS9rSwRCJ7bxmJaktVS58",
    authDomain: "digimark-ce146.firebaseapp.com",
    projectId: "digimark-ce146",
    messagingSenderId: "305387226790",
    appId: "1:305387226790:web:a9a4a406253d50c4ce1667",
    measurementId: "G-ENN3N6ZHGJ"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);
const auth = getAuth(firebaseApp);

// Temporary storage for OAuth 1.0a request token secrets
// Needed because Twitter doesn't send the secret back in the callback
const tempTwitterTokens = new Map();

// Helper: Shorten URL
async function shortenUrl(longUrl) {
    console.log(`[shortenUrl] Shortening URL: ${longUrl.substring(0, 50)}...`);
    try {
        const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (!response.ok) throw new Error(`TinyURL failed: ${response.status}`);
        const shortUrl = await response.text();
        console.log(`[shortenUrl] Success: ${shortUrl}`);
        return shortUrl;
    } catch (error) {
        console.error("[shortenUrl] Error:", error);
        return null;
    }
}

// Helper: Upload Image to Firebase Storage
async function uploadImageToStorage(userId, dataUrlOrUrl) {
    console.log(`[uploadImageToStorage] Starting upload for user: ${userId}`);
    try {
        if (!auth.currentUser) {
            console.log("[uploadImageToStorage] Signing in anonymously...");
            await signInAnonymously(auth);
            console.log("[uploadImageToStorage] Signed in as:", auth.currentUser.uid);
        }

        const timestamp = Date.now();
        const storageRef = ref(storage, `posts/${userId}/${timestamp}.png`);

        let dataToUpload;
        let contentType = 'image/png';

        if (dataUrlOrUrl.startsWith('data:')) {
            console.log("[uploadImageToStorage] Processing base64 string...");
            const matches = dataUrlOrUrl.match(/^data:(.+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                contentType = matches[1];
                const base64Data = matches[2];
                const buffer = Buffer.from(base64Data, 'base64');
                dataToUpload = new Uint8Array(buffer);
            } else {
                throw new Error("Invalid base64 format");
            }
        } else {
            console.log(`[uploadImageToStorage] Fetching remote image: ${dataUrlOrUrl.substring(0, 50)}...`);
            const response = await fetch(dataUrlOrUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' }
            });
            if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

            const headerContentType = response.headers.get('content-type');
            if (headerContentType) contentType = headerContentType;

            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            dataToUpload = new Uint8Array(buffer);
        }

        console.log(`[uploadImageToStorage] Uploading ${dataToUpload.length} bytes (Type: ${contentType})...`);

        const snapshot = await uploadBytes(storageRef, dataToUpload, { contentType });
        console.log("[uploadImageToStorage] Upload complete.");

        const downloadURL = await getDownloadURL(storageRef);
        console.log("[uploadImageToStorage] Success! Public URL:", downloadURL);
        return downloadURL;
    } catch (error) {
        console.error("[uploadImageToStorage] Error Details:", error.code, error.message);
        throw error;
    }
}

// --- TWITTER OAUTH 1.0A SIGNATURE GENERATOR ---
// Twitter v1.1 Media Upload API requires OAuth 1.0a signatures
function generateTwitterOAuth1Signature(method, url, params, consumerKey, consumerSecret, tokenKey, tokenSecret) {
    // OAuth 1.0a parameters
    const oauthParams = {
        oauth_consumer_key: consumerKey,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_nonce: crypto.randomBytes(32).toString('hex'),
        oauth_version: '1.0'
    };

    // Only include oauth_token if it exists (not needed for request token)
    if (tokenKey) {
        oauthParams.oauth_token = tokenKey;
    }

    // Combine OAuth params with request params
    const allParams = { ...oauthParams, ...params };

    // Sort parameters alphabetically
    const sortedKeys = Object.keys(allParams).sort();
    const paramString = sortedKeys
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(allParams[key])}`)
        .join('&');

    // Create signature base string
    const signatureBase = [
        method.toUpperCase(),
        encodeURIComponent(url),
        encodeURIComponent(paramString)
    ].join('&');

    // Create signing key
    const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret || '')}`;

    // Generate signature
    const signature = crypto
        .createHmac('sha1', signingKey)
        .update(signatureBase)
        .digest('base64');

    // Add signature to OAuth params
    oauthParams.oauth_signature = signature;

    // Create Authorization header
    const authHeader = 'OAuth ' + Object.keys(oauthParams)
        .sort()
        .map(key => `${encodeURIComponent(key)}="${encodeURIComponent(oauthParams[key])}"`)
        .join(', ');

    return authHeader;
}

// Initialize Groq client
const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- API: GENERATE CAPTION TEMPLATES ---
app.post('/api/generate-templates', async (req, res) => {
    try {
        const { userId, companyName, companySummary, count = 4 } = req.body;

        console.log(`[Templates] Generating ${count} templates for ${companyName}`);

        const prompt = `You are a social media expert. Based on this company profile:

Company: ${companyName || 'A business'}
About: ${companySummary || 'A professional company'}

Generate ${count} SHORT, creative topic ideas for social media posts (NOT full captions, just topics):

Examples of good topics:
- "Black Friday Sale"
- "New Year Wishes"
- "Christmas Celebration"
- "Product Launch"
- "Team Milestone"
- "Customer Success Story"
- "Industry Insights"
- "Behind the Scenes"

Generate ${count} similar creative, catchy topics that are:
- 2-5 words maximum
- Relevant to ${companyName || 'this business'}
- Mix of: seasonal events, company news, industry topics, engagement ideas
- Suitable for ${companySummary || 'professional business'} context
- Creative and attention-grabbing

Return ONLY a JSON array of ${count} short strings (topics), no other text.`;

        const result = await groqClient.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.9,
            max_tokens: 1000
        });

        const response = result.choices[0]?.message?.content || '[]';
        console.log('[Templates] AI Response:', response.substring(0, 150) + '...');

        // Parse JSON response
        let templates = [];
        try {
            templates = JSON.parse(response);
        } catch (e) {
            // Fallback if JSON parsing fails
            console.warn('[Templates] Failed to parse AI response, using fallback');
            templates = [
                "🚀 Excited to share our latest innovation! Transforming the way you work. #Innovation #Tech #Growth",
                "💡 Industry insight: Success comes from continuous learning. What's driving your growth? #BusinessTips #Leadership",
                "🎯 Behind the scenes at our office! Our team making magic happen every day. #TeamWork #Culture #Innovation",
                "🌟 Celebrating a major milestone! Thank you to everyone who made this possible. #Success #Grateful #Achievement"
            ].slice(0, count);
        }

        // Ensure we have exactly the requested count
        if (templates.length < count) {
            const fallback = [
                "✨ New opportunities ahead! We're pushing boundaries and creating impact. #Innovation #Business",
                "🔥 Here's what we're working on: Solutions that make a difference. #Tech #Progress",
                "💼 Proud of what we've built. Excited for what's next! #Growth #Success",
                "🌐 Connecting ideas with action. Join us on this journey! #Community #Vision"
            ];
            while (templates.length < count) {
                templates.push(fallback[templates.length % fallback.length]);
            }
        }

        res.json({ templates: templates.slice(0, count) });

    } catch (error) {
        console.error('[Templates] Error:', error);
        res.status(500).json({
            error: 'Failed to generate templates',
            templates: [
                "🚀 Innovation drives everything we do. Excited to share what's next! #Tech #Innovation",
                "💡 Success is built on great ideas and execution. What's inspiring you today? #Business #Growth",
                "🎯 Our team is making things happen. Here's a glimpse behind the scenes. #TeamWork #Culture",
                "🌟 Grateful for this milestone. Thank you for being part of our journey! #Success #Community"
            ]
        });
    }
});

// --- API: GENERATE POSTER/IMAGE TEMPLATES ---
app.post('/api/generate-poster-templates', async (req, res) => {
    try {
        const { userId, companyName, companySummary, count = 8 } = req.body;

        console.log(`[Poster Templates] Generating ${count} poster ideas for ${companyName}`);

        const prompt = `You are a creative graphic designer. Based on this company profile:

Company: ${companyName || 'A business'}
About: ${companySummary || 'A professional company'}

Generate ${count} SHORT, creative poster/graphic ideas for business marketing (NOT full descriptions, just concise topics):

Examples of good poster topics:
- "Black Friday Sale Banner"
- "New Year Celebration"
- "Christmas Special Offer"
- "Product Launch Poster"
- "Grand Opening"
- "Festival Wishes"
- "Team Achievement Banner"
- "Customer Testimonial"
- "Discount Weekend"
- "Seasonal Greetings"

Generate ${count} similar creative poster topics that are:
- 3-6 words maximum
- Relevant to ${companyName || 'this business'}
- Mix of: seasonal campaigns, sales events, announcements, celebrations
- Suitable for ${companySummary || 'professional business'} branding
- Visual and eye-catching

Return ONLY a JSON array of ${count} short strings (poster topics), no other text.`;

        const result = await groqClient.chat.completions.create({
            messages: [{ role: 'user', content: prompt }],
            model: 'llama-3.3-70b-versatile',
            temperature: 0.9,
            max_tokens: 1000
        });

        const response = result.choices[0]?.message?.content || '[]';
        console.log('[Poster Templates] AI Response:', response.substring(0, 150) + '...');

        // Parse JSON response
        let templates = [];
        try {
            templates = JSON.parse(response);
        } catch (e) {
            console.warn('[Poster Templates] Failed to parse AI response, using fallback');
            templates = [
                "Black Friday Sale Banner",
                "New Year Celebration",
                "Christmas Special Offer",
                "Product Launch Poster",
                "Grand Opening Event",
                "Festival Greetings",
                "Team Milestone",
                "Customer Success Story"
            ].slice(0, count);
        }

        // Ensure we have exactly the requested count
        if (templates.length < count) {
            const fallback = [
                "Seasonal Sale Event",
                "Special Discount Weekend",
                "Anniversary Celebration",
                "New Collection Launch",
                "Thank You Customers",
                "Limited Time Offer",
                "Flash Sale Alert",
                "Exclusive Deal"
            ];
            while (templates.length < count) {
                templates.push(fallback[templates.length % fallback.length]);
            }
        }

        res.json({ templates: templates.slice(0, count) });

    } catch (error) {
        console.error('[Poster Templates] Error:', error);
        res.status(500).json({
            error: 'Failed to generate poster templates',
            templates: [
                "Black Friday Sale",
                "New Year Wishes",
                "Product Launch",
                "Grand Opening",
                "Festival Celebration",
                "Team Achievement",
                "Special Offer",
                "Customer Appreciation"
            ]
        });
    }
});

// --- ENDPOINT 5: PUBLISH CONTENT ---
app.post('/publish', async (req, res) => {
    try {
        const { userId, platforms = [], content, mediaUrl, postType } = req.body;

        console.log(`[Publish] Request for user ${userId} to platforms:`, platforms);

        if (!userId || !platforms || platforms.length === 0) {
            return res.status(400).json({ error: 'Missing userId or platforms' });
        }

        const results = {};
        const cleanedContent = content ? content.replace(/\[.*?\]/g, '').trim() : '';

        // Process each platform
        for (const p of platforms) {
            try {
                let optimizedCaption = cleanedContent;

                if (p === 'twitter') {
                    optimizedCaption = optimizeCaptionForTwitter(cleanedContent);

                    // Try Twitter AUTO-POST with 2-step API
                    try {
                        console.log('[Publish][Twitter] Attempting auto-post...');

                        // Fetch Twitter tokens from Firestore
                        const tokensRef = doc(db, 'users', userId, 'tokens', 'twitter');
                        const tokenDoc = await getDoc(tokensRef);

                        if (!tokenDoc.exists()) {
                            throw new Error('Twitter not connected');
                        }

                        const tokenData = tokenDoc.data();

                        let media_id_string = null;

                        // Step 1: Upload media ONLY if provided (optional for text-only tweets)
                        if (mediaUrl) {
                            console.log('[Publish][Twitter] Step 1: Uploading media with OAuth 1.0a...');

                            const imageResponse = await fetch(mediaUrl);
                            const imageBuffer = await imageResponse.arrayBuffer();
                            const base64Image = Buffer.from(imageBuffer).toString('base64');

                            // Generate OAuth 1.0a signature
                            const mediaUploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';
                            const mediaParams = { media_data: base64Image };

                            const authHeader = generateTwitterOAuth1Signature(
                                'POST',
                                mediaUploadUrl,
                                mediaParams,
                                process.env.TWITTER_CLIENT_ID,
                                process.env.TWITTER_CLIENT_SECRET,
                                tokenData.access_token,
                                tokenData.access_token_secret || ''
                            );

                            const mediaUploadResponse = await fetch(mediaUploadUrl, {
                                method: 'POST',
                                headers: {
                                    'Authorization': authHeader,
                                    'Content-Type': 'application/x-www-form-urlencoded'
                                },
                                body: new URLSearchParams(mediaParams)
                            });

                            console.log('[Publish][Twitter] Media upload response status:', mediaUploadResponse.status);

                            if (!mediaUploadResponse.ok) {
                                const errorText = await mediaUploadResponse.text();
                                console.error('[Publish][Twitter] Media upload FAILED - Status:', mediaUploadResponse.status);
                                console.error('[Publish][Twitter] Error body:', errorText);
                                throw new Error(`Twitter media upload failed: ${mediaUploadResponse.status}`);
                            }

                            const mediaData = await mediaUploadResponse.json();
                            media_id_string = mediaData.media_id_string;
                            console.log('[Publish][Twitter] ✅ Media uploaded:', media_id_string);
                        } else {
                            console.log('[Publish][Twitter] No media - posting text-only tweet');
                        }

                        // Step 2: Create tweet with media using OAuth 1.0a
                        console.log('[Publish][Twitter] Step 2: Creating tweet...');

                        const tweetUrl = 'https://api.twitter.com/2/tweets';
                        const tweetBody = {
                            text: optimizedCaption
                        };

                        // Add media only if uploaded
                        if (media_id_string) {
                            tweetBody.media = {
                                media_ids: [media_id_string]
                            };
                        }

                        // Generate OAuth 1.0a signature for tweet creation
                        const tweetAuthHeader = generateTwitterOAuth1Signature(
                            'POST',
                            tweetUrl,
                            {}, // No query params for tweet creation
                            process.env.TWITTER_CLIENT_ID,
                            process.env.TWITTER_CLIENT_SECRET,
                            tokenData.access_token,
                            tokenData.access_token_secret || ''
                        );

                        const tweetResponse = await fetch(tweetUrl, {
                            method: 'POST',
                            headers: {
                                'Authorization': tweetAuthHeader,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(tweetBody)
                        });

                        const tweetData = await tweetResponse.json();
                        console.log('[Publish][Twitter] Tweet created:', tweetData);

                        if (tweetData.data && tweetData.data.id) {
                            console.log('[Publish][Twitter] ✅ Tweet posted successfully!');

                            results[p] = {
                                status: 'success',
                                action: 'auto_posted',
                                url: `https://twitter.com/user/status/${tweetData.data.id}`,
                                message: 'Tweet posted successfully!'
                            };
                            continue;
                        }

                        throw new Error('Tweet creation failed');

                    } catch (twitterError) {
                        console.error('[Publish][Twitter] Auto-post failed, falling back to intent:', twitterError);
                        // Fall through to intent fallback below
                    }

                    // FALLBACK: Twitter intent if auto-post failed or not connected
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(optimizedCaption)}`;


                } else if (p === 'linkedin') {
                    // LinkedIn: Professional tone
                    optimizedCaption = optimizeCaptionForLinkedIn(cleanedContent);

                    // Try LinkedIn AUTO-POST with Image Upload API
                    try {
                        console.log('[Publish][LinkedIn] Attempting auto-post...');

                        // Fetch LinkedIn tokens from Firestore
                        const tokensRef = doc(db, 'users', userId, 'tokens', 'linkedin');
                        const tokenDoc = await getDoc(tokensRef);

                        if (!tokenDoc.exists()) {
                            throw new Error('LinkedIn not connected');
                        }

                        const tokenData = tokenDoc.data();
                        const access_token = tokenData.access_token;

                        // Get LinkedIn user URN
                        const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
                            headers: { 'Authorization': `Bearer ${access_token}` }
                        });

                        if (!userInfoResponse.ok) {
                            throw new Error(`Failed to get user info: ${userInfoResponse.status}`);
                        }

                        const userInfo = await userInfoResponse.json();
                        const personUrn = `urn:li:person:${userInfo.sub}`;

                        // Handle image upload if media exists
                        let assetUrn = null;
                        if (mediaUrl) {
                            // STEP 1: Register LinkedIn Image Upload
                            console.log('[Publish][LinkedIn] Step 1: Registering image upload...');
                            const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${access_token}`,
                                    'Content-Type': 'application/json',
                                    'X-Restli-Protocol-Version': '2.0.0'
                                },
                                body: JSON.stringify({
                                    registerUploadRequest: {
                                        recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                                        owner: personUrn,
                                        serviceRelationships: [{
                                            relationshipType: 'OWNER',
                                            identifier: 'urn:li:userGeneratedContent'
                                        }]
                                    }
                                })
                            });

                            if (!registerResponse.ok) {
                                throw new Error(`Register upload failed: ${registerResponse.status}`);
                            }

                            const registerData = await registerResponse.json();
                            const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
                            assetUrn = registerData.value.asset;

                            console.log('[Publish][LinkedIn] Step 2: Uploading image binary...');

                            // STEP 2: Download image and upload binary
                            const imageResponse = await fetch(mediaUrl);
                            if (!imageResponse.ok) {
                                throw new Error(`Failed to fetch image: ${imageResponse.status}`);
                            }
                            const imageBuffer = await imageResponse.arrayBuffer();

                            const uploadBinaryResponse = await fetch(uploadUrl, {
                                method: 'PUT',
                                headers: { 'Authorization': `Bearer ${access_token}` },
                                body: imageBuffer
                            });

                            if (!uploadBinaryResponse.ok) {
                                throw new Error(`Binary upload failed: ${uploadBinaryResponse.status}`);
                            }

                            console.log('[Publish][LinkedIn] ✅ Image uploaded, asset:', assetUrn);
                        }

                        // STEP 3: Create LinkedIn UGC Post
                        console.log('[Publish][LinkedIn] Step 3: Creating post...');
                        const ugcPostData = {
                            author: personUrn,
                            lifecycleState: 'PUBLISHED',
                            specificContent: {
                                'com.linkedin.ugc.ShareContent': {
                                    shareCommentary: { text: optimizedCaption },
                                    shareMediaCategory: assetUrn ? 'IMAGE' : 'NONE',
                                    ...(assetUrn && {
                                        media: [{
                                            status: 'READY',
                                            media: assetUrn
                                        }]
                                    })
                                }
                            },
                            visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' }
                        };

                        const ugcResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${access_token}`,
                                'Content-Type': 'application/json',
                                'X-Restli-Protocol-Version': '2.0.0'
                            },
                            body: JSON.stringify(ugcPostData)
                        });

                        if (!ugcResponse.ok) {
                            const errorText = await ugcResponse.text();
                            throw new Error(`LinkedIn API error: ${ugcResponse.status} - ${errorText}`);
                        }

                        const ugcData = await ugcResponse.json();
                        const postId = ugcData.id;

                        console.log('[Publish][LinkedIn] ✅ Post created successfully:', postId);

                        // Use the URN directly in the LinkedIn update URL
                        const postUrl = `https://www.linkedin.com/feed/update/${postId}/`;

                        results[p] = {
                            status: 'success',
                            action: 'auto_posted',
                            url: postUrl,
                            message: 'LinkedIn post published successfully!'
                        };
                        continue;

                    } catch (linkedinError) {
                        console.error('[Publish][LinkedIn] Auto-post failed, falling back to share dialog:', linkedinError);
                        // Fall through to share dialog fallback below
                    }

                    // FALLBACK: Share dialog if auto-post failed or not connected
                    if (mediaUrl) {
                        const shortUrl = await shortenUrl(mediaUrl);
                        const urlToShare = shortUrl || mediaUrl;
                        shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(optimizedCaption + "\n\n" + urlToShare)}`;
                    } else {
                        shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(optimizedCaption)}`;
                    }

                } else if (p === 'facebook') {
                    // Facebook: Emotional, engaging
                    optimizedCaption = optimizeCaptionForFacebook(cleanedContent);

                    // Try Facebook AUTO-POST with Page Access Token
                    try {
                        console.log('[Publish][Facebook] Attempting auto-post...');

                        // Fetch Facebook Page tokens from Firestore
                        const tokensRef = doc(db, 'users', userId, 'tokens', 'facebook');
                        const tokenDoc = await getDoc(tokensRef);

                        if (!tokenDoc.exists() || !tokenDoc.data()?.access_token) {
                            throw new Error('Facebook not connected');
                        }

                        const tokenData = tokenDoc.data();
                        const pageAccessToken = tokenData.access_token;
                        const pageId = tokenData.page_id;

                        console.log('[Publish][Facebook] Using page:', tokenData.page_name);

                        // Post photo to Facebook Page
                        if (mediaUrl) {
                            console.log('[Publish][Facebook] Posting photo with caption...');

                            // Use Facebook Graph API to post photo
                            const photoUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;

                            const photoBody = {
                                url: mediaUrl,
                                caption: optimizedCaption,
                                published: true,
                                access_token: pageAccessToken
                            };

                            const photoResponse = await fetch(photoUrl, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(photoBody)
                            });

                            const photoData = await photoResponse.json();

                            if (!photoResponse.ok) {
                                throw new Error(JSON.stringify(photoData));
                            }

                            if (photoData.id || photoData.post_id) {
                                const postId = photoData.post_id || photoData.id;
                                console.log('[Publish][Facebook] ✅ Photo posted:', postId);

                                results[p] = {
                                    status: 'success',
                                    action: 'post_published',
                                    url: `https://www.facebook.com/${postId}`,
                                    message: 'Facebook post published successfully!'
                                };
                                continue;
                            }

                            throw new Error('Facebook photo upload failed');
                        } else {
                            throw new Error('Facebook requires an image');
                        }

                    } catch (facebookError) {
                        console.error('[Publish][Facebook] Auto-post failed:', facebookError.message);
                        // Fallback to share dialog with caption as hashtag
                        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mediaUrl || 'https://www.facebook.com')}&hashtag=${encodeURIComponent('#DigiMark')}`;

                        // Return result with caption so UI can show it for manual copying
                        results[p] = {
                            status: 'success',
                            action: 'share_dialog',
                            url: shareUrl,
                            optimizedCaption: optimizedCaption,
                            message: 'Please manually post with the caption above'
                        };
                        continue;
                    }

                } else if (p === 'instagram') {
                    // Instagram: Visual, hashtags
                    optimizedCaption = optimizeCaptionForInstagram(cleanedContent);

                    // Instagram Graph API Publishing
                    if (mediaUrl && userTokens.has(`instagram_${userId}`)) {
                        try {
                            console.log('[Instagram] Starting publishing flow...');
                            const tokenData = userTokens.get(`instagram_${userId}`);
                            const accessToken = tokenData.access_token;

                            // 1. Get User's Pages
                            const pagesResponse = await fetch(`https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`);
                            const pagesData = await pagesResponse.json();

                            let instagramAccountId = null;
                            if (pagesData.data) {
                                for (const page of pagesData.data) {
                                    if (page.instagram_business_account) {
                                        instagramAccountId = page.instagram_business_account.id;
                                        break;
                                    }
                                }
                            }

                            if (!instagramAccountId) {
                                throw new Error('No Instagram Business Account found linked to your Facebook Pages.');
                            }

                            // 2. Create Media Container
                            const containerUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media?image_url=${encodeURIComponent(mediaUrl)}&caption=${encodeURIComponent(optimizedCaption)}&access_token=${accessToken}`;
                            const containerResponse = await fetch(containerUrl, { method: 'POST' });
                            const containerData = await containerResponse.json();

                            if (!containerData.id) throw new Error('Failed to create media container');

                            const creationId = containerData.id;

                            // 3. Publish Media Container
                            const publishUrl = `https://graph.facebook.com/v18.0/${instagramAccountId}/media_publish?creation_id=${creationId}&access_token=${accessToken}`;
                            const publishResponse = await fetch(publishUrl, { method: 'POST' });
                            const publishData = await publishResponse.json();

                            if (publishData.id) {
                                let permalink = 'https://www.instagram.com/';
                                try {
                                    const mediaResponse = await fetch(`https://graph.facebook.com/v18.0/${publishData.id}?fields=permalink&access_token=${accessToken}`);
                                    const mediaData = await mediaResponse.json();
                                    if (mediaData.permalink) permalink = mediaData.permalink;
                                } catch (e) { }

                                results[p] = {
                                    status: 'success',
                                    action: 'post_published',
                                    url: permalink,
                                    message: 'Instagram post published successfully! Opening...'
                                };
                                continue;
                            }
                            throw new Error('Failed to publish container');

                        } catch (igError) {
                            console.warn('[Instagram] API failed:', igError);
                            // Return the specific error so the frontend can show it
                            results[p] = {
                                status: 'failed',
                                action: 'manual_fallback',
                                error: igError.message || 'Unknown error',
                                url: 'https://www.instagram.com/',
                                optimizedCaption: optimizedCaption
                            };
                            continue;
                        }
                    } else {
                        shareUrl = 'https://www.instagram.com/';
                    }

                } else {
                    action = 'manual';
                }

                if (action === 'share_dialog') {
                    results[p] = results[p] || {
                        status: 'success',
                        action: 'share_dialog',
                        url: shareUrl,
                        imageUrl: mediaUrl,
                        optimizedCaption: optimizedCaption
                    };
                } else {
                    results[p] = { status: 'success', action: 'manual' };
                }

            } catch (e) {
                console.error(`Failed to prepare share for ${p}:`, e);
                results[p] = { status: "failed", error: e.message };
            }
        }

        // Analyze results for multi-platform publishing
        const resultStatuses = Object.values(results).map(r => typeof r === 'object' ? r.status : r);
        const allSuccess = resultStatuses.every(status => status === 'success');
        const allFailed = resultStatuses.every(status => status === 'failed');
        const someFailed = resultStatuses.some(status => status === 'failed');

        console.log(`Publishing results: ${allSuccess ? 'ALL SUCCESS' : allFailed ? 'ALL FAILED' : 'PARTIAL'}`);

        // Create notification for user
        try {
            const postLinks = {};
            platforms.forEach(p => {
                if (results[p]?.url) {
                    postLinks[p] = results[p].url;
                }
            });

            await addDoc(collection(db, 'users', userId, 'notifications'), {
                type: 'auto_publish',
                status: allSuccess ? 'success' : (allFailed ? 'failed' : 'partial'),
                platforms: platforms,
                postLinks: postLinks,
                caption: cleanedContent.substring(0, 100),
                imageUrl: mediaUrl || null,
                createdAt: serverTimestamp(),
                read: false
            });

            console.log('[Publish] ✅ Notification created for user:', userId);
        } catch (notifError) {
            console.error('[Publish] ❌ Failed to create notification:', notifError);
            // Don't fail the request if notification fails
        }

        res.json({
            success: !allFailed, // Success if at least one platform succeeded
            results,
            multiPlatformFailed: platforms.length > 1 && allFailed,
            partialSuccess: platforms.length > 1 && someFailed && !allFailed,
            allSuccess: allSuccess
        });
    } catch (error) {
        console.error('[Publish] Unexpected error:', error);
        res.status(500).json({
            error: error.message || 'Internal server error',
            details: error.stack
        });
    }
});

// --- ENDPOINT 6: SCHEDULE POST ---
app.post('/schedule-post', async (req, res) => {
    const { userId, platforms, content, mediaUrl, scheduledAt } = req.body;

    console.log(`[Schedule] User ${userId}, Platforms: [${platforms}], Time: ${scheduledAt}`);

    try {
        // 1. Validate scheduledAt is in future
        const scheduleDate = new Date(scheduledAt);
        const now = new Date();

        if (scheduleDate <= now) {
            console.error(`[Schedule] Date ${scheduledAt} is in the past`);
            return res.status(400).json({
                success: false,
                error: 'Cannot schedule posts in the past'
            });
        }

        // 2. Download and save image to Firebase Storage (if from Pollinations)
        let finalMediaUrl = mediaUrl;
        if (mediaUrl && mediaUrl.includes('pollinations.ai')) {
            try {
                console.log('[Schedule] Downloading image from Pollinations...');
                const imageResponse = await fetch(mediaUrl);

                if (!imageResponse.ok) {
                    throw new Error(`Failed to download image: ${imageResponse.status}`);
                }

                const imageBuffer = await imageResponse.arrayBuffer();
                console.log(`[Schedule] Downloaded ${imageBuffer.byteLength} bytes`);

                // Upload to Firebase Storage
                const filename = `scheduled/${userId}/${Date.now()}.jpg`;
                const storageRef = ref(storage, filename);
                await uploadBytes(storageRef, Buffer.from(imageBuffer));
                const firebaseUrl = await getDownloadURL(storageRef);

                console.log(`[Schedule] ✅ Saved to Firebase Storage: ${filename}`);
                finalMediaUrl = firebaseUrl;

            } catch (imageError) {
                console.error('[Schedule] Image upload failed, using original URL:', imageError);
                // Fall back to original URL if Firebase upload fails
            }
        }

        // 3. Create scheduled post document
        const scheduledPost = {
            userId,
            platforms,
            content,
            mediaUrl: finalMediaUrl || null,
            scheduledAt: scheduledAt, // Store as ISO string
            status: 'pending', // pending | published | failed | cancelled
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        // 3. Save to Firestore
        const docRef = await addDoc(collection(db, 'scheduledPosts'), scheduledPost);
        console.log(`[Schedule] Saved to Firestore: ${docRef.id}`);

        res.json({
            success: true,
            postId: docRef.id,
            scheduledAt: scheduledAt,
            message: `Post scheduled for ${new Date(scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`
        });

    } catch (error) {
        console.error('[Schedule] Error:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to schedule post'
        });
    }
});


// Helper Functions
function optimizeCaptionForTwitter(caption) {
    // Twitter: Max 280 chars. We try to preserve structure but truncate if needed.
    const hashtags = caption.match(/#[a-z0-9_]+/gi) || [];
    // Remove hashtags from main text to save space, we'll add selected ones back
    let text = caption.replace(/#[a-z0-9_]+/gi, '').trim();

    const selectedHashtags = hashtags.slice(0, 3).join(' ');
    let result = `${text}\n\n${selectedHashtags}`.trim();

    if (result.length > 260) {
        result = result.substring(0, 257) + '...';
    }
    return result;
}

function optimizeCaptionForLinkedIn(caption) {
    // LinkedIn: Professional tone, preserve structure.
    const hashtags = caption.match(/#[a-z0-9_]+/gi) || [];
    // Keep text as is, just clean up excessive emojis if needed, but preserve newlines
    let text = caption;

    // Optional: Remove specific "unprofessional" emojis if strictly required, 
    // but for now, we prioritize preserving the user's text structure.
    const professionalText = text
        .replace(/🪁|🎉|🎊/g, '') // Remove specific festive emojis if that was the goal
        .replace(/!{3,}/g, '!')   // Reduce excessive exclamation marks
        .trim();

    // Ensure hashtags are present. If the user already included them in the text, 
    // we might duplicate them if we append. 
    // Strategy: If hashtags are scattered, we leave them. 
    // If we want to enforce a block at the end, we could strip and append.
    // For now, let's just ensure the text is returned as is (cleaned) because 
    // the user likely wrote it the way they want it.

    return professionalText;
}

function optimizeCaptionForFacebook(caption) {
    // Facebook: Preserve structure.
    return caption.trim();
}

function optimizeCaptionForInstagram(caption) {
    // Instagram: Preserve structure.
    return caption.trim();
}

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper: Call Groq with retry
async function callGroqWithRetry(prompt, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const completion = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.7,
                max_tokens: 1024,
            });
            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error(`Groq attempt ${attempt} failed:`, error.message);
            if (attempt === maxRetries) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
    }
}

app.get('/', (req, res) => {
    res.send('Website Summarizer Server is Running!');
});

// --- ENDPOINT 1: WEBSITE SUMMARIZER ---
app.post('/summarize', async (req, res) => {
    const { url, userId } = req.body;

    if (!url || !userId) {
        return res.status(400).json({ error: 'URL and UserId are required' });
    }

    console.log(`Processing URL: ${url} for User: ${userId}`);


    try {
        // 1. Scrape with Puppeteer
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // Set viewport to desktop size
        await page.setViewport({ width: 1920, height: 1080 });

        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Scroll to bottom to trigger lazy loading
        await page.evaluate(async () => {
            await new Promise((resolve) => {
                let totalHeight = 0;
                const distance = 100;
                const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve(true);
                    }
                }, 100);
            });
        });

        // Extract text content
        const content = await page.evaluate(() => {
            return document.body.innerText;
        });

        await browser.close();

        console.log(`Scraped ${content.length} characters.`);

        // 2. Summarize with Groq
        const prompt = `Summarize the following website content into a concise, structured summary. Focus on the main points, key takeaways, and any actionable insights about the company. Keep it under 500 words.\n\nContent:\n${content.substring(0, 30000)}`;

        const summary = await callGroqWithRetry(prompt);

        console.log("✅ Summary generated with Groq.");

        // 3. Save to Firebase (company_summaries collection)
        const docRef = await addDoc(collection(db, 'company_summaries'), {
            userId,
            url,
            summary,
            createdAt: new Date(),
            originalContentLength: content.length
        });

        console.log(`Saved to Firestore: ${docRef.id}`);

        res.json({ success: true, id: docRef.id, summary });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// --- ENDPOINT 2: SOCIAL POST GENERATOR ---
app.post('/generate-caption', async (req, res) => {
    const { userId, topic, platform, tone } = req.body;

    if (!userId || !topic || !platform) {
        return res.status(400).json({ error: 'UserId, topic, and platform are required' });
    }

    console.log(`Generating caption for User: ${userId}, Topic: ${topic}, Platform: ${platform}`);

    try {
        // 1. Fetch Company Summary from Firebase
        const summariesRef = collection(db, 'company_summaries');
        const q = query(
            summariesRef,
            where("userId", "==", userId)
        );

        const querySnapshot = await getDocs(q);
        let companyContext = "";

        if (!querySnapshot.empty) {
            const docs = querySnapshot.docs.map(doc => doc.data());
            docs.sort((a, b) => {
                const dateA = a.createdAt.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
                const dateB = b.createdAt.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
                return dateB - dateA;
            });

            companyContext = docs[0].summary;
            console.log("Found company summary for context.");
        } else {
            console.log("No company summary found. Using generic context.");
        }

        // 2. Generate with Groq - Platform-Specific Natural Captions
        const safeTopic = topic.length > 200 ? topic.substring(0, 200) + "..." : topic;
        let prompt = '';
        let maxLength = 2000;

        if (platform.toLowerCase().includes('linkedin')) {
            maxLength = 450;
            prompt = `Write a professional LinkedIn post about "${safeTopic}" for ${companyContext || "a business"}.\n\nWrite naturally like a thought leader. Start with a compelling hook, share 1-2 key insights in a flowing paragraph, and end with 2-3 relevant hashtags. Keep it concise (under 450 chars) but make it engaging and authentic. No templates, just natural writing.`;
        } else if (platform.toLowerCase().includes('twitter') || platform.toLowerCase().includes('x')) {
            maxLength = 280;
            prompt = `Twitter post about "${safeTopic}". Company: ${companyContext || "a business"}. STRICT 280 chars. Hook + insight + 1-2 hashtags. Punchy.`;
        } else if (platform.toLowerCase().includes('instagram')) {
            maxLength = 450;
            prompt = `Write an Instagram caption about "${safeTopic}".\n\nMake it feel authentic and relatable. Start with an emoji, tell a quick story or insight in 2-3 sentences, add a call-to-action, and finish with 5-7 relevant hashtags. Keep it under 450 chars. Write naturally, not like a template.`;
        } else if (platform.toLowerCase().includes('facebook')) {
            maxLength = 450;
            prompt = `Write a friendly Facebook post about "${safeTopic}".\n\nMake it conversational and warm like talking to friends. Share something interesting or ask a question. Keep it natural and engaging with 2-3 hashtags. Under 450 chars.`;
        } else {
            maxLength = 300;
            prompt = `Social post: "${safeTopic}" for ${platform}. 2-3 hashtags. ${companyContext || ""}`;
        }

        const caption = await callGroqWithRetry(prompt);
        let cleanCaption = caption.trim().replace(/^["']|["']$/g, '');

        if (cleanCaption.length > maxLength) {
            cleanCaption = cleanCaption.substring(0, maxLength - 3) + "...";
        }

        console.log(`✅ ${platform} caption: ${cleanCaption.length} chars`);

        res.json({ success: true, caption: cleanCaption });

    } catch (error) {
        console.error("Error:", error);
        const fallbackCaption = `Exciting updates coming soon! 🚀 Stay tuned. #Growth #Future`;
        res.json({ success: true, caption: fallbackCaption });
    }
});

// --- ENDPOINT 3: IMAGE GENERATOR ---
app.post('/generate-image', async (req, res) => {
    const { userId, prompt: userPrompt, style, ratio } = req.body;

    if (!userId || !userPrompt) {
        return res.status(400).json({ error: 'UserId and prompt are required' });
    }

    console.log(`Generating image for User: ${userId}, Style: ${style}, Ratio: ${ratio}`);

    try {
        // 1. Fetch Company Summary
        const summariesRef = collection(db, 'company_summaries');
        const q = query(summariesRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        let companyContext = "";

        if (!querySnapshot.empty) {
            const docs = querySnapshot.docs.map(doc => doc.data());
            docs.sort((a, b) => {
                const dateA = a.createdAt.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(a.createdAt);
                const dateB = b.createdAt.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(b.createdAt);
                return dateB - dateA;
            });
            companyContext = docs[0].summary;
        }

        // 2. GENERATE 3 VARIATIONS WITH GROQ
        console.log("Creating 3 variations of same concept with Groq...");

        let expandedPrompts = [];
        try {
            // Build style-specific guidance
            let styleGuidance = '';
            const selectedStyle = (style || 'Modern Professional').toLowerCase();

            if (selectedStyle.includes('photorealistic') || selectedStyle.includes('realistic')) {
                styleGuidance = `STYLE-SPECIFIC TERMS FOR PHOTOREALISTIC:
- Camera details: "shot on Canon EOS R5", "85mm lens", "f/1.8 aperture", "shallow depth of field"
- Lighting: "natural lighting", "golden hour", "soft shadows", "rim lighting", "studio lighting"
- Quality: "photorealistic", "hyperrealistic", "lifelike details", "sharp focus", "professional photography"
- Atmosphere: "cinematic mood", "real-world textures", "authentic colors"`;
            } else if (selectedStyle.includes('digital') || selectedStyle.includes('art')) {
                styleGuidance = `STYLE-SPECIFIC TERMS FOR DIGITAL ART:
- Style: "digital painting", "concept art", "digital illustration", "vector graphics", "digital medium"
- Colors: "vibrant colors", "bold palette", "saturated hues", "color grading", "artistic color scheme"
- Quality: "highly detailed digital art", "smooth gradients", "clean lines", "polished artwork"
- Techniques: "brush strokes", "layered composition", "digital rendering", "artistic interpretation"`;
            } else if (selectedStyle.includes('minimalist') || selectedStyle.includes('minimal')) {
                styleGuidance = `STYLE-SPECIFIC TERMS FOR MINIMALIST:
- Design: "clean design", "simple composition", "negative space", "minimal elements", "uncluttered"
- Colors: "limited color palette", "monochromatic", "subtle tones", "white space", "muted colors"
- Quality: "refined simplicity", "elegant minimalism", "geometric shapes", "flat design"
- Style: "minimalist aesthetic", "modern minimalism", "Japanese minimalism", "Scandinavian design"`;
            } else if (selectedStyle.includes('abstract')) {
                styleGuidance = `STYLE-SPECIFIC TERMS FOR ABSTRACT:
- Style: "abstract art", "non-representational", "expressive forms", "fluid shapes", "geometric abstraction"
- Colors: "bold color blocks", "vibrant contrasts", "color fields", "experimental palette"
- Composition: "asymmetric balance", "dynamic movement", "layered dimensions", "abstract patterns"
- Quality: "contemporary abstract", "modern art style", "artistic expression", "creative interpretation"`;
            } else if (selectedStyle.includes('3d') || selectedStyle.includes('render')) {
                styleGuidance = `STYLE-SPECIFIC TERMS FOR 3D RENDER:
- Technical: "3D rendering", "ray tracing", "global illumination", "PBR materials", "realistic reflections"
- Software: "rendered in Blender", "Octane render", "Unreal Engine", "high-poly model"
- Quality: "photoreal 3D", "detailed textures", "subsurface scattering", "ambient occlusion"
- Style: "CGI artwork", "3D visualization", "digital sculpting", "volumetric lighting"`;
            } else {
                // Default/Modern Professional
                styleGuidance = `STYLE-SPECIFIC TERMS FOR ${style}:
- Style: "professional design", "modern aesthetic", "contemporary look", "sleek presentation"
- Quality: "high-quality", "polished finish", "attention to detail", "premium look"
- Composition: "balanced layout", "visual hierarchy", "clean composition", "professional execution"
- Colors: "harmonious colors", "professional palette", "well-coordinated", "visually appealing"`;
            }

            const promptInstruction = `You are an expert image prompt engineer. Transform this user request into 3 DETAILED professional image generation prompts.

USER REQUEST: "${userPrompt}"
Company: ${companyContext || "a business"}
SELECTED STYLE: ${style || 'Modern Professional'}

${styleGuidance}

CRITICAL RULES - READ CAREFULLY:
1. ALL 3 prompts MUST be about the EXACT SAME SUBJECT from user request
2. If user says "Sankranti poster with logo" - ALL 3 must be Sankranti posters with logo
3. DO NOT change the theme, subject, or purpose across variations
4. ONLY vary: camera angle, composition layout, lighting mood
5. Use style-specific terms from above for "${style}"

CORRECT EXAMPLE:
User: "Create Sankranti poster for Bristle Tech with logo"
✅ Prompt 1: "Happy Sankranti festival poster, Bristle Tech logo prominently centered, traditional diyas, warm orange glow, shot on Canon EOS R5, centered composition, photorealistic"
✅ Prompt 2: "Happy Sankranti festival poster, Bristle Tech logo prominently displayed, traditional diyas, festive lights, shot on Canon EOS R5, diagonal dynamic angle, photorealistic"
✅ Prompt 3: "Happy Sankranti festival poster, Bristle Tech logo prominently featured, traditional diyas closeup, vibrant colors, shot on Canon EOS R5, intimate framing, photorealistic"
(ALL about Sankranti poster with logo, just different angles/compositions)

WRONG EXAMPLE:
❌ Prompt 1: "Sankranti poster with logo"
❌ Prompt 2: "Tech company branding" (WRONG - different subject!)
❌ Prompt 3: "Abstract celebration" (WRONG - different subject!)

YOUR TASK:
Extract the CORE REQUEST: What does the user want? (subject, theme, elements)
Keep that SAME for all 3 prompts
Only change: composition angle, lighting style, framing

VARIATIONS TO CHANGE:
Variation 1: Front-facing, centered, balanced composition, warm/soft lighting
Variation 2: 45-degree angle, dynamic diagonal, dramatic high-contrast lighting
Variation 3: Close-up detail shot, shallow focus, intimate/artistic lighting

Write 3 prompts about THE SAME SUBJECT. One per line. No numbering.`;

            const groqResult = await callGroqWithRetry(promptInstruction);
            console.log("🔍 Groq returned:", groqResult);

            expandedPrompts = groqResult
                .split('\n')
                .filter(line => line.trim().length > 20)
                .map(line => line.trim().replace(/^[\d\.\-\*]+\s*/, ''))
                .slice(0, 3);

            while (expandedPrompts.length < 3) {
                expandedPrompts.push(`${userPrompt} in ${style} style, variation ${expandedPrompts.length + 1}`);
            }

            console.log("✅ Final 3 variations:", expandedPrompts);

        } catch (e) {
            console.error("❌ Groq failed:", e.message);
            expandedPrompts = [
                `${userPrompt} - ${style} style, composition 1`,
                `${userPrompt} - ${style} style, composition 2`,
                `${userPrompt} - ${style} style, composition 3`
            ];
        }

        // 3. GENERATE IMAGES
        try {
            let images = [];
            console.log("Generating images...");

            const generateWithHF = async (prompt, index) => {
                const HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
                if (!HF_API_KEY) throw new Error("No Hugging Face API Key found");

                const model = "runwayml/stable-diffusion-v1-5";
                console.log(`[HF] Generating variation ${index + 1} with ${model}...`);

                // Set a timeout for HF requests to fail fast and fallback
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

                try {
                    const response = await fetch(
                        `https://api-inference.huggingface.co/models/${model}`,
                        {
                            headers: {
                                Authorization: `Bearer ${HF_API_KEY}`,
                                "Content-Type": "application/json",
                            },
                            method: "POST",
                            body: JSON.stringify({ inputs: prompt }),
                            signal: controller.signal
                        }
                    );
                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        const err = await response.text();
                        throw new Error(`HF API Error: ${response.status} - ${err}`);
                    }

                    const blob = await response.blob();
                    const buffer = await blob.arrayBuffer();
                    const base64 = Buffer.from(buffer).toString('base64');
                    return `data:image/jpeg;base64,${base64}`;
                } catch (error) {
                    clearTimeout(timeoutId);
                    throw error;
                }
            };

            const generateWithPollinations = (prompt) => {
                console.log("[Pollinations] Generating fallback...");
                const encodedPrompt = encodeURIComponent(prompt);
                const seed = Math.floor(Math.random() * 1000);
                return `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true&seed=${seed}`;
            };

            // Run generations in parallel
            const imagePromises = expandedPrompts.map(async (prompt, i) => {
                try {
                    // Try HF first with timeout
                    return await generateWithHF(prompt, i);
                } catch (hfError) {
                    console.warn(`HF Generation failed/timed out for index ${i}:`, hfError.message);
                    console.log("Falling back to Pollinations.ai...");
                    // Fallback to Pollinations which is instant (URL based)
                    return generateWithPollinations(prompt);
                }
            });

            images = await Promise.all(imagePromises);

            res.json({ success: true, images: images, prompts: expandedPrompts });

        } catch (error) {
            console.error("Critical Image Gen Error:", error);
            res.json({
                success: true,
                images: [
                    `https://image.pollinations.ai/prompt/${encodeURIComponent(userPrompt)}?seed=101`,
                    `https://image.pollinations.ai/prompt/${encodeURIComponent(userPrompt)}?seed=102`,
                    `https://image.pollinations.ai/prompt/${encodeURIComponent(userPrompt)}?seed=103`
                ],
                prompts: [userPrompt, userPrompt, userPrompt]
            });
        }

    } catch (outerError) {
        console.error("Unhandled Error:", outerError);
        res.status(500).json({ error: outerError.message });
    }

});

// --- ENDPOINT 4: OAUTH AUTHENTICATION ---

// Store OAuth tokens in memory (in production, use Firebase/Database)
const userTokens = new Map();

// Generate PKCE code verifier for Twitter OAuth 2.0
function generatePKCE() {
    const verifier = Buffer.from(Math.random().toString(36).substring(2)).toString('base64url');
    const challenge = verifier; // Plain method for simplicity
    return { verifier, challenge };
}

const getOAuthUrl = (platform, userId, origin) => {
    const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5001/auth/callback';

    // Create state object with origin
    const stateObj = { platform, userId, origin: origin || 'http://localhost:3002' };
    const state = Buffer.from(JSON.stringify(stateObj)).toString('base64');

    switch (platform) {
        case 'linkedin':
            // IMPORTANT: Added 'openid' scope to enable /v2/userinfo API access
            return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=openid%20w_member_social%20profile`;
        case 'instagram':
            // Instagram Graph API requires Facebook Login with these permissions
            // Scopes must be comma-separated without spaces
            return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`;
        case 'facebook':
            // Force re-authentication to ensure user grants user_posts/user_photos permissions
            return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&state=${state}&scope=public_profile,user_posts,user_photos&auth_type=reauthenticate`;
        case 'youtube':
            return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=https://www.googleapis.com/auth/youtube.upload&state=${state}&access_type=offline`;
        case 'twitter':
            // Twitter OAuth 2.0 with PKCE
            const pkce = generatePKCE();
            // Store PKCE verifier for this user
            userTokens.set(`pkce_${userId}`, pkce.verifier);

            return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${process.env.TWITTER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=tweet.read%20tweet.write%20users.read%20offline.access&state=${state}&code_challenge=${pkce.challenge}&code_challenge_method=plain`;
        default:
            return null;
    }
};

app.get('/auth/callback', async (req, res) => {
    const { code, state, oauth_token, oauth_verifier } = req.query;

    let platform, userId, origin;

    // OAuth 1.0a (Twitter) doesn't use state parameter - detect it first
    if (oauth_token && oauth_verifier) {
        platform = 'twitter'; // OAuth 1.0a is Twitter
        // userId and origin will be retrieved from tempTwitterTokens later
    } else if (state) {
        // OAuth 2.0 flow - parse state parameter
        try {
            // Try to parse Base64 JSON state
            const decoded = JSON.parse(Buffer.from(state, 'base64').toString());
            platform = decoded.platform;
            userId = decoded.userId;
            origin = decoded.origin;
        } catch (e) {
            console.warn("Failed to parse new state format, falling back to legacy split:", e);
            // Fallback for legacy state format
            const parts = state.split('_');
            platform = parts[0];
            userId = parts[1];
            origin = 'http://localhost:3002'; // Default fallback
        }
    } else {
        console.error('[OAuth Callback] No state or oauth_token found!');
        return res.status(400).send('Invalid OAuth callback');
    }

    console.log(`[OAuth Callback] Platform: ${platform}, User: ${userId}, Origin: ${origin}, Code: ${code?.substring(0, 10)}...`);

    try {
        // Twitter OAuth 1.0a callback (new - checks for oauth_token instead of code)
        if (platform === 'twitter' && req.query.oauth_token && req.query.oauth_verifier) {
            const oauthToken = req.query.oauth_token;
            const oauthVerifier = req.query.oauth_verifier;

            console.log('[Twitter OAuth 1.0a] Callback received, exchanging for access token...');

            // Retrieve stored request token secret
            const tempData = tempTwitterTokens.get(oauthToken);
            if (!tempData) {
                console.error('[Twitter OAuth 1.0a] Token not found in temp storage!');
                return res.redirect(`${origin}?connected=twitter&error=token_not_found`);
            }

            const { secret, userId: actualUserId, redirect_origin } = tempData;
            const finalOrigin = redirect_origin || origin;

            // Exchange for access token
            const accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
            const authHeader = generateTwitterOAuth1Signature(
                'POST',
                accessTokenUrl,
                { oauth_verifier: oauthVerifier },
                process.env.TWITTER_CLIENT_ID,
                process.env.TWITTER_CLIENT_SECRET,
                oauthToken,
                secret
            );

            const response = await fetch(accessTokenUrl, {
                method: 'POST',
                headers: {
                    'Authorization': authHeader,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({ oauth_verifier: oauthVerifier })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('[Twitter OAuth 1.0a] Access token failed:', errorText);
                return res.redirect(`${finalOrigin}?connected=twitter&error=access_token_failed`);
            }

            const responseBody = await response.text();
            const responseParams = new URLSearchParams(responseBody);

            const accessToken = responseParams.get('oauth_token');
            const accessTokenSecret = responseParams.get('oauth_token_secret');
            const username = responseParams.get('screen_name');

            console.log('[Twitter OAuth 1.0a] Got access token, saving to Firestore...');

            // Save OAuth 1.0a tokens to Firestore
            const tokensRef = doc(db, 'users', actualUserId, 'tokens', 'twitter');
            await setDoc(tokensRef, {
                access_token: accessToken,
                access_token_secret: accessTokenSecret,
                username: username,
                connectedAt: new Date().toISOString(),
                oauth_version: '1.0a'
            });

            // Clean up
            tempTwitterTokens.delete(oauthToken);

            console.log('✅ Twitter OAuth 1.0a successful!');
            return res.redirect(`${finalOrigin}?connected=twitter&success=true&username=${encodeURIComponent(username)}`);
        }

        // OLD OAuth 2.0 code (will be removed)
        if (platform === 'twitter' && code) {
            // Exchange code for access token
            const REDIRECT_URI = process.env.REDIRECT_URI;
            const pkceVerifier = userTokens.get(`pkce_${userId}`);

            const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${Buffer.from(`${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`).toString('base64')}`
                },
                body: new URLSearchParams({
                    code: code,
                    grant_type: 'authorization_code',
                    redirect_uri: REDIRECT_URI,
                    code_verifier: pkceVerifier
                })
            });

            const tokenData = await tokenResponse.json();
            console.log('[Twitter OAuth] Token response:', tokenData);

            if (tokenData.access_token) {
                // Fetch user info to get username
                const userInfoResponse = await fetch('https://api.twitter.com/2/users/me', {
                    headers: {
                        'Authorization': `Bearer ${tokenData.access_token}`
                    }
                });

                const userInfo = await userInfoResponse.json();
                const username = userInfo.data?.username || 'Unknown';

                console.log('[Twitter] Connected as:', username);

                // Save tokens to Firestore (like LinkedIn!)
                const tokensRef = doc(db, 'users', userId, 'tokens', 'twitter');
                await setDoc(tokensRef, {
                    access_token: tokenData.access_token,
                    refresh_token: tokenData.refresh_token,
                    expires_in: tokenData.expires_in,
                    expires_at: Date.now() + (tokenData.expires_in * 1000),
                    username: username,
                    connectedAt: new Date().toISOString()
                });

                console.log('✅ Twitter OAuth successful for user:', userId);
                res.redirect(`${origin}?connected=twitter&success=true&username=${encodeURIComponent(username)}`);
            } else {
                console.error('❌ Twitter OAuth failed:', tokenData);
                res.redirect(`${origin}?connected=twitter&error=token_failed`);
            }
        } else if (platform === 'facebook' && code) {
            // Exchange code for Facebook access token
            const REDIRECT_URI = process.env.REDIRECT_URI;

            const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`);

            const tokenData = await tokenResponse.json();
            console.log('[Facebook OAuth] Token response:', tokenData);

            if (tokenData.access_token) {
                // Get user info
                const userInfoResponse = await fetch(`https://graph.facebook.com/me?access_token=${tokenData.access_token}`);
                const userInfo = await userInfoResponse.json();
                const username = userInfo.name || 'Unknown';

                console.log('[Facebook] Connected as:', username);

                // Store tokens for this user
                userTokens.set(`facebook_${userId}`, {
                    access_token: tokenData.access_token,
                    expires_at: Date.now() + (tokenData.expires_in * 1000),
                    username: username
                });

                console.log('✅ Facebook OAuth successful for user:', userId);
                res.redirect(`${origin}?connected=facebook&success=true&username=${encodeURIComponent(username)}`);
            } else {
                console.error('❌ Facebook OAuth failed:', tokenData);
                res.redirect(`${origin}?connected=facebook&error=token_failed`);
            }
        } else if (platform === 'linkedin' && code) {
            // Exchange code for LinkedIn access token
            const REDIRECT_URI = process.env.REDIRECT_URI;

            console.log('[LinkedIn OAuth] Exchanging code for token...');

            const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: REDIRECT_URI,
                    client_id: process.env.LINKEDIN_CLIENT_ID,
                    client_secret: process.env.LINKEDIN_CLIENT_SECRET
                })
            });

            const tokenData = await tokenResponse.json();
            console.log('[LinkedIn OAuth] Token response:', tokenData);

            if (tokenData.access_token) {
                console.log('[LinkedIn] Access token received, saving to Firestore...');

                // Save token to Firestore
                const tokensRef = doc(db, 'users', userId, 'tokens', 'linkedin');
                await setDoc(tokensRef, {
                    access_token: tokenData.access_token,
                    expires_in: tokenData.expires_in,
                    expires_at: Date.now() + (tokenData.expires_in * 1000),
                    scope: tokenData.scope,
                    connectedAt: new Date().toISOString()
                });

                console.log('✅ LinkedIn OAuth successful for user:', userId);
                res.redirect(`${origin}?connected=linkedin&success=true`);
            } else {
                console.error('❌ LinkedIn OAuth failed:', tokenData);
                res.redirect(`${origin}?connected=linkedin&error=token_failed`);
            }
        } else {
            // Other platforms - just mark as connected
            res.redirect(`${origin}?connected=${platform}`);
        }
    } catch (error) {
        console.error('[OAuth Callback] Error:', error);
        res.redirect(`${origin}?connected=${platform}&error=callback_failed`);
    }
});

// --- TWITTER OAUTH 1.0A REQUEST TOKEN ENDPOINT ---
// This must come BEFORE the generic /auth/:platform route
app.get('/auth/twitter', async (req, res) => {
    const { userId, redirect_origin } = req.query;

    console.log('[Twitter OAuth 1.0a] Starting request token flow for user:', userId);

    try {
        const REDIRECT_URI = process.env.REDIRECT_URI || 'http://localhost:5001/auth/callback';

        // Step 1: Request temporary token from Twitter
        const requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
        const params = {
            oauth_callback: REDIRECT_URI
        };

        // Generate OAuth 1.0a signature for request token
        const authHeader = generateTwitterOAuth1Signature(
            'POST',
            requestTokenUrl,
            params,
            process.env.TWITTER_CLIENT_ID,
            process.env.TWITTER_CLIENT_SECRET,
            '', // No token yet
            ''  // No token secret yet
        );

        console.log('[Twitter OAuth 1.0a] Requesting token from Twitter...');

        const response = await fetch(requestTokenUrl, {
            method: 'POST',
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(params)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[Twitter OAuth 1.0a] Request token failed:', response.status, errorText);
            return res.redirect(`${redirect_origin || 'http://localhost:3002'}?error=twitter_request_token_failed`);
        }

        const responseBody = await response.text();
        console.log('[Twitter OAuth 1.0a] Request token response:', responseBody);

        const responseParams = new URLSearchParams(responseBody);
        const oauthToken = responseParams.get('oauth_token');
        const oauthTokenSecret = responseParams.get('oauth_token_secret');
        const oauthCallbackConfirmed = responseParams.get('oauth_callback_confirmed');

        if (!oauthToken || !oauthTokenSecret || oauthCallbackConfirmed !== 'true') {
            console.error('[Twitter OAuth 1.0a] Invalid response:', responseBody);
            return res.redirect(`${redirect_origin || 'http://localhost:3002'}?error=invalid_request_token`);
        }

        // Store the request token secret temporarily (needed for access token exchange)
        tempTwitterTokens.set(oauthToken, {
            secret: oauthTokenSecret,
            userId: userId,
            redirect_origin: redirect_origin || 'http://localhost:3002'
        });

        console.log('[Twitter OAuth 1.0a] Stored temp token, redirecting to authorization...');

        // Redirect user to Twitter authorization page
        res.redirect(`https://api.twitter.com/oauth/authorize?oauth_token=${oauthToken}`);

    } catch (error) {
        console.error('[Twitter OAuth 1.0a] Error:', error);
        res.redirect(`${redirect_origin || 'http://localhost:3002'}?error=twitter_oauth_failed`);
    }
});


app.get('/auth/:platform', (req, res) => {
    const { platform } = req.params;
    const { userId, redirect_origin } = req.query;

    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    // REMOVED FACEBOOK from this list - it now uses dedicated /auth/facebook endpoint!
    // For platforms that use Web Intents (currently none for Business Poster)
    const webIntentPlatforms = [];

    if (webIntentPlatforms.includes(platform.toLowerCase())) {
        console.log(`[Simple Auth] ${platform} - Using Web Intent, redirecting back as connected`);
        const origin = redirect_origin || 'http://localhost:3002';
        res.redirect(`${origin}?connected=${platform}`);
        return;
    }

    // For Twitter, LinkedIn and other platforms, use real OAuth
    const url = getOAuthUrl(platform, userId || 'anonymous', redirect_origin);
    if (url) {
        res.redirect(url);
    } else {
        res.status(400).send('Invalid platform');
    }
});

// Get connected account info
app.get('/auth/twitter/status/:userId', (req, res) => {
    const { userId } = req.params;
    const tokenData = userTokens.get(`twitter_${userId}`);

    if (tokenData && tokenData.username) {
        res.json({
            connected: true,
            username: tokenData.username
        });
    } else {
        res.json({
            connected: false
        });
    }
});

// =============== FACEBOOK OAUTH & AUTO-POSTING ===============

// Facebook OAuth Step 1: Initiate OAuth
app.get('/auth/facebook', (req, res) => {
    const { userId, redirect_origin } = req.query;

    if (!userId) {
        return res.status(400).send('❌ userId is required');
    }

    console.log('[Facebook OAuth] Initiating for user:', userId);
    console.log('[Facebook OAuth] Redirect origin:', redirect_origin || 'not provided');

    // Build OAuth URL with proper encoding
    // Using basic permissions that don't require app review
    const params = new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID,
        redirect_uri: 'http://localhost:5001/auth/facebook/callback',
        state: `${userId}:::${redirect_origin || 'http://localhost:3002'}`,
        scope: 'public_profile,pages_show_list,pages_read_engagement',
        response_type: 'code'
    });

    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?${params.toString()}`;

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

console.log("--- STARTING WEBSITE SUMMARIZER SERVER v4 ---");

const PORT = 5001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);

    // Initialize and start the background scheduler
    console.log('[Server] Initializing background scheduler...');

    // Create a wrapper function for publishing with REAL API calls
    const publishPost = async ({ userId, platforms, content, mediaUrl }) => {
        try {
            const results = {};
            const cleanedContent = content.replace(/\[.*?\]/g, '').trim();

            for (const p of platforms) {
                try {
                    let optimizedCaption = cleanedContent;

                    if (p === 'linkedin') {
                        optimizedCaption = optimizeCaptionForLinkedIn(cleanedContent);

                        try {
                            console.log('[Scheduler][LinkedIn] Attempting API post...');

                            // Fetch LinkedIn tokens from Firestore
                            const tokensRef = doc(db, 'users', userId, 'tokens', 'linkedin');
                            const tokenDoc = await getDoc(tokensRef);

                            if (!tokenDoc.exists()) {
                                throw new Error('LinkedIn not connected. Please connect LinkedIn first.');
                            }

                            const tokenData = tokenDoc.data();
                            const access_token = tokenData.access_token;

                            if (!access_token) {
                                throw new Error('No LinkedIn access token found');
                            }

                            console.log('[Scheduler][LinkedIn] Token found, creating post...');

                            // Get LinkedIn user URN (person ID)
                            const userInfoResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
                                headers: {
                                    'Authorization': `Bearer ${access_token}`
                                }
                            });

                            if (!userInfoResponse.ok) {
                                throw new Error(`Failed to get LinkedIn user info: ${userInfoResponse.status}`);
                            }

                            const userInfo = await userInfoResponse.json();
                            const personUrn = `urn:li:person:${userInfo.sub}`;

                            console.log('[Scheduler][LinkedIn] User URN:', personUrn);

                            // Handle image upload if media exists
                            let assetUrn = null;
                            if (mediaUrl) {
                                try {
                                    // STEP 1: Register LinkedIn Image Upload
                                    console.log('[Scheduler][LinkedIn] Step 1: Registering image upload...');
                                    const registerResponse = await fetch('https://api.linkedin.com/v2/assets?action=registerUpload', {
                                        method: 'POST',
                                        headers: {
                                            'Authorization': `Bearer ${access_token}`,
                                            'Content-Type': 'application/json',
                                            'X-Restli-Protocol-Version': '2.0.0'
                                        },
                                        body: JSON.stringify({
                                            registerUploadRequest: {
                                                recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
                                                owner: personUrn,
                                                serviceRelationships: [{
                                                    relationshipType: 'OWNER',
                                                    identifier: 'urn:li:userGeneratedContent'
                                                }]
                                            }
                                        })
                                    });

                                    if (!registerResponse.ok) {
                                        throw new Error(`Register upload failed: ${registerResponse.status}`);
                                    }

                                    const registerData = await registerResponse.json();
                                    const uploadUrl = registerData.value.uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl;
                                    assetUrn = registerData.value.asset;

                                    console.log('[Scheduler][LinkedIn] Step 2: Uploading image binary...');

                                    // STEP 2: Download image and upload binary
                                    const imageResponse = await fetch(mediaUrl);
                                    if (!imageResponse.ok) {
                                        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
                                    }
                                    const imageBuffer = await imageResponse.arrayBuffer();

                                    const uploadBinaryResponse = await fetch(uploadUrl, {
                                        method: 'PUT',
                                        headers: {
                                            'Authorization': `Bearer ${access_token}`
                                        },
                                        body: imageBuffer
                                    });

                                    if (!uploadBinaryResponse.ok) {
                                        throw new Error(`Binary upload failed: ${uploadBinaryResponse.status}`);
                                    }

                                    console.log('[Scheduler][LinkedIn] ✅ Image uploaded, asset:', assetUrn);

                                } catch (imageError) {
                                    console.error('[Scheduler][LinkedIn] Image upload failed:', imageError);
                                    // Continue without image if upload fails
                                    assetUrn = null;
                                }
                            }

                            // STEP 3: Create LinkedIn UGC Post with asset URN
                            console.log('[Scheduler][LinkedIn] Step 3: Creating post...');
                            const ugcPostData = {
                                author: personUrn,
                                lifecycleState: 'PUBLISHED',
                                specificContent: {
                                    'com.linkedin.ugc.ShareContent': {
                                        shareCommentary: {
                                            text: optimizedCaption
                                        },
                                        shareMediaCategory: assetUrn ? 'IMAGE' : 'NONE',
                                        ...(assetUrn && {
                                            media: [{
                                                status: 'READY',
                                                media: assetUrn  // Use asset URN, not originalUrl!
                                            }]
                                        })
                                    }
                                },
                                visibility: {
                                    'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
                                }
                            };

                            const ugcResponse = await fetch('https://api.linkedin.com/v2/ugcPosts', {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${access_token}`,
                                    'Content-Type': 'application/json',
                                    'X-Restli-Protocol-Version': '2.0.0'
                                },
                                body: JSON.stringify(ugcPostData)
                            });

                            if (!ugcResponse.ok) {
                                const errorText = await ugcResponse.text();
                                throw new Error(`LinkedIn API error: ${ugcResponse.status} - ${errorText}`);
                            }

                            const ugcData = await ugcResponse.json();
                            const postId = ugcData.id;

                            console.log('[Scheduler][LinkedIn] ✅ Post created successfully:', postId);

                            results[p] = {
                                status: 'success',
                                action: 'api_post',
                                postId: postId,
                                url: `https://www.linkedin.com/feed/update/${postId}`,
                                optimizedCaption: optimizedCaption
                            };

                        } catch (linkedinError) {
                            console.error('[Scheduler][LinkedIn] API failed:', linkedinError.message);
                            // Fallback to share URL
                            const shortUrl = mediaUrl ? await shortenUrl(mediaUrl) : null;
                            const shareUrl = mediaUrl
                                ? `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(optimizedCaption + "\n\n" + (shortUrl || mediaUrl))}`
                                : `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(optimizedCaption)}`;

                            results[p] = {
                                status: 'failed',
                                action: 'share_dialog_fallback',
                                url: shareUrl,
                                error: linkedinError.message,
                                optimizedCaption: optimizedCaption
                            };
                        }

                    } else if (p === 'twitter') {
                        console.log('===== TWITTER SCHEDULER CALLED =====');
                        console.log('[Scheduler][Twitter] Attempting auto-post...');
                        optimizedCaption = optimizeCaptionForTwitter(cleanedContent);

                        try {
                            // Fetch Twitter OAuth 1.0a tokens from Firestore
                            const tokensRef = doc(db, 'users', userId, 'tokens', 'twitter');
                            const tokenDoc = await getDoc(tokensRef);

                            if (!tokenDoc.exists() || !tokenDoc.data()?.access_token) {
                                throw new Error('Twitter not connected');
                            }

                            const tokenData = tokenDoc.data();
                            const access_token = tokenData.access_token;
                            const access_token_secret = tokenData.access_token_secret;

                            console.log('[Scheduler][Twitter] Token found:', {
                                access_token: access_token?.substring(0, 10) + '...',
                                access_token_secret: access_token_secret ? 'present' : 'missing',
                                oauth_version: tokenData.oauth_version
                            });

                            let media_id_string = null;

                            // Upload media if provided
                            if (mediaUrl) {
                                console.log('[Scheduler][Twitter] Uploading media...');
                                const mediaUploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';

                                // Download image
                                const imageResponse = await fetch(mediaUrl);
                                if (!imageResponse.ok) {
                                    throw new Error(`Failed to download image: ${imageResponse.status}`);
                                }
                                const imageBuffer = await imageResponse.arrayBuffer();
                                const base64Image = Buffer.from(imageBuffer).toString('base64');

                                const mediaParams = { media_data: base64Image };

                                console.log('[Scheduler][Twitter] Generating OAuth signature with:', {
                                    client_id: process.env.TWITTER_CLIENT_ID?.substring(0, 10) + '...',
                                    client_secret: process.env.TWITTER_CLIENT_SECRET ? 'present' : 'missing',
                                    access_token: access_token?.substring(0, 10) + '...',
                                    access_token_secret: access_token_secret ? 'present' : 'missing'
                                });

                                const mediaAuthHeader = generateTwitterOAuth1Signature(
                                    'POST',
                                    mediaUploadUrl,
                                    mediaParams,  // ✅ NOW INCLUDES media_data like immediate posts!
                                    process.env.TWITTER_CLIENT_ID,
                                    process.env.TWITTER_CLIENT_SECRET,
                                    access_token,
                                    access_token_secret
                                );

                                console.log('[Scheduler][Twitter] Auth header generated:', mediaAuthHeader.substring(0, 50) + '...');

                                const mediaBody = new URLSearchParams(mediaParams);

                                const mediaUploadResponse = await fetch(mediaUploadUrl, {
                                    method: 'POST',
                                    headers: {
                                        'Authorization': mediaAuthHeader,
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    },
                                    body: mediaBody
                                });

                                if (!mediaUploadResponse.ok) {
                                    const errorText = await mediaUploadResponse.text();
                                    throw new Error(`Media upload failed: ${mediaUploadResponse.status} - ${errorText}`);
                                }

                                const mediaData = await mediaUploadResponse.json();
                                media_id_string = mediaData.media_id_string;
                                console.log('[Scheduler][Twitter] Media uploaded:', media_id_string);
                            }

                            // Create tweet
                            console.log('[Scheduler][Twitter] Creating tweet...');
                            const tweetUrl = 'https://api.twitter.com/2/tweets';
                            const tweetBody = {
                                text: optimizedCaption
                            };

                            if (media_id_string) {
                                tweetBody.media = { media_ids: [media_id_string] };
                            }

                            const tweetAuthHeader = generateTwitterOAuth1Signature(
                                'POST',
                                tweetUrl,
                                {},
                                process.env.TWITTER_CLIENT_ID,
                                process.env.TWITTER_CLIENT_SECRET,
                                access_token,
                                access_token_secret
                            );

                            const tweetResponse = await fetch(tweetUrl, {
                                method: 'POST',
                                headers: {
                                    'Authorization': tweetAuthHeader,
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(tweetBody)
                            });

                            if (!tweetResponse.ok) {
                                const errorText = await tweetResponse.text();
                                throw new Error(`Tweet creation failed: ${tweetResponse.status} - ${errorText}`);
                            }

                            const tweetData = await tweetResponse.json();
                            const tweetId = tweetData.data.id;
                            console.log('[Scheduler][Twitter] ✅ Tweet created:', tweetId);

                            results[p] = {
                                status: 'success',
                                action: 'auto_posted',
                                url: `https://twitter.com/i/web/status/${tweetId}`,
                                message: 'Twitter post published successfully!'
                            };
                        } catch (twitterError) {
                            console.error('[Scheduler][Twitter] Auto-post failed:', twitterError.message);
                            // Fallback to share dialog
                            const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(optimizedCaption)}`;
                            results[p] = {
                                status: 'success',
                                action: 'share_dialog',
                                url: shareUrl,
                                optimizedCaption: optimizedCaption
                            };
                        }

                    } else if (p === 'facebook') {
                        console.log('[Scheduler][Facebook] Attempting auto-post...');
                        optimizedCaption = optimizeCaptionForFacebook(cleanedContent);

                        try {
                            // Fetch Facebook Page tokens from Firestore
                            const tokensRef = doc(db, 'users', userId, 'tokens', 'facebook');
                            const tokenDoc = await getDoc(tokensRef);

                            if (!tokenDoc.exists() || !tokenDoc.data()?.access_token) {
                                throw new Error('Facebook not connected');
                            }

                            const tokenData = tokenDoc.data();
                            const pageAccessToken = tokenData.access_token;
                            const pageId = tokenData.page_id;

                            console.log('[Scheduler][Facebook] Using page:', tokenData.page_name);

                            // Post photo to Facebook Page
                            if (mediaUrl) {
                                const photoUrl = `https://graph.facebook.com/v18.0/${pageId}/photos`;

                                const photoBody = {
                                    url: mediaUrl,
                                    caption: optimizedCaption,
                                    published: true,
                                    access_token: pageAccessToken
                                };

                                const photoResponse = await fetch(photoUrl, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify(photoBody)
                                });

                                const photoData = await photoResponse.json();

                                if (!photoResponse.ok) {
                                    throw new Error(JSON.stringify(photoData));
                                }

                                if (photoData.id || photoData.post_id) {
                                    const postId = photoData.post_id || photoData.id;
                                    console.log('[Scheduler][Facebook] ✅ Photo posted:', postId);

                                    results[p] = {
                                        status: 'success',
                                        action: 'auto_posted',
                                        url: `https://www.facebook.com/${postId}`,
                                        message: 'Facebook post published successfully!'
                                    };
                                } else {
                                    throw new Error('Facebook photo upload failed');
                                }
                            } else {
                                throw new Error('Facebook requires an image');
                            }

                        } catch (facebookError) {
                            console.error('[Scheduler][Facebook] Auto-post failed:', facebookError.message);
                            // Fallback to share dialog
                            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(mediaUrl || 'https://www.facebook.com')}&quote=${encodeURIComponent(optimizedCaption)}`;
                            results[p] = {
                                status: 'success',
                                action: 'share_dialog',
                                url: shareUrl,
                                optimizedCaption: optimizedCaption
                            };
                        }
                    } else if (p === 'instagram') {
                        optimizedCaption = optimizeCaptionForInstagram(cleanedContent);
                        results[p] = {
                            status: 'success',
                            action: 'share_dialog',
                            url: 'https://www.instagram.com/',
                            optimizedCaption: optimizedCaption
                        };
                    }

                } catch (e) {
                    console.error(`[Scheduler] Failed to publish to ${p}:`, e);
                    results[p] = { status: "failed", error: e.message };
                }

                // Add delay between platforms to avoid rate limits (especially Twitter)
                const platformIndex = platforms.indexOf(p);
                if (platformIndex < platforms.length - 1) {
                    console.log('[Scheduler] Waiting 3 seconds before next platform...');
                    await new Promise(resolve => setTimeout(resolve, 3000));
                }
            }

            const resultStatuses = Object.values(results).map(r => r.status);
            const allSuccess = resultStatuses.every(status => status === 'success');
            const allFailed = resultStatuses.every(status => status === 'failed');

            return {
                success: !allFailed,
                results,
                allSuccess,
                error: allFailed ? 'All platforms failed' : null
            };
        } catch (error) {
            console.error('[Scheduler] Error in publishPost:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };

    // Create and start scheduler
    const scheduler = new SchedulerService(db, publishPost);
    scheduler.start(60000); // Check every 60 seconds
});

