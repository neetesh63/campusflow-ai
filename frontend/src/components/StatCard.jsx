import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'cyan' }) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-pink-500/5 text-rose-400 border-rose-500/30',
    indigo: 'from-indigo-500/20 to-purple-500/5 text-indigo-400 border-indigo-500/30',
  };

  return (
    <div className={`p-5 rounded-2xl bg-gradient-to-br ${colorMap[color] || colorMap.cyan} border glass-panel transition-all hover:scale-[1.02] duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <h3 className="text-3xl font-black text-slate-100 tracking-tight">{value}</h3>
        {trend && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${trend.startsWith('+') ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs text-slate-400 font-medium truncate">{subtitle}</p>
      )}
    </div>
  );
}
