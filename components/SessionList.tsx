import React from 'react';
import { WorkoutSession } from '../types';
import { ChevronRight, Calendar, Activity, Zap } from 'lucide-react';

interface SessionListProps {
  sessions: WorkoutSession[];
  onSelectSession: (session: WorkoutSession) => void;
}

export const SessionList: React.FC<SessionListProps> = ({ sessions, onSelectSession }) => {
  // Sort by date descending
  const sortedSessions = [...sessions].sort((a, b) => {
    const [d1, m1, y1] = a.date.split('-').map(Number);
    const [d2, m2, y2] = b.date.split('-').map(Number);
    return new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime();
  });

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 bg-slate-800/80 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-lg font-semibold text-white">Recent Workouts</h3>
      </div>
      <div className="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
        {sortedSessions.map((session) => (
          <div 
            key={session.id}
            onClick={() => onSelectSession(session)}
            className="group flex items-center justify-between p-4 rounded-lg bg-slate-700/20 hover:bg-slate-700/50 border border-transparent hover:border-slate-600 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-500/10 p-3 rounded-full text-blue-400 group-hover:bg-blue-500/20 transition-colors">
                <Activity size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                   <p className="font-medium text-slate-200">Freestyle Workout</p>
                   {session.intensityScore && (
                     <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center gap-0.5">
                       <Zap size={10} fill="currentColor" /> {session.intensityScore}
                     </span>
                   )}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {session.date}</span>
                  <span>•</span>
                  <span>{session.durationMin} min</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-200">{session.calories} kcal</p>
                <p className="text-xs text-slate-500">{session.avgHr} avg bpm</p>
              </div>
              <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};