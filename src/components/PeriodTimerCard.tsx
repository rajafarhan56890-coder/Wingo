import React from 'react';
import { GamePlatform, TimeMode } from '../types';
import { PLATFORMS } from '../data/platforms';
import { Clock, RefreshCw, Hash, AlertCircle, Sparkles } from 'lucide-react';

interface PeriodTimerCardProps {
  platform: GamePlatform;
  timeMode: TimeMode;
  setTimeMode: (mode: TimeMode) => void;
  periodNumber: string;
  secondsRemaining: number;
  intervalSeconds: number;
  customPeriod: string;
  setCustomPeriod: (val: string) => void;
  onRefreshPeriod: () => void;
}

const TIME_MODES: { mode: TimeMode; label: string }[] = [
  { mode: '30s', label: '30 sec' },
  { mode: '1m', label: '1 Min' },
  { mode: '3m', label: '3 Min' },
  { mode: '5m', label: '5 Min' },
];

export const PeriodTimerCard: React.FC<PeriodTimerCardProps> = ({
  platform,
  timeMode,
  setTimeMode,
  periodNumber,
  secondsRemaining,
  intervalSeconds,
  customPeriod,
  setCustomPeriod,
  onRefreshPeriod,
}) => {
  const platformInfo = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0];

  const formatTime = (secs: number) => {
    const safe = typeof secs === 'number' && !isNaN(secs) && secs >= 0 ? secs : 0;
    const mins = Math.floor(safe / 60);
    const rem = Math.floor(safe % 60);
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const safeSecs = typeof secondsRemaining === 'number' && !isNaN(secondsRemaining) ? secondsRemaining : 0;
  const safeInterval = typeof intervalSeconds === 'number' && !isNaN(intervalSeconds) && intervalSeconds > 0 ? intervalSeconds : 60;
  const rawProgress = ((safeInterval - safeSecs) / safeInterval) * 100;
  const timerProgress = isNaN(rawProgress) ? 0 : Math.max(0, Math.min(100, rawProgress));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl mb-6 relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400">
            <Clock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">{platformInfo.name} Live Clock</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                PST (UTC+5) Synced
              </span>
            </div>
            <p className="text-xs text-slate-400">Realtime Wingo period generator & hash synchronizer</p>
          </div>
        </div>

        {/* Time Mode Selectors */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          {TIME_MODES.map(({ mode, label }) => (
            <button
              key={mode}
              onClick={() => setTimeMode(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                timeMode === mode
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Active Period Display */}
        <div className="lg:col-span-7 bg-slate-950/80 border border-slate-800/90 p-4 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-emerald-400" /> Current Platform Period #
            </span>
            <button
              onClick={onRefreshPeriod}
              className="text-slate-400 hover:text-emerald-400 text-xs flex items-center gap-1 transition"
              title="Force Sync Period"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <div className="font-mono text-2xl sm:text-3xl font-black tracking-wider text-emerald-400 bg-emerald-950/30 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl">
              {customPeriod || periodNumber || 'Loading...'}
            </div>
          </div>

          {/* Custom Period Input */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <input
              type="text"
              value={customPeriod}
              onChange={(e) => setCustomPeriod(e.target.value.trim())}
              placeholder="Override/Enter custom period (Optional)..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500/50"
            />
            {customPeriod && (
              <button
                onClick={() => setCustomPeriod('')}
                className="text-[11px] text-rose-400 hover:underline px-2 shrink-0 font-medium"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Live Timer Gauge */}
        <div className="lg:col-span-5 bg-slate-950/80 border border-slate-800/90 p-4 rounded-2xl flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Time Remaining</span>
            <span className={`text-xs font-bold ${secondsRemaining <= 10 ? 'text-rose-400 animate-pulse' : 'text-slate-300'}`}>
              {secondsRemaining <= 10 ? 'Drawing Soon!' : 'Accepting AI Analysis'}
            </span>
          </div>

          <div className="flex items-center justify-between my-1">
            <div className="text-3xl font-black font-mono tracking-widest text-white">
              {formatTime(secondsRemaining)}
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">Cycle Progress</span>
              <span className="text-xs font-bold text-emerald-400">{Math.round(timerProgress)}%</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden mt-2 p-0.5 border border-slate-800">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                secondsRemaining <= 10
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500'
                  : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              }`}
              style={{ width: `${timerProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
