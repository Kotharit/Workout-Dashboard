import React, { useState, useMemo, useEffect } from 'react';
import { WORKOUT_DATA } from './constants';
import { WorkoutSession } from './types';
import { KPIGrid } from './components/KPIGrid';
import { SessionList } from './components/SessionList';
import { SessionModal } from './components/SessionModal';
import { SettingsModal } from './components/SettingsModal';
import { ImportModal } from './components/ImportModal';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area
} from 'recharts';
import { Dumbbell, LayoutDashboard, Settings, Plus } from 'lucide-react';

const App: React.FC = () => {
  // Initialize state from Local Storage or constants
  const [sessions, setSessions] = useState<WorkoutSession[]>(() => {
    try {
      const savedData = localStorage.getItem('pulseTrack_sessions');
      return savedData ? JSON.parse(savedData) : WORKOUT_DATA;
    } catch (e) {
      console.error("Failed to load from local storage", e);
      return WORKOUT_DATA;
    }
  });

  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Persist changes to Local Storage
  useEffect(() => {
    localStorage.setItem('pulseTrack_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Prepare data for charts (chronological order)
  const chartData = useMemo(() => {
    return [...sessions].sort((a, b) => {
       const [d1, m1, y1] = a.date.split('-').map(Number);
       const [d2, m2, y2] = b.date.split('-').map(Number);
       return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
    }).map(s => ({
      name: s.date.slice(0, 5), // DD-MM
      fullDate: s.date,
      calories: s.calories,
      duration: s.durationMin,
      avgHr: s.avgHr,
      maxHr: s.maxHr,
      intensity: s.intensityScore || 0,
    }));
  }, [sessions]);

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleImport = (newSessions: WorkoutSession[]) => {
    setSessions(prev => [...prev, ...newSessions]);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all data to the default constants? This will clear your imported entries.')) {
      setSessions(WORKOUT_DATA);
      setIsSettingsOpen(false);
    }
  };

  const maxId = Math.max(...sessions.map(s => s.id), 0);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Sidebar / Navigation (simplified as top bar for this scope) */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Dumbbell className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">PulseTrack</span>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsImportOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                <Plus size={16} />
                <span>Import</span>
              </button>
              <button 
                onClick={() => setIsImportOpen(true)}
                className="sm:hidden text-slate-400 hover:text-white transition-colors"
              >
                <Plus size={20} />
              </button>
              <div className="w-px h-6 bg-slate-700 mx-1"></div>
              <button className="text-slate-400 hover:text-white transition-colors">
                <LayoutDashboard size={20} />
              </button>
              <button 
                onClick={handleSettingsClick}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-slate-800 ml-1"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-slate-400">Welcome back. You've been consistent this week!</p>
          </div>
          <p className="text-sm text-slate-500 font-medium hidden sm:block">
            {sessions.length} Sessions Logged
          </p>
        </div>

        {/* KPIs */}
        <KPIGrid sessions={sessions} />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Charts */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart 1: Intensity & Calories */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-6">Intensity & Calories</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      yAxisId="left" 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{fill: '#334155', opacity: 0.2}}
                    />
                    <Bar yAxisId="left" dataKey="calories" name="Calories (kcal)" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar yAxisId="right" dataKey="intensity" name="Intensity Score" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Heart Rate Trends */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-6">Heart Rate Trends</h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorMaxHr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorAvgHr" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <YAxis 
                      domain={[60, 200]} 
                      stroke="#94a3b8" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }} 
                      tickLine={false} 
                      axisLine={false} 
                    />
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="maxHr" name="Max HR" stroke="#f43f5e" fillOpacity={1} fill="url(#colorMaxHr)" strokeWidth={2} />
                    <Area type="monotone" dataKey="avgHr" name="Avg HR" stroke="#10b981" fillOpacity={1} fill="url(#colorAvgHr)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-1 h-[600px] lg:h-auto">
             <SessionList sessions={sessions} onSelectSession={setSelectedSession} />
          </div>

        </div>
      </main>

      {/* Modals */}
      <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        sessions={sessions}
        onResetData={handleResetData}
      />
      <ImportModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onImport={handleImport}
        currentMaxId={maxId}
      />
    </div>
  );
};

export default App;