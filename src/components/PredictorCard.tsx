import React, { useEffect } from 'react';
import { GamePlatform, TimeMode, PredictionResult } from '../types';
import { PLATFORMS } from '../data/platforms';
import confetti from 'canvas-confetti';
import { Bot, Lock, Sparkles, AlertTriangle, ShieldCheck, Zap, Lightbulb } from 'lucide-react';

interface PredictorCardProps {
  platform: GamePlatform;
  timeMode: TimeMode;
  periodNumber: string;
  prediction: PredictionResult | null;
  onGeneratePrediction: () => void;
  isPredicting: boolean;
  isPeriodLocked: boolean;
  secondsRemaining: number;
  soundEnabled: boolean;
}

export const PredictorCard: React.FC<PredictorCardProps> = ({
  platform,
  timeMode,
  periodNumber,
  prediction,
  onGeneratePrediction,
  isPredicting,
  isPeriodLocked,
  secondsRemaining,
  soundEnabled,
}) => {
  const platformInfo = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0];

  useEffect(() => {
    if (prediction && soundEnabled) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // ignore if canvas-confetti canvas not bound
      }
    }
  }, [prediction, soundEnabled]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl mb-6 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-white">AI Predictor Engine</h3>
            <p className="text-xs text-slate-400">
              Period <span className="text-emerald-400 font-bold font-mono">#{periodNumber || '---'}</span> ({platformInfo.name})
            </p>
          </div>
        </div>

        {/* Lock indicator */}
        {isPeriodLocked && (
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-xl text-xs font-bold">
            <Lock className="w-3.5 h-3.5" />
            <span>Period Prediction Locked</span>
          </div>
        )}
      </div>

      {/* Main Prediction Display or CTA */}
      {prediction ? (
        <div className="space-y-6">
          {/* Main Predict Badges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Size Prediction */}
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">
                Predicted Size Metric
              </span>
              <div
                className={`text-4xl font-black font-mono tracking-wider my-1 ${
                  prediction.sizeResult === 'BIG' ? 'text-amber-400' : 'text-cyan-400'
                }`}
              >
                {prediction.sizeResult}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                {prediction.sizeResult === 'BIG' ? 'Numbers 5, 6, 7, 8, 9' : 'Numbers 0, 1, 2, 3, 4'}
              </span>
            </div>

            {/* Color Prediction */}
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">
                Predicted Color Cluster
              </span>
              <div className="flex items-center gap-2 my-1">
                {prediction.colorResult.includes('GREEN') && (
                  <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xl font-black">
                    GREEN
                  </span>
                )}
                {prediction.colorResult.includes('RED') && (
                  <span className="px-3 py-1 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xl font-black">
                    RED
                  </span>
                )}
                {prediction.colorResult.includes('VIOLET') && (
                  <span className="px-3 py-1 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 text-xl font-black">
                    VIOLET
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-400 font-medium">Primary Seed Target</span>
            </div>

            {/* Target Number */}
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl flex flex-col items-center justify-center text-center">
              <span className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mb-1">
                Target Single Number
              </span>
              <div className="text-4xl font-black font-mono text-emerald-400 my-1">
                #{prediction.predictedNumber}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Lucky:</span>
                {prediction.luckyNumbers.map((num) => (
                  <span key={num} className="font-mono font-bold text-slate-200">
                    {num}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Reasoning Box */}
          <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Lightbulb className="w-4 h-4" /> AI Pattern Analysis & Roman Urdu Explanation
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                Confidence: <strong className="text-emerald-400">{prediction.confidence}%</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              "{prediction.aiReasoning}"
            </p>
          </div>

          {/* Pattern Details */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Pattern: <strong className="text-slate-200">{prediction.patternType}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Risk Assessment: <strong className="text-emerald-400">{prediction.riskLevel} RISK</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* Call to Action Generate */
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mb-4 text-emerald-400">
            <Sparkles className="w-8 h-8 animate-pulse" />
          </div>

          <h3 className="text-lg font-bold text-white mb-1">
            Ready to Analyze Period #{periodNumber || '---'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            Click below to generate high-precision server-seed prediction for {platformInfo.name} ({timeMode} mode). Size and color are calculated independently.
          </p>

          <button
            onClick={onGeneratePrediction}
            disabled={isPredicting || !periodNumber}
            className={`w-full max-w-md py-4 rounded-2xl font-black text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-xl ${
              isPredicting
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-slate-950 hover:brightness-110 active:scale-[0.99] shadow-emerald-500/20'
            }`}
          >
            {isPredicting ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin" />
                <span>Computing Seed Hash & Pattern...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 fill-slate-950" />
                <span>GENERATE AI PREDICTION NOW</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
