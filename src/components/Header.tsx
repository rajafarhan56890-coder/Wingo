import React from 'react';
import { GamePlatform } from '../types';
import { PLATFORMS } from '../data/platforms';
import { Bot, Volume2, VolumeX, HelpCircle, Smartphone, Activity } from 'lucide-react';

interface HeaderProps {
  selectedPlatform: GamePlatform;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenGuide: () => void;
  onOpenAndroidExport: () => void;
  accuracyRate: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedPlatform,
  soundEnabled,
  setSoundEnabled,
  onOpenGuide,
  onOpenAndroidExport,
  accuracyRate,
}) => {
  const currentPlatformInfo = PLATFORMS.find((p) => p.id === selectedPlatform) || PLATFORMS[0];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Bot className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white tracking-wide">
                WINGO <span className="text-emerald-400 font-black">AI BOT</span>
              </h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                v9.8 ULTRA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected: <span className="text-slate-200 font-semibold">{currentPlatformInfo.name}</span>
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Accuracy pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 border border-slate-700/60 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Win Rate:</span>
            <span className="text-emerald-400 font-bold">{accuracyRate.toFixed(1)}%</span>
          </div>

          {/* Guide Button */}
          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
            title="Urdu Guide"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Urdu Guide</span>
          </button>

          {/* Android Export */}
          <button
            onClick={onOpenAndroidExport}
            className="flex items-center gap-1.5 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs font-semibold transition"
          >
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Android Code</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl transition"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
