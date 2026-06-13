import React from 'react';
import { motion } from 'framer-motion';
import { MousePointerClick, Link2, Sparkles, Clock } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'click',
    title: 'New click from United States',
    target: 'campaign-alpha',
    time: '2 mins ago',
    icon: MousePointerClick,
    color: 'text-blue-500',
    bg: 'bg-blue-500/20'
  },
  {
    id: 2,
    type: 'create',
    title: 'Short link created',
    target: 'product-launch-2026',
    time: '1 hour ago',
    icon: Link2,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/20'
  },
  {
    id: 3,
    type: 'insight',
    title: 'Traffic spike detected!',
    target: 'summer-sale',
    time: '3 hours ago',
    icon: Sparkles,
    color: 'text-rose-500',
    bg: 'bg-rose-500/20'
  }
];

export const ActivityTimeline: React.FC = () => {
  return (
    <div className="glass-premium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-slate-800 font-heading font-semibold text-sm flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-500" />
          Recent Activity
        </h3>
        <button className="text-[10px] uppercase tracking-wider text-blue-500 hover:text-slate-800 transition-colors">
          View All
        </button>
      </div>

      <div className="relative pl-3 space-y-6">
        {/* Vertical Line */}
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent" />

        {activities.map((activity, i) => {
          const Icon = activity.icon;
          return (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={activity.id} 
              className="relative flex gap-4 items-start group"
            >
              <div className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${activity.bg} shadow-lg ring-4 ring-bg-dark transition-transform group-hover:scale-110`}>
                <Icon className={`h-3.5 w-3.5 ${activity.color}`} />
              </div>
              
              <div className="flex-1 pt-1">
                <p className="text-xs font-medium text-slate-800 group-hover:text-blue-500 transition-colors">
                  {activity.title}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  <span className="text-slate-500 font-mono">/{activity.target}</span> • {activity.time}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
