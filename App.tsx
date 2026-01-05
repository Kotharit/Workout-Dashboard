import React, { useState, useMemo, useEffect } from 'react';
import { WorkoutSession } from './types';
import { KPIGrid } from './components/KPIGrid';
import { SessionList } from './components/SessionList';
import { SessionModal } from './components/SessionModal';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area
} from 'recharts';
import { Dumbbell, LayoutDashboard, Settings } from 'lucide-react';
import * as XLSX from 'xlsx';

const App: React.FC = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<WorkoutSession | null>(null);

  // 🔹 Load XLSX data once
  useEffect(() => {
    const loadXlsx = async () => {
      const res = await fetch('/data/workouts.xlsx');
      const buffer = await res.arrayBuffer();

      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rawData = XLSX.utils.sheet_to_json<any>(sheet);

      // 🔹 Map XLSX rows → WorkoutSession type
      const mapped: WorkoutSession[] = rawData.map(row => ({
        date: row.date,
        startTime: row.start_time,
        durationMin: Number(row.duration_min),
        calories: Number(row.calories),
        avgHr: Number(row.avg_hr),
        maxHr: Number(row.max_hr),
        intensityScore: Number(row.intensity_score || 0),
        notes: row.notes || '',
        zones: row.zones || []
      }));

      setSessions(mapped);
    };

    loadXlsx();
  }, []);

  // 🔹 Prepare data for charts
  const chartData = useMemo(() => {
    return [...sessions]
      .sort((a, b) => {
        const [d1, m1, y1] = a.date.split('-').map(Number);
        const [d2, m2, y2] = b.date.split('-').map(Number);
        return new Date(y1, m1 - 1, d1).getTime() - new Date(y2, m2 - 1, d2).getTime();
      })
      .map(s => ({
        name: s.date.slice(0, 5),
        fullDate: s.date,
        calories: s.calories,
        duration: s.durationMin,
        avgHr: s.avgHr,
        maxHr: s.maxHr,
        intensity: s.intensityScore || 0
      }));
  }, [sessions]);

  const handleSettingsClick = () => {
    alert('Settings panel is under construction.');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans selection:bg-blue-500/30">

      {/* Top Bar */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Dumbbell className="text-white" size={20} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">PulseTrack</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="text-slate-400 hover:text-white">
                <LayoutDashboard size={20} />
              </button>
              <button onClick={handleSettingsClick} className="text-slate-400 hover:text-white">
                <Settings size={20} />
              </button>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-slate-800"></div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-slate-400">Welcome back. You've been consistent this week!</p>
        </div>

        {/* KPIs */}
        <KPIGrid sessions={sessions} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">

            {/* Intensity & Calories */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Intensity & Calories</h3>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis yAxisId="left" stroke="#94a3b8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
                    <RechartsTooltip />
                    <Bar yAxisId="left" dataKey="calories" fill="#f97316" />
                    <Bar yAxisId="right" dataKey="intensity" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* HR Trends */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Heart Rate Trends</h3>
              <div className="h-72">
                <ResponsiveContainer>
                  <AreaChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                    <XAxis dataKey="name" stroke="#94a3b8" />
                    <YAxis domain={[60, 200]} stroke="#94a3b8" />
                    <RechartsTooltip />
                    <Area dataKey="maxHr" stroke="#f43f5e" fillOpacity={0.3} />
                    <Area dataKey="avgHr" stroke="#10b981" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Session List */}
          <div>
            <SessionList sessions={sessions} onSelectSession={setSelectedSession} />
          </div>
        </div>
      </main>

      <SessionModal session={selectedSession} onClose={() => setSelectedSession(null)} />
    </div>
  );
};

export default App;
