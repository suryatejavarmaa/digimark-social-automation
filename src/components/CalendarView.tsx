import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Clock, Plus, Linkedin, Twitter, Facebook, Eye, Edit } from 'lucide-react';
import { getFirestore, collection, query, where, getDocs, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ScheduledPostPreviewModal } from './ScheduledPostPreviewModal';
import { ConfirmationModal, AlertModal } from './ConfirmationModal';
import { EditScheduledPostModal } from './EditScheduledPostModal';

interface CalendarViewProps {
    userId: string;
}

export function CalendarView({ userId }: CalendarViewProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [scheduledPosts, setScheduledPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewPost, setPreviewPost] = useState<any>(null);
    const [showPreview, setShowPreview] = useState(false);

    // Modal states
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);
    const [postToCancel, setPostToCancel] = useState<string | null>(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' | 'info' });
    const [editingPost, setEditingPost] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Fetch scheduled posts from Firestore
    useEffect(() => {
        const fetchScheduledPosts = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const db = getFirestore();
                const postsRef = collection(db, 'scheduledPosts');
                const q = query(postsRef, where('userId', '==', userId));

                const snapshot = await getDocs(q);
                const posts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                console.log('[Calendar] Fetched scheduled posts:', posts);
                setScheduledPosts(posts);
            } catch (error) {
                console.error('[Calendar] Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchScheduledPosts();
    }, [userId]);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const isToday = (day: number) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const isSelected = (day: number) => {
        return day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();
    };

    // Check if a day has scheduled posts
    const hasPostsOnDay = (day: number) => {
        return scheduledPosts.some(post => {
            const postDate = new Date(post.scheduledAt);
            return postDate.getDate() === day &&
                postDate.getMonth() === currentDate.getMonth() &&
                postDate.getFullYear() === currentDate.getFullYear();
        });
    };

    // Get posts for selected date
    const getPostsForSelectedDate = () => {
        return scheduledPosts.filter(post => {
            const postDate = new Date(post.scheduledAt);
            return postDate.getDate() === selectedDate.getDate() &&
                postDate.getMonth() === selectedDate.getMonth() &&
                postDate.getFullYear() === selectedDate.getFullYear();
        });
    };

    // Platform icon mapping
    const platformIcons: any = {
        linkedin: <Linkedin size={16} className="text-[#0077b5]" />,
        twitter: <Twitter size={16} className="text-[#1da1f2]" />,
        facebook: <Facebook size={16} className="text-[#1877f2]" />
    };

    // Handle Post Now
    const handlePostNow = async (postId: string) => {
        const post = scheduledPosts.find(p => p.id === postId);
        if (!post) return;

        try {
            // Handle different field names (old vs new)
            const content = post.content || post.caption;
            const mediaUrl = post.mediaUrl || post.imageUrl;

            console.log('[Post Now] Found post:', post);
            console.log('[Post Now] Sending data:', {
                userId,
                platforms: post.platforms,
                content,
                mediaUrl,
                postType: post.postType
            });

            const response = await fetch('http://localhost:5001/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    platforms: post.platforms,
                    content: content,
                    mediaUrl: mediaUrl,
                    postType: post.postType || 'imageGen'
                })
            });

            const result = await response.json();
            console.log('[Post Now] Response:', result);

            if (response.ok && result.success) {
                const db = getFirestore();
                await deleteDoc(doc(db, 'scheduledPosts', postId));
                setScheduledPosts(prev => prev.filter(p => p.id !== postId));

                // Show success modal
                setAlertConfig({
                    title: 'Posted Successfully!',
                    message: 'Your post has been published to all selected platforms.',
                    type: 'success'
                });
                setShowAlert(true);
            } else {
                throw new Error(result.error || 'Failed to post');
            }
        } catch (error: any) {
            console.error('[Post Now] Error:', error);

            // Show error modal
            setAlertConfig({
                title: 'Failed to Post',
                message: error.message || 'An error occurred while posting.',
                type: 'error'
            });
            setShowAlert(true);
        }
    };

    // Handle Cancel
    const handleCancel = async (postId: string) => {
        setPostToCancel(postId);
        setShowConfirmCancel(true);
    };

    const confirmCancel = async () => {
        if (!postToCancel) return;

        try {
            const db = getFirestore();
            await deleteDoc(doc(db, 'scheduledPosts', postToCancel));
            setScheduledPosts(prev => prev.filter(p => p.id !== postToCancel));

            // Show success modal
            setAlertConfig({
                title: 'Scheduled Post Canceled',
                message: 'The scheduled post has been successfully removed.',
                type: 'success'
            });
            setShowAlert(true);
        } catch (error: any) {
            // Show error modal
            setAlertConfig({
                title: 'Failed to Cancel',
                message: error.message || 'An error occurred while canceling the post.',
                type: 'error'
            });
            setShowAlert(true);
        }
    };

    // Handle Edit Save
    const handleSaveEdit = async (updatedPost: any) => {
        try {
            const db = getFirestore();
            await updateDoc(doc(db, 'scheduledPosts', updatedPost.id), {
                content: updatedPost.content,
                caption: updatedPost.caption,
                mediaUrl: updatedPost.mediaUrl,
                imageUrl: updatedPost.imageUrl,
                platforms: updatedPost.platforms,
                scheduledAt: updatedPost.scheduledAt,
                updatedAt: serverTimestamp()
            });

            // Reload posts
            const fetchUpdatedPosts = async () => {
                const db = getFirestore();
                const q = query(
                    collection(db, 'scheduledPosts'),
                    where('userId', '==', userId)
                );
                const snapshot = await getDocs(q);
                const posts = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setScheduledPosts(posts);
            };
            fetchUpdatedPosts();

            // Show success
            setAlertConfig({
                title: 'Post Updated',
                message: 'The scheduled post has been successfully updated.',
                type: 'success'
            });
            setShowAlert(true);
        } catch (error: any) {
            setAlertConfig({
                title: 'Update Failed',
                message: error.message || 'An error occurred while updating the post.',
                type: 'error'
            });
            setShowAlert(true);
        }
    };

    const postsForSelectedDate = getPostsForSelectedDate();

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="px-6 py-6 pb-24 space-y-6"
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-white text-2xl font-bold">Calendar</h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                        <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Calendar Card */}
            <div className="bg-[#1a1a1a] border border-white/10 rounded-3xl p-6 shadow-xl">
                {/* Month Year Display */}
                <div className="text-center mb-6">
                    <h3 className="text-white text-xl font-bold">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h3>
                </div>

                {/* Days Grid Header */}
                <div className="grid gap-2 mb-2 text-center" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-white/40 text-xs font-medium uppercase tracking-wider py-2">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days Grid Body */}
                <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}>
                    {/* Empty slots for previous month */}
                    {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                        <div key={`empty-${i}`} className="aspect-square" />
                    ))}

                    {/* Days */}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const today = isToday(day);
                        const selected = isSelected(day);
                        const hasPosts = hasPostsOnDay(day);

                        return (
                            <motion.button
                                key={day}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all
                  ${selected ? 'bg-[#00d4ff] text-white shadow-lg shadow-[#00d4ff]/20' :
                                        today ? 'bg-white/10 text-[#00d4ff] border border-[#00d4ff]/50' :
                                            'bg-white/5 text-white hover:bg-white/10 border border-transparent'
                                    }`}
                            >
                                <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-white/90'}`}>{day}</span>
                                {/* Dot for scheduled posts */}
                                {hasPosts && (
                                    <div className={`w-1 h-1 rounded-full mt-1 ${selected ? 'bg-white' : 'bg-[#00d4ff]'}`} />
                                )}
                            </motion.button>
                        );
                    })}
                </div>
            </div>

            {/* Selected Date Schedule */}
            <div>
                <h3 className="text-white/80 text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-[#00d4ff]" />
                    Schedule for {monthNames[selectedDate.getMonth()]} {selectedDate.getDate()}
                </h3>

                <div className="space-y-3">
                    {loading ? (
                        <div className="text-white/40 text-center py-8">Loading...</div>
                    ) : postsForSelectedDate.length > 0 ? (
                        postsForSelectedDate.map(post => {
                            const isPending = post.status === 'pending';
                            const isPublished = post.status === 'published';
                            const isFailed = post.status === 'failed';
                            const scheduledTime = new Date(post.scheduledAt);
                            const isPast = scheduledTime <= new Date();

                            return (
                                <div key={post.id} className={`border rounded-2xl p-4 space-y-3 ${isPublished ? 'bg-green-500/20 border-green-500/50' :
                                    isFailed ? 'bg-red-500/20 border-red-500/50' :
                                        'bg-white/10 border-white/20'
                                    }`}>
                                    {/* Status Badge */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {post.platforms?.map((p: string) => (
                                                <div key={p} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                                    {platformIcons[p] || p}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Status Badge */}
                                        {isPublished && (
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold flex items-center gap-1">
                                                ✅ Posted
                                            </span>
                                        )}
                                        {isFailed && (
                                            <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold flex items-center gap-1">
                                                ❌ Failed
                                            </span>
                                        )}
                                        {isPending && isPast && (
                                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold flex items-center gap-1">
                                                ⌛ Pending
                                            </span>
                                        )}
                                        {isPending && !isPast && (
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold flex items-center gap-1">
                                                📅 Scheduled
                                            </span>
                                        )}
                                    </div>

                                    {/* Caption */}
                                    <p className="text-white text-sm line-clamp-2">{post.caption}</p>

                                    {/* Time */}
                                    <p className="text-white/40 text-xs">
                                        {scheduledTime.toLocaleTimeString('en-US', {
                                            hour: 'numeric',
                                            minute: '2-digit',
                                            hour12: true
                                        })}
                                    </p>

                                    {/* Actions - Only show for pending posts */}
                                    {isPending && (
                                        <div className="space-y-2">
                                            {/* Action Buttons Grid */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {/* Preview Button */}
                                                <button
                                                    onClick={() => {
                                                        setPreviewPost(post);
                                                        setShowPreview(true);
                                                    }}
                                                    className="bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                    <Eye size={16} />
                                                    Preview
                                                </button>

                                                {/* Edit Button */}
                                                <button
                                                    onClick={() => {
                                                        setEditingPost(post);
                                                        setShowEditModal(true);
                                                    }}
                                                    className="bg-white/5 hover:bg-white/10 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                                                    <Edit size={16} />
                                                    Edit
                                                </button>
                                            </div>

                                            {/* Post Now & Cancel Grid */}
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handlePostNow(post.id)}
                                                    className="flex-1 bg-[#00d4ff] hover:bg-[#00b8e6] text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors">
                                                    Post Now
                                                </button>
                                                <button
                                                    onClick={() => handleCancel(post.id)}
                                                    className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-medium transition-colors">
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Show error message for failed posts */}
                                    {isFailed && post.error && (
                                        <div className="text-red-400 text-xs bg-red-500/10 p-2 rounded-lg">
                                            Error: {post.error}
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-white/40 text-center py-8 text-sm">
                            No scheduled posts for this day
                        </div>
                    )}

                    <button className="w-full py-4 rounded-2xl border border-dashed border-white/20 text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm font-medium">
                        <Plus size={16} />
                        Add Event
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            <ScheduledPostPreviewModal
                isOpen={showPreview}
                onClose={() => setShowPreview(false)}
                post={previewPost}
            />

            {/* Edit Scheduled Post Modal */}
            <EditScheduledPostModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                post={editingPost}
                onSave={handleSaveEdit}
            />

            {/* Confirmation Modal for Cancel */}
            <ConfirmationModal
                isOpen={showConfirmCancel}
                onClose={() => {
                    setShowConfirmCancel(false);
                    setPostToCancel(null);
                }}
                onConfirm={confirmCancel}
                title="Cancel Scheduled Post?"
                message="Are you sure you want to cancel this scheduled post? This action cannot be undone."
                confirmText="Yes, Cancel Post"
                cancelText="No, Keep It"
                type="danger"
            />

            {/* Alert Modal for Success/Error */}
            <AlertModal
                isOpen={showAlert}
                onClose={() => setShowAlert(false)}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
            />
        </motion.div>
    );
}
