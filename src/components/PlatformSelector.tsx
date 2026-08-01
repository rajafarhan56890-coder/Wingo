import React from 'react';
import { GamePlatform } from '../types';
import { PLATFORMS } from '../data/platforms';
import { Check, ShieldCheck } from 'lucide-react';

interface PlatformSelectorProps {
  selectedPlatform: GamePlatform;
  onSelectPlatform: (platform: GamePlatform) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
  selectedPlatform,
  onSelectPlatform,
}) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Select Wingo Platform
        </h2>
        <span className="text-[11px] text-slate-500 font-medium">
          7 Server Connectors Active
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          return (
            <button
              key={platform.id}
              onClick={() => onSelectPlatform(platform.id)}
              className={`relative p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between min-h-[90px] ${
                isSelected
                  ? `bg-slate-900 border-emerald-500 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/50`
                  : `bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90 text-slate-400`
              }`}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
              )}

              <div>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase mb-1.5 ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}>
                  {platform.badge}
                </span>
                <h3 className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {platform.name}
                </h3>
              </div>

              <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                {platform.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
