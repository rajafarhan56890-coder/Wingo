import { useState, useEffect, useCallback, useMemo } from 'react';
import { GamePlatform, TimeMode, PredictionResult, HistoryItem } from './types';
import { Header } from './components/Header';
import { PlatformSelector } from './components/PlatformSelector';
import { PeriodTimerCard } from './components/PeriodTimerCard';
import { PredictorCard } from './components/PredictorCard';
import { HistoryBoard } from './components/HistoryBoard';
import { StatsDashboard } from './components/StatsDashboard';
import { UrduGuideModal } from './components/UrduGuideModal';
import { AndroidExporterModal } from './components/AndroidExporterModal';
import { calculateDynamicStats } from './utils/wingo';
import { Cpu, Smartphone } from 'lucide-react';

export default function App() {
  const [selectedPlatform, setSelectedPlatform] = useState<GamePlatform>('92PKR');
  const [timeMode, setTimeMode] = useState<TimeMode>('1m');

  const [periodNumber, setPeriodNumber] = useState<string>('');
  const [customPeriod, setCustomPeriod] = useState<string>('');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(60);

  const [savedPredictionsMap, setSavedPredictionsMap] = useState<Record<string, PredictionResult>>(() => {
    try {
      const stored = localStorage.getItem('wingo_saved_predictions');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(true);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [guideOpen, setGuideOpen] = useState<boolean>(false);
  const [androidModalOpen, setAndroidModalOpen] = useState<boolean>(false);

  const activeTargetPeriod = customPeriod || periodNumber;
  const currentPeriodKey = `${selectedPlatform}_${timeMode}_${activeTargetPeriod}`;
  const activePrediction = savedPredictionsMap[currentPeriodKey] || null;
  const isPeriodLocked = Boolean(activePrediction);

  const stats = useMemo(() => {
    return calculateDynamicStats(savedPredictionsMap, periodNumber);
  }, [savedPredictionsMap, periodNumber]);

  // Fetch Period Info from backend
  const fetchPeriodInfo = useCallback(async () => {
    try {
      const res = await fetch(`/api/period-info?platform=${selectedPlatform}&timeMode=${timeMode}`);
      if (res.ok) {
        const data = await res.json();
        if (data.periodNumber) {
          setPeriodNumber(String(data.periodNumber));
        }
        const remSec = Number(data.remainingSeconds);
        const intSec = Number(data.intervalSeconds);
        setSecondsRemaining(!isNaN(remSec) && remSec >= 0 ? remSec : 60);
        setIntervalSeconds(!isNaN(intSec) && intSec > 0 ? intSec : 60);
      }
    } catch (err) {
      console.error('Error fetching period info:', err);
    }
  }, [selectedPlatform, timeMode]);

  // Fetch Draw History from backend
  const fetchHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const res = await fetch(`/api/history?platform=${selectedPlatform}&timeMode=${timeMode}&limit=12`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [selectedPlatform, timeMode]);

  const handlePlatformChange = (p: GamePlatform) => {
    setSelectedPlatform(p);
    setCustomPeriod('');
  };

  const handleTimeModeChange = (mode: TimeMode) => {
    setTimeMode(mode);
    setCustomPeriod('');
  };

  // Initial Load & Intervals
  useEffect(() => {
    fetchPeriodInfo();
    fetchHistory();
  }, [selectedPlatform, timeMode, fetchPeriodInfo, fetchHistory]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (typeof prev !== 'number' || isNaN(prev)) {
          return 60;
        }
        if (prev <= 1) {
          fetchPeriodInfo();
          fetchHistory();
          return intervalSeconds || 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalSeconds, fetchPeriodInfo, fetchHistory]);

  // Generate AI Prediction
  const handleGeneratePrediction = async () => {
    if (isPeriodLocked) return;
    setIsPredicting(true);
    try {
      const targetPeriod = customPeriod || periodNumber;
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform,
          timeMode: timeMode,
          periodNumber: targetPeriod,
        }),
      });

      if (res.ok) {
        const data: PredictionResult = await res.json();
        
        // Save prediction in store for period lock
        const key = `${selectedPlatform}_${timeMode}_${targetPeriod}`;
        setSavedPredictionsMap((prev) => {
          const updated = { ...prev, [key]: data };
          try {
            localStorage.setItem('wingo_saved_predictions', JSON.stringify(updated));
          } catch (e) {
            console.warn('localStorage write error:', e);
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Prediction request error:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 pb-12">
      {/* Navbar */}
      <Header
        selectedPlatform={selectedPlatform}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onOpenGuide={() => setGuideOpen(true)}
        onOpenAndroidExport={() => setAndroidModalOpen(true)}
        accuracyRate={stats.accuracyRate}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Banner Alert */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-cyan-950/80 border border-emerald-500/30 p-3.5 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-slate-200 font-medium">
              <strong className="text-emerald-400">AI Bot V9.8 Active:</strong> Matching period seed sequence with <strong>92PKR, 92Jeeto, 92R & BJ Game</strong> servers.
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setAndroidModalOpen(true)}
              className="text-cyan-400 hover:underline text-[11px] font-bold flex items-center gap-1 bg-cyan-950/60 border border-cyan-500/30 px-2.5 py-1 rounded-lg"
            >
              <Smartphone className="w-3.5 h-3.5" /> Android Studio Code
            </button>
            <button
              onClick={() => setGuideOpen(true)}
              className="text-emerald-400 hover:underline text-[11px] font-bold flex items-center gap-1"
            >
              How to match period? (Urdu Guide)
            </button>
          </div>
        </div>

        {/* Platform Selector */}
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onSelectPlatform={handlePlatformChange}
        />

        {/* Live Period Timer Card */}
        <PeriodTimerCard
          platform={selectedPlatform}
          timeMode={timeMode}
          setTimeMode={handleTimeModeChange}
          periodNumber={periodNumber}
          secondsRemaining={secondsRemaining}
          intervalSeconds={intervalSeconds}
          customPeriod={customPeriod}
          setCustomPeriod={setCustomPeriod}
          onRefreshPeriod={fetchPeriodInfo}
        />

        {/* Stats Bar */}
        <StatsDashboard stats={stats} />

        {/* AI Predictor Core Card */}
        <PredictorCard
          platform={selectedPlatform}
          timeMode={timeMode}
          periodNumber={activeTargetPeriod}
          prediction={activePrediction}
          onGeneratePrediction={handleGeneratePrediction}
          isPredicting={isPredicting}
          isPeriodLocked={isPeriodLocked}
          secondsRemaining={secondsRemaining}
          soundEnabled={soundEnabled}
        />

        {/* Draw History */}
        <HistoryBoard
          platform={selectedPlatform}
          history={history}
          predictionsMap={savedPredictionsMap}
          currentPeriodNumber={periodNumber}
          isLoading={isLoadingHistory}
        />

        {/* Footer info */}
        <footer className="text-center text-xs text-slate-500 pt-6 border-t border-slate-800/80">
          <p className="flex items-center justify-center gap-1.5 font-medium text-slate-400">
            <Cpu className="w-4 h-4 text-emerald-400" />
            Wingo AI Hack Bot & Period Matcher • Supporting 92PKR, 92Jeeto, 92R, BJ Game, Daman
          </p>
          <p className="text-[10px] text-slate-600 mt-1">
            Powered by Server-Side Gemini AI Pattern Analysis & Real-time Period Hashing Engine.
          </p>
        </footer>
      </main>

      {/* Guide Modal */}
      <UrduGuideModal isOpen={guideOpen} onClose={() => setGuideOpen(false)} />

      {/* Android Studio Project Code Modal */}
      <AndroidExporterModal isOpen={androidModalOpen} onClose={() => setAndroidModalOpen(false)} />
    </div>
  );
}
