import { getFirestore, collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';

/**
 * Background Scheduler Service
 * Checks Firestore for pending scheduled posts and publishes them when time arrives
 */

export class SchedulerService {
    constructor(db, publishFunction) {
        this.db = db;
        this.publishFunction = publishFunction; // The function that actually publishes posts
        this.isRunning = false;
    }

    /**
     * Check for scheduled posts that are due and publish them
     */
    async checkAndPublishScheduledPosts() {
        const now = new Date();
        console.log(`[Scheduler] Checking for scheduled posts at ${now.toISOString()}`);

        try {
            // Query Firestore for ALL pending posts (no composite index needed)
            const scheduledPostsRef = collection(this.db, 'scheduledPosts');
            const q = query(
                scheduledPostsRef,
                where('status', '==', 'pending')
            );

            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                console.log('[Scheduler] No pending posts found');
                return;
            }

            console.log(`[Scheduler] Found ${snapshot.size} pending post(s), checking times...`);

            // Filter in code for posts where scheduledAt <= now
            const duePosts = [];
            snapshot.docs.forEach(docSnap => {
                const postData = docSnap.data();
                const scheduledDate = new Date(postData.scheduledAt);

                if (scheduledDate <= now) {
                    duePosts.push({ id: docSnap.id, data: postData });
                }
            });

            if (duePosts.length === 0) {
                console.log('[Scheduler] No posts due for publishing yet');
                return;
            }

            console.log(`[Scheduler] Found ${duePosts.length} post(s) due for publishing`);

            // Process each scheduled post
            for (const post of duePosts) {
                const postId = post.id;
                const postData = post.data;

                console.log(`[Scheduler] Publishing post ${postId} for user ${postData.userId}`);

                try {
                    // Call the publish function
                    const result = await this.publishFunction({
                        userId: postData.userId,
                        platforms: postData.platforms,
                        content: postData.content,
                        mediaUrl: postData.mediaUrl
                    });

                    // Update post status based on result
                    const docRef = doc(this.db, 'scheduledPosts', postId);

                    if (result.success || result.allSuccess) {
                        await updateDoc(docRef, {
                            status: 'published',
                            publishedAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                            publishResult: result
                        });
                        console.log(`[Scheduler] ✅ Post ${postId} published successfully`);

                        // Create success notification
                        try {
                            const postLinks = {};
                            if (result.results) {
                                Object.keys(result.results).forEach(platform => {
                                    if (result.results[platform]?.url) {
                                        postLinks[platform] = result.results[platform].url;
                                    }
                                });
                            }

                            const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
                            await addDoc(collection(this.db, 'users', postData.userId, 'notifications'), {
                                type: 'scheduled_publish',
                                status: result.allSuccess ? 'success' : 'partial',
                                platforms: postData.platforms,
                                postLinks: postLinks,
                                caption: (postData.content || postData.caption || '').substring(0, 100),
                                imageUrl: postData.mediaUrl || postData.imageUrl || null,
                                createdAt: serverTimestamp(),
                                read: false
                            });
                            console.log('[Scheduler] ✅ Notification created');
                        } catch (notifError) {
                            console.error('[Scheduler] ❌ Notification error:', notifError);
                        }
                    } else {
                        await updateDoc(docRef, {
                            status: 'failed',
                            updatedAt: new Date().toISOString(),
                            error: result.error || 'Publishing failed',
                            publishResult: result
                        });
                        console.log(`[Scheduler] ❌ Post ${postId} failed to publish`);

                        // Create failure notification
                        try {
                            const { addDoc, collection, serverTimestamp } = await import('firebase/firestore');
                            await addDoc(collection(this.db, 'users', postData.userId, 'notifications'), {
                                type: 'scheduled_publish',
                                status: 'failed',
                                platforms: postData.platforms,
                                postLinks: {},
                                caption: (postData.content || postData.caption || '').substring(0, 100),
                                imageUrl: postData.mediaUrl || postData.imageUrl || null,
                                error: result.error || 'Publishing failed',
                                createdAt: serverTimestamp(),
                                read: false
                            });
                            console.log('[Scheduler] ✅ Failure notification created');
                        } catch (notifError) {
                            console.error('[Scheduler] ❌ Notification error:', notifError);
                        }
                    }

                } catch (publishError) {
                    console.error(`[Scheduler] Error publishing post ${postId}:`, publishError);

                    // Update to failed status
                    const docRef = doc(this.db, 'scheduledPosts', postId);
                    await updateDoc(docRef, {
                        status: 'failed',
                        updatedAt: new Date().toISOString(),
                        error: publishError.message || 'Unknown error'
                    });
                }
            }

        } catch (error) {
            console.error('[Scheduler] Error checking scheduled posts:', error);
        }
    }

    /**
     * Start the scheduler with a given interval (in milliseconds)
     */
    start(intervalMs = 60000) {
        if (this.isRunning) {
            console.log('[Scheduler] Already running, skipping start');
            return;
        }

        console.log(`[Scheduler] Starting with ${intervalMs}ms interval (${intervalMs / 1000}s)`);
        this.isRunning = true;

        // Run immediately on start
        this.checkAndPublishScheduledPosts();

        // Then run on interval
        this.intervalId = setInterval(() => {
            this.checkAndPublishScheduledPosts();
        }, intervalMs);

        console.log('[Scheduler] ✅ Scheduler started successfully');
    }

    /**
     * Stop the scheduler
     */
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.isRunning = false;
            console.log('[Scheduler] Scheduler stopped');
        }
    }
}
