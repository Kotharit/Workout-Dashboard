import React, { useState } from 'react';
import { X, Bell, Moon, User, Copy, RefreshCw, Check, Trash2 } from 'lucide-react';
import { WorkoutSession } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: WorkoutSession[];
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, sessions, onResetData }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyData = () => {
    // Format data to match RAW_WORKOUT_DATA in constants.ts (remove intensityScore)
    const dataForExport = sessions.map(({ intensityScore, ...rest }) => rest);
    const jsonString = JSON.stringify(dataForExport, null, 2);
    
    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-700 bg-slate-900/50">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Profile Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Account</h3>
            <div className="flex items-center gap-4 bg-slate-700/30 p-3 rounded-xl border border-slate-700/50">
              <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 border-2 border-slate-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                US
              </div>
              <div>
                <p className="text-white font-medium">User</p>
                <p className="text-sm text-slate-400">Pro Member</p>
              </div>
              <button className="ml-auto text-sm text-blue-400 hover:text-blue-300 font-medium">Edit</button>
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferences</h3>
            
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg text-blue-400"><Bell size={18} /></div>
                <span className="text-slate-200 font-medium">Notifications</span>
              </div>
              <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer border border-blue-500 shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-700 rounded-lg text-purple-400"><Moon size={18} /></div>
                <span className="text-slate-200 font-medium">Dark Mode</span>
              </div>
              <div className="w-11 h-6 bg-blue-600 rounded-full relative cursor-pointer border border-blue-500 shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="space-y-4 pt-4 border-t border-slate-700">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Data Management</h3>
            
            <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 space-y-3">
               <p className="text-sm text-slate-400">
                 Copy your current data (including imported entries) to paste into <code className="text-orange-400">constants.ts</code>.
               </p>
               <button 
                 onClick={handleCopyData}
                 className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-medium transition-colors border border-slate-600"
               >
                 {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                 {copied ? 'Copied to Clipboard!' : 'Copy JSON for Code'}
               </button>
            </div>

            <button 
              onClick={onResetData}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-sm"
            >
              <Trash2 size={16} /> Reset to Default Data
            </button>
          </div>
          
          <div className="pt-2">
            <button 
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
                Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};