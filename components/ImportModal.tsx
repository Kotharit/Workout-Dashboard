import React, { useState } from 'react';
import { X, Upload, AlertCircle, Check } from 'lucide-react';
import { WorkoutSession } from '../types';
import { calculateIntensityScore } from '../constants';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (newSessions: WorkoutSession[]) => void;
  currentMaxId: number;
}

export const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, currentMaxId }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImport = () => {
    setError(null);
    try {
      if (!jsonInput.trim()) {
        setError('Please enter valid JSON data.');
        return;
      }

      const parsedData = JSON.parse(jsonInput);
      const dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
      
      let nextId = currentMaxId + 1;

      const newSessions: WorkoutSession[] = dataArray.map((item: any) => {
        // Basic validation of required fields
        if (!item.date || !item.durationMin || !item.zones) {
          throw new Error('Missing required fields (date, durationMin, zones)');
        }

        const session = {
          id: item.id || nextId++,
          date: item.date,
          startTime: item.startTime || '00:00',
          durationMin: Number(item.durationMin),
          calories: Number(item.calories || 0),
          avgHr: Number(item.avgHr || 0),
          maxHr: Number(item.maxHr || 0),
          zones: item.zones,
        };

        // Calculate intensity if not provided
        return {
          ...session,
          intensityScore: item.intensityScore || calculateIntensityScore(session)
        };
      });

      onImport(newSessions);
      setJsonInput('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid JSON format');
    }
  };

  const placeholder = `[
  {
    "date": "04-01-2026",
    "startTime": "18:30",
    "durationMin": 45,
    "calories": 310,
    "avgHr": 130,
    "maxHr": 160,
    "zones": [
      { "zone": "Warmup", "percent": 40 },
      { "zone": "Fat Burning", "percent": 50 },
      { "zone": "Endurance", "percent": 10 }
    ]
  }
]`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-slate-800 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <Upload className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-white">Import Workout Data</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          <p className="text-slate-400 text-sm mb-4">
            Paste your daily workout JSON below. New entries will be added to your dashboard instantly.
          </p>

          <div className="relative">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder={placeholder}
              className="w-full h-64 bg-slate-900 border border-slate-700 rounded-xl p-4 font-mono text-sm text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 custom-scrollbar resize-none"
              spellCheck={false}
            />
            <div className="absolute top-2 right-2 text-xs text-slate-600 bg-slate-800 px-2 py-1 rounded border border-slate-700">JSON</div>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
          
          <div className="mt-6 flex justify-end gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button 
                onClick={handleImport}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
                <Check size={18} /> Import Entries
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};