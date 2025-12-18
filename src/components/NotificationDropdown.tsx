import { useState, useEffect, useRef } from 'react';
import { Bell, ExternalLink, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';

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

interface NotificationDropdownProps {
    userId: string;
    onSeeAllClick?: () => void;
}

export function NotificationDropdown({ userId, onSeeAllClick }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Real-time listener for notifications
    useEffect(() => {
        if (!userId) return;

        const db = getFirestore();
        const q = query(
            collection(db, 'users', userId, 'notifications'),
            orderBy('createdAt', 'desc'),
            limit(4)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const notifs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Notification[];

            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.read).length);
        });

        return () => unsubscribe();
    }, [userId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const markAsRead = async (notificationId: string) => {
        const db = getFirestore();
        await updateDoc(doc(db, 'users', userId, 'notifications', notificationId), {
            read: true
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'success':
                return <CheckCircle className="w-4 h-4 text-green-400" />;
            case 'partial':
                return <AlertCircle className="w-4 h-4 text-yellow-400" />;
            case 'failed':
                return <AlertCircle className="w-4 h-4 text-red-400" />;
            default:
                return <Clock className="w-4 h-4 text-blue-400" />;
        }
    };



    const formatTime = (timestamp: { seconds: number }) => {
        const date = new Date(timestamp.seconds * 1000);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        return `${days}d ago`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon with Badge */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-white/5 transition-all"
            >
                <Bell className="w-6 h-6 text-white/60" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00d4ff] text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/70 backdrop-blur-md z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="fixed top-16 right-4 w-[80vw] max-w-sm bg-[#1a1a1a] rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] border border-white/30 overflow-hidden z-50"
                        >
                            {/* Header */}
                            <div className="px-3 py-2.5 border-b border-white/10 bg-black/30">
                                <h3 className="text-white font-bold text-sm">Notifications</h3>
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-[320px] overflow-y-auto p-1.5">
                                {notifications.length === 0 ? (
                                    <div className="p-12 text-center text-white/40">
                                        <Bell className="w-16 h-16 mx-auto mb-3 opacity-20" />
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-1.5">
                                        {notifications.map((notif) => (
                                            <div
                                                key={notif.id}
                                                className={`p-2.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer border ${!notif.read
                                                    ? 'bg-blue-500/5 border-blue-500/20'
                                                    : 'bg-white/[0.02] border-white/5'
                                                    }`}
                                                onClick={() => !notif.read && markAsRead(notif.id)}
                                            >
                                                {/* Header Row: Status + Time */}
                                                <div className="flex items-center justify-between mb-2">
                                                    {/* Status Indicator */}
                                                    <div className="flex items-center gap-2">
                                                        {getStatusIcon(notif.status)}
                                                        <span className={`text-[10px] font-bold uppercase tracking-wide ${notif.status === 'success' ? 'text-green-400' :
                                                            notif.status === 'partial' ? 'text-yellow-400' :
                                                                'text-red-400'
                                                            }`}>
                                                            {notif.status === 'success' ? 'Posted' :
                                                                notif.status === 'partial' ? 'Partial' : 'Failed'}
                                                        </span>
                                                        {!notif.read && (
                                                            <div className="w-1.5 h-1.5 bg-[#00d4ff] rounded-full ml-1" />
                                                        )}
                                                    </div>

                                                    {/* Timestamp */}
                                                    <span className="text-white/50 text-[10px] font-medium">
                                                        {formatTime(notif.createdAt)}
                                                    </span>
                                                </div>

                                                {/* Content Row: Thumbnail + Caption - Compact Horizontal */}
                                                <div className="flex gap-2 mb-2 items-start">
                                                    {/* Thumbnail - Compact Size */}
                                                    {notif.imageUrl && (
                                                        <div className="w-10 h-10 rounded-md overflow-hidden bg-black/40 flex-shrink-0 border border-white/10">
                                                            <img
                                                                src={notif.imageUrl}
                                                                alt="Post"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Caption - Constrained to image height with ellipsis */}
                                                    <div className="flex-1 min-w-0 h-10 overflow-hidden">
                                                        <p className="text-xs text-white/90 line-clamp-3 leading-tight">
                                                            {notif.caption}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Platform Links Row */}
                                                {Object.keys(notif.postLinks || {}).length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {notif.platforms.map(platform => (
                                                            notif.postLinks[platform] ? (
                                                                <a
                                                                    key={platform}
                                                                    href={notif.postLinks[platform]}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-[#00d4ff]/10 hover:bg-[#00d4ff]/20 border border-[#00d4ff]/30 rounded-md text-[#00d4ff] text-[10px] font-semibold transition-all"
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <span className="capitalize">{platform}</span>
                                                                    <ExternalLink className="w-3 h-3" />
                                                                </a>
                                                            ) : (
                                                                <span
                                                                    key={platform}
                                                                    className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 text-[10px] font-semibold"
                                                                >
                                                                    <span className="capitalize">{platform}</span>
                                                                    <span>(failed)</span>
                                                                </span>
                                                            )
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Footer - See All */}
                            {notifications.length > 0 && (
                                <div className="p-2 border-t border-white/10 bg-black/20">
                                    <button
                                        onClick={() => {
                                            onSeeAllClick?.();
                                            setIsOpen(false);
                                        }}
                                        className="block w-full text-center text-[#00d4ff] font-bold text-xs hover:text-[#00b8e6] transition-all"
                                    >
                                        See All Notifications
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
