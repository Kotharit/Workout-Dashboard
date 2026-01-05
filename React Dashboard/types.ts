import React from 'react';

export interface Zone {
  zone: string;
  bpm?: string;
  duration_sec?: number; // Optional as prompt data varied in precision
  percent: number;
}

export interface WorkoutSession {
  id: number;
  date: string; // DD-MM-YYYY
  startTime: string;
  durationMin: number;
  calories: number;
  avgHr: number;
  maxHr: number;
  zones: Zone[];
  intensityScore?: number; // Calculated field
}

export interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}