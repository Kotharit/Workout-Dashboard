import { WorkoutSession } from './types';

// Helper function to calculate Intensity Score
export const calculateIntensityScore = (session: Omit<WorkoutSession, 'intensityScore'>): number => {
  const duration = session.durationMin;
  const hrRatio = session.maxHr ? (session.avgHr / session.maxHr) : 0;
  
  // Find percentages for key zones
  const endurance = session.zones.find(z => z.zone === 'Endurance')?.percent || 0;
  const anaerobic = session.zones.find(z => z.zone === 'Anaerobic')?.percent || 0;
  const threshold = session.zones.find(z => z.zone === 'Threshold')?.percent || 0;
  
  // Zone Multiplier: Higher weights for higher intensity zones
  // Base 1.0 + weighted contributions
  const zoneMultiplier = 1 + ((endurance * 1.5) + (anaerobic * 2.0) + (threshold * 3.0)) / 100;
  
  // Final Score = Duration * Intensity Ratio * Zone Multiplier
  const score = duration * hrRatio * zoneMultiplier;
  
  return Math.round(score);
};

const RAW_WORKOUT_DATA: Omit<WorkoutSession, 'intensityScore'>[] = [
  {
    id: 1,
    date: '27-12-2025',
    startTime: '05:34',
    durationMin: 31,
    calories: 155,
    avgHr: 113,
    maxHr: 157,
    zones: [
      { zone: 'Warmup', bpm: '103–126', percent: 57 },
      { zone: 'Fat Burning', bpm: '126–143', percent: 27 },
      { zone: 'Endurance', bpm: '143–161', percent: 16 },
      { zone: 'Anaerobic', bpm: '161–172', percent: 0 },
      { zone: 'Threshold', bpm: '≥172', percent: 0 },
    ]
  },
  {
    id: 2,
    date: '28-12-2025',
    startTime: '19:15',
    durationMin: 11,
    calories: 108,
    avgHr: 148,
    maxHr: 188,
    zones: [
      { zone: 'Warmup', percent: 23 },
      { zone: 'Fat Burning', percent: 22 },
      { zone: 'Endurance', percent: 20 },
      { zone: 'Anaerobic', percent: 3 },
      { zone: 'Threshold', percent: 32 },
    ]
  },
  {
    id: 3,
    date: '29-12-2025',
    startTime: '19:16',
    durationMin: 41,
    calories: 385,
    avgHr: 142,
    maxHr: 175,
    zones: [
      { zone: 'Warmup', percent: 17 },
      { zone: 'Fat Burning', percent: 30 },
      { zone: 'Endurance', percent: 41 },
      { zone: 'Anaerobic', percent: 11 },
      { zone: 'Threshold', percent: 1 },
    ]
  },
  {
    id: 4,
    date: '30-12-2025',
    startTime: '19:17',
    durationMin: 55,
    calories: 454,
    avgHr: 134,
    maxHr: 171,
    zones: [
      { zone: 'Warmup', percent: 28 },
      { zone: 'Fat Burning', percent: 47 },
      { zone: 'Endurance', percent: 18 },
      { zone: 'Anaerobic', percent: 7 },
      { zone: 'Threshold', percent: 0 },
    ]
  },
  {
    id: 5,
    date: '02-01-2026',
    startTime: '21:16',
    durationMin: 63,
    calories: 320,
    avgHr: 113,
    maxHr: 133,
    zones: [
      { zone: 'Warmup', percent: 95 },
      { zone: 'Fat Burning', percent: 5 },
      { zone: 'Endurance', percent: 0 },
      { zone: 'Anaerobic', percent: 0 },
      { zone: 'Threshold', percent: 0 },
    ]
  },
  {
    id: 6,
    date: '03-01-2026',
    startTime: '19:51',
    durationMin: 53,
    calories: 368,
    avgHr: 126,
    maxHr: 153,
    zones: [
      { zone: 'Warmup', bpm: '103-126', percent: 55 },
      { zone: 'Fat Burning', bpm: '126-143', percent: 39 },
      { zone: 'Endurance', bpm: '143-161', percent: 6 },
      { zone: 'Anaerobic', percent: 0 },
      { zone: 'Threshold', percent: 0 },
    ]
  }
];

// Calculate scores and export
export const WORKOUT_DATA: WorkoutSession[] = RAW_WORKOUT_DATA.map(session => ({
  ...session,
  intensityScore: calculateIntensityScore(session)
}));

export const COLORS = {
  primary: '#3b82f6', // blue-500
  secondary: '#8b5cf6', // violet-500
  accent: '#f43f5e', // rose-500
  success: '#10b981', // emerald-500
  warning: '#f59e0b', // amber-500
  background: '#1e293b', // slate-800
};

export const ZONE_COLORS: Record<string, string> = {
  'Warmup': '#94a3b8',      // Slate 400
  'Fat Burning': '#3b82f6', // Blue 500
  'Endurance': '#10b981',   // Emerald 500
  'Anaerobic': '#f59e0b',   // Amber 500
  'Threshold': '#ef4444',   // Red 500
};