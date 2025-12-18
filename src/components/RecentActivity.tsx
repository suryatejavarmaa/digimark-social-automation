import { motion } from 'motion/react';
import { FileText, Image, Video, CheckCircle2, Clock, Loader2 } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'post',
    title: 'Post Scheduled',
    subtitle: 'Instagram • Tomorrow at 10:00 AM',
    status: 'done',
    icon: FileText,
    time: '2m ago',
  },
  {
    id: 2,
    type: 'image',
    title: 'Image Generated',
    subtitle: 'AI-powered brand visual',
    status: 'done',
    icon: Image,
    time: '15m ago',
  },
  {
    id: 3,
    type: 'video',
    title: 'Video Processing',
    subtitle: 'Rendering in progress...',
    status: 'processing',
    icon: Video,
    time: '1h ago',
  },
  {
    id: 4,
    type: 'post',
    title: 'Post Scheduled',
    subtitle: 'Facebook • Today at 6:00 PM',
    status: 'pending',
    icon: FileText,
    time: '2h ago',
  },
];

const statusConfig = {
  done: {
    icon: CheckCircle2,
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    label: 'Done',
  },
  processing: {
    icon: Loader2,
    color: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.1)',
    label: 'Processing',
  },
  pending: {
    icon: Clock,
    color: '#00d4ff',
    bg: 'rgba(0, 212, 255, 0.1)',
    label: 'Pending',
  },
};

export function RecentActivity() {
  return (
    <div className="space-y-3">
      {activities.map((activity, index) => {
        const Icon = activity.icon;
        const status = statusConfig[activity.status as keyof typeof statusConfig];
        const StatusIcon = status.icon;

        return (
          <motion.div
            key={activity.id}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="rounded-xl bg-[#2a2a2a]/50 border border-white/10 p-4 hover:bg-[#2a2a2a]/70 transition-all"
          >
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: status.bg }}
              >
                <Icon className="w-5 h-5" style={{ color: status.color }} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-white" style={{ fontSize: '0.9375rem', fontWeight: 600 }}>
                    {activity.title}
                  </h3>
                  <span className="text-white/40 flex-shrink-0" style={{ fontSize: '0.75rem' }}>
                    {activity.time}
                  </span>
                </div>
                <p className="text-white/60 mb-2" style={{ fontSize: '0.8125rem' }}>
                  {activity.subtitle}
                </p>

                {/* Status */}
                <div className="flex items-center gap-1.5">
                  <StatusIcon
                    className={activity.status === 'processing' ? 'animate-spin' : ''}
                    style={{ width: '14px', height: '14px', color: status.color }}
                  />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: status.color }}>
                    {status.label}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
