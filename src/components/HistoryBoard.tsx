import React from 'react';
import { GamePlatform, HistoryItem, PredictionResult } from '../types';
import { PLATFORMS } from '../data/platforms';
import { History, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface HistoryBoardProps {
  platform: GamePlatform;
  history: HistoryItem[];
  predictionsMap: Record<string, PredictionResult>;
  currentPeriodNumber: string;
  isLoading: boolean;
}

export const HistoryBoard: React.FC<HistoryBoardProps> = ({
  platform,
  history,
  predictionsMap,
  currentPeriodNumber,
  isLoading,
}) => {
  const platformInfo = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl mb-6">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-slate-800 rounded-xl text-emerald-400">
            <History className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm text-white">Recent Draw History & AI Verifications</h3>
        </div>
        <span className="text-[11px] font-semibold text-slate-400">
          Showing last {history.length} draws
        </span>
      </div>

      {isLoading ? (
        <div className="py-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin" />
          <span>Fetching platform draw feed...</span>
        </div>
      ) : history.length === 0 ? (
        <div className="py-8 text-center text-slate-500 text-xs">
          No draw history available for {platformInfo.name}.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                <th className="py-2.5 px-3">Period</th>
                <th className="py-2.5 px-3 text-center">Number</th>
                <th className="py-2.5 px-3 text-center">Size</th>
                <th className="py-2.5 px-3 text-center">Color</th>
                <th className="py-2.5 px-3 text-right">AI Match</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-mono">
              {history.map((item) => {
                // Find matching prediction if present in saved predictions map
                const matchingPredKey = Object.keys(predictionsMap).find((k) =>
                  k.endsWith(`_${item.periodNumber}`)
                );
                const matchingPred = matchingPredKey ? predictionsMap[matchingPredKey] : null;

                let isWin = false;
                if (matchingPred) {
                  const sizeMatch = matchingPred.sizeResult === item.size;
                  const predColors = matchingPred.colorResult.split('+');
                  const actualColors = item.color.split('+');
                  const colorMatch = predColors.some((c) => actualColors.includes(c));
                  const numberMatch = matchingPred.predictedNumber === item.number;
                  isWin = sizeMatch || colorMatch || numberMatch;
                }

                return (
                  <tr key={item.periodNumber} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-semibold text-slate-300">
                      #{item.periodNumber}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-block w-7 h-7 rounded-full bg-slate-950 border border-slate-700 font-bold leading-7 text-emerald-400">
                        {item.number}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-bold">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                          item.size === 'BIG'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                            : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        }`}
                      >
                        {item.size}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold ${
                          item.color.includes('GREEN')
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : item.color.includes('RED')
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                        }`}
                      >
                        {item.color}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {matchingPred ? (
                        isWin ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3" /> WIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-lg text-[10px] font-bold">
                            <XCircle className="w-3 h-3" /> LOSS
                          </span>
                        )
                      ) : (
                        <span className="text-slate-600 text-[10px] font-medium italic">
                          Not predicted
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
