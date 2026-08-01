import React from 'react';
import { Award, Zap, Target, TrendingUp, BarChart2 } from 'lucide-react';

interface StatsDashboardProps {
  stats: {
    totalPredictions: number;
    accuracyRate: number;
    winStreak: number;
    bigCount: number;
    smallCount: number;
    redCount: number;
    greenCount: number;
    violetCount: number;
    completedTotal?: number;
    completedWins?: number;
  };
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
      {/* Accuracy Card */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Accuracy</span>
          <span className="text-lg font-black text-emerald-400">
            {stats.accuracyRate.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Win Streak Card */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Current Streak</span>
          <span className="text-lg font-black text-amber-400">
            {stats.winStreak} <span className="text-xs font-semibold text-slate-400">Wins</span>
          </span>
        </div>
      </div>

      {/* Total Predictions */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Generated</span>
          <span className="text-lg font-black text-slate-200">
            {stats.totalPredictions}
          </span>
        </div>
      </div>

      {/* Big vs Small Distribution */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Big / Small</span>
          <span className="text-xs font-extrabold text-slate-300">
            <span className="text-amber-400">{stats.bigCount}B</span> / <span className="text-cyan-400">{stats.smallCount}S</span>
          </span>
        </div>
      </div>

      {/* Color Distribution */}
      <div className="col-span-2 sm:col-span-4 lg:col-span-1 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
          <BarChart2 className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Colors Shift</span>
          <div className="flex items-center gap-1.5 text-xs font-bold mt-0.5">
            <span className="text-emerald-400">{stats.greenCount} G</span>
            <span className="text-slate-600">•</span>
            <span className="text-rose-400">{stats.redCount} R</span>
            <span className="text-slate-600">•</span>
            <span className="text-purple-400">{stats.violetCount} V</span>
          </div>
        </div>
      </div>
    </div>
  );
};
