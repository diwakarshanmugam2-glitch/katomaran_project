import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';

const insights = [
  {
    id: 1,
    title: 'High Performing Link',
    description: 'Your link "summer-sale" has seen a 300% increase in traffic in the last 24 hours.',
    icon: TrendingUp,
    color: 'text-green-400',
    bg: 'bg-green-400/10',
    border: 'border-green-400/20'
  },
  {
    id: 2,
    title: 'Expiring Soon',
    description: '3 of your shortened links are set to expire in the next 48 hours.',
    icon: AlertTriangle,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10',
    border: 'border-yellow-400/20'
  },
  {
    id: 3,
    title: 'Optimization Tip',
    description: 'Using custom aliases instead of random codes increases click-through rates by 34%.',
    icon: Lightbulb,
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-100'
  }
];

export const SmartInsights: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">
      {insights.map((insight, index) => {
        const Icon = insight.icon;
        return (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            key={insight.id}
            className={`glass-premium p-4 border ${insight.border} hover:bg-slate-50] transition-colors cursor-pointer group`}
          >
            <div className="flex gap-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${insight.bg} transition-transform group-hover:scale-110`}>
                <Icon className={`h-4 w-4 ${insight.color}`} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-blue-500 transition-colors">{insight.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{insight.description}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
