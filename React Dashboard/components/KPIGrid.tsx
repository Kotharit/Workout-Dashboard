import React from 'react';
import { WorkoutSession } from '../types';
import { Activity, Flame, Heart, Timer } from 'lucide-react';

interface KPIGridProps {
  sessions: WorkoutSession[];
}

export const KPIGrid: React.FC<KPIGridProps> = ({ sessions }) => {
  const totalCalories = sessions.reduce((acc, s) => acc + s.calories, 0);
  const totalDuration = sessions.reduce((acc, s) => acc + s.durationMin, 0);
  const avgHr = Math.round(sessions.reduce((acc, s) => acc + s.avgHr, 0) / sessions.length);
  const maxRecordedHr = Math.max(...sessions.map(s => s.maxHr));

  const StatCard = ({ title, value, sub, icon, colorClass }: { title: string, value: string, sub: string, icon: React.ReactNode, colorClass: string }) => (
    <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl flex items-start justify-between hover:border-slate-600 transition-colors shadow-lg shadow-black/20">
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
        <p className="text-xs text-slate-500">{sub}</p>
      </div>
      <div className={`p-3 rounded-lg ${colorClass} bg-opacity-10`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Burn" 
        value={`${totalCalories.toLocaleString()} kcal`} 
        sub="Across 6 sessions"
        icon={<Flame className="text-orange-500" size={24} />}
        colorClass="bg-orange-500"
      />
      <StatCard 
        title="Total Time" 
        value={`${Math.floor(totalDuration / 60)}h ${totalDuration % 60}m`} 
        sub="Avg 42m / session"
        icon={<Timer className="text-blue-500" size={24} />}
        colorClass="bg-blue-500"
      />
      <StatCard 
        title="Avg Heart Rate" 
        value={`${avgHr} bpm`} 
        sub="Moderate Intensity"
        icon={<Activity className="text-emerald-500" size={24} />}
        colorClass="bg-emerald-500"
      />
      <StatCard 
        title="Peak Heart Rate" 
        value={`${maxRecordedHr} bpm`} 
        sub="Max Recorded"
        icon={<Heart className="text-rose-500" size={24} />}
        colorClass="bg-rose-500"
      />
    </div>
  );
};
