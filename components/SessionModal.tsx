import React from 'react';
import { WorkoutSession, Zone } from '../types';
import { X, Clock, Flame, Activity, Heart, Zap } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ZONE_COLORS } from '../constants';

interface SessionModalProps {
  session: WorkoutSession | null;
  onClose: () => void;
}

export const SessionModal: React.FC<SessionModalProps> = ({ session, onClose }) => {
  if (!session) return null;

  // Filter out zero-percent zones for cleaner chart
  const activeZones = session.zones.filter((z) => z.percent > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-slate-800 border border-slate-700 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900/50">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              Workout Details
              <span className="text-sm font-normal text-slate-400 bg-slate-700 px-2 py-0.5 rounded-full border border-slate-600">
                {session.date} • {session.startTime}
              </span>
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[80vh]">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 flex flex-col items-center">
              <Clock className="text-blue-400 mb-2" size={24} />
              <span className="text-2xl font-bold text-white">{session.durationMin} <span className="text-sm font-normal text-slate-400">min</span></span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">Duration</span>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 flex flex-col items-center">
              <Flame className="text-orange-500 mb-2" size={24} />
              <span className="text-2xl font-bold text-white">{session.calories} <span className="text-sm font-normal text-slate-400">kcal</span></span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">Calories</span>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 flex flex-col items-center">
              <Zap className="text-violet-400 mb-2" size={24} fill="currentColor" />
              <span className="text-2xl font-bold text-white">{session.intensityScore || '-'}</span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">Intensity</span>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 flex flex-col items-center">
              <Activity className="text-emerald-400 mb-2" size={24} />
              <span className="text-2xl font-bold text-white">{session.avgHr} <span className="text-sm font-normal text-slate-400">bpm</span></span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">Avg HR</span>
            </div>
            <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600 flex flex-col items-center">
              <Heart className="text-rose-500 mb-2" size={24} />
              <span className="text-2xl font-bold text-white">{session.maxHr} <span className="text-sm font-normal text-slate-400">bpm</span></span>
              <span className="text-xs text-slate-400 uppercase tracking-wide">Max HR</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Zone Chart */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Heart Rate Zones</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activeZones}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="percent"
                    >
                      {activeZones.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={ZONE_COLORS[entry.zone] || '#cbd5e1'} stroke="rgba(0,0,0,0)" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Zone List Details */}
            <div className="flex flex-col gap-3">
               <h3 className="text-lg font-semibold text-white mb-1">Zone Analysis</h3>
               {session.zones.map((z, idx) => (
                 <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 border border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ZONE_COLORS[z.zone] || '#64748b' }}></div>
                      <div>
                        <p className="font-medium text-slate-200">{z.zone}</p>
                        {z.bpm && <p className="text-xs text-slate-500">{z.bpm} bpm</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{z.percent}%</p>
                      {/* Calculate rough duration based on percentage of total duration */}
                      <p className="text-xs text-slate-400">
                        ~{Math.round((session.durationMin * z.percent) / 100)} min
                      </p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};