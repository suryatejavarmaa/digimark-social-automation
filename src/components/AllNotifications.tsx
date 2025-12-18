import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, CheckCircle, AlertCircle, CheckCheck } from 'lucide-react';
import { getFirestore, collection, query, orderBy, getDocs, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { motion } from 'motion/react';

interface Notification {
    id: string;
    type: 'auto_publish' | 'scheduled_publish' | 'post_now';
    status: 'success' | 'partial' | 'failed';
    platforms: string[];
    postLinks: Record<string, string>;
    caption: string;
    imageUrl?: string;
    createdAt: { seconds: number };
    read: boolean;
    error?: string;
}

interface AllNotificationsProps {
    userId: string;
    onBack?: () => void;
}

export function AllNotifications({ userId, onBack }: AllNotificationsProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, [userId]);

    const loadNotifications = async () => {
        try {
            const db = getFirestore();
            const q = query(
                collection(db, 'users', userId, 'notifications'),
                orderBy('createdAt', 'desc')
            );

            const snapshot = await getDocs(q);
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Notification[];

            setNotifications(notifs);
        } catch (error) {
            console.error('Error loading notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (notificationId: string) => {
        const db = getFirestore();
        await updateDoc(doc(db, 'users', userId, 'notifications', notificationId), {
            read: true
        });

        setNotifications(prev =>
            prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
    };

    const markAllAsRead = async () => {
        try {
            const db = getFirestore();
            const batch = writeBatch(db);

            notifications.filter(n => !n.read).forEach(notif => {
                const docRef = doc(db, 'users', userId, 'notifications', notif.id);
                batch.update(docRef, { read: true });
            });

            await batch.commit();
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-green-400" />;
            case 'partial':
                return <AlertCircle className="w-5 h-5 text-yellow-400" />;
            case 'failed':
                return <AlertCircle className="w-5 h-5 text-red-400" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'success':
                return 'border-green-500/30';
            case 'partial':
                return 'border-yellow-500/30';
            case 'failed':
                return 'border-red-500/30';
            default:
                return 'border-white/10';
        }
    };

    const formatDate = (timestamp: { seconds: number }) => {
        const date = new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        });
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-[#1a1a1a] pb-24">
            {/* Header */}
            <div className="sticky top-0 z-10 bg-[#1a1a1a]/95 backdrop-blur-xl border-b border-white/10">
                <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => onBack?.()}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                        >
                            <ArrowLeft className="w-5 h-5 text-white/80" />
                        </button>
                        <div>
                            <h1 className="text-xl font-bold text-white">Notifications</h1>
                            {unreadCount > 0 && (
                                <p className="text-sm text-white/40">{unreadCount} unread</p>
                            )}
                        </div>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="px-3 py-2 rounded-xl bg-[#00d4ff]/10 text-[#00d4ff] font-medium text-sm hover:bg-[#00d4ff]/20 transition-all flex items-center gap-2"
                        >
                            <CheckCheck className="w-4 h-4" />
                            Mark all read
                        </button>
                    )}
                </div>
            </div>

            {/* Notifications List */}
            <div className="px-6 py-6">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-8 h-8 border-4 border-[#00d4ff] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-white/40">Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-white/20" />
                        </div>
                        <p className="text-white/40">No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map((notif) => (
                            <motion.div
                                key={notif.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`bg-[#2d2d2d] rounded-2xl p-4 border ${getStatusColor(notif.status)} ${!notif.read ? 'border-l-4 border-l-[#00d4ff]' : ''}`}
                                onClick={() => !notif.read && markAsRead(notif.id)}
                            >
                                <div className="flex gap-4">
                                    {/* Image Thumbnail */}
                                    {notif.imageUrl && (
                                        <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/20 flex-shrink-0">
                                            <img src={notif.imageUrl} alt="" className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex-1">
                                        {/* Status & Time */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {getStatusIcon(notif.status)}
                                            <span className={`text-sm font-medium ${notif.status === 'success' ? 'text-green-400' :
                                                notif.status === 'partial' ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                {notif.status === 'success' ? 'Published Successfully' :
                                                    notif.status === 'partial' ? 'Partially Published' :
                                                        'Publishing Failed'}
                                            </span>
                                            <span className="text-xs text-white/40 ml-auto">
                                                {formatDate(notif.createdAt)}
                                            </span>
                                        </div>

                                        {/* Caption */}
                                        <p className="text-white/80 text-sm mb-3">
                                            {notif.caption}
                                        </p>

                                        {/* Platforms & Links */}
                                        <div className="flex flex-wrap gap-2">
                                            {notif.platforms.map(platform => (
                                                notif.postLinks[platform] ? (
                                                    <a
                                                        key={platform}
                                                        href={notif.postLinks[platform]}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-3 py-1.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-lg text-sm font-medium capitalize flex items-center gap-1 hover:bg-[#00d4ff]/20 transition-all"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        {platform}
                                                        <ExternalLink className="w-3 h-3" />
                                                    </a>
                                                ) : (
                                                    <span
                                                        key={platform}
                                                        className="px-3 py-1.5 bg-white/5 text-white/40 rounded-lg text-sm font-medium capitalize"
                                                    >
                                                        {platform} (failed)
                                                    </span>
                                                )
                                            ))}
                                        </div>

                                        {/* Error Message */}
                                        {notif.error && (
                                            <p className="text-red-400/70 text-xs mt-2">
                                                Error: {notif.error}
                                            </p>
                                        )}
                                    </div>

                                    {/* Unread Indicator */}
                                    {!notif.read && (
                                        <div className="w-2 h-2 bg-[#00d4ff] rounded-full flex-shrink-0 mt-2" />
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
