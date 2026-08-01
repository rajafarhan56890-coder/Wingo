import { PredictionResult, HistoryItem } from '../types';

// Deterministic seed result for period
export function getSeedResult(periodStr: string) {
  let hash = 0;
  for (let i = 0; i < periodStr.length; i++) {
    hash = (hash << 5) - hash + periodStr.charCodeAt(i);
    hash |= 0;
  }
  const num = Math.abs(hash) % 10;
  const size: 'BIG' | 'SMALL' = num >= 5 ? 'BIG' : 'SMALL';
  
  let color: 'GREEN' | 'RED' | 'VIOLET' | 'GREEN+VIOLET' | 'RED+VIOLET' = 'RED';
  if ([1, 3, 7, 9].includes(num)) {
    color = 'GREEN';
  } else if ([2, 4, 6, 8].includes(num)) {
    color = 'RED';
  } else if (num === 0) {
    color = 'RED+VIOLET';
  } else if (num === 5) {
    color = 'GREEN+VIOLET';
  }

  return { number: num, size, color };
}

// Evaluate prediction vs actual result
export function evaluatePredictionResult(
  prediction: { sizeResult: string; colorResult: string; predictedNumber: number },
  actual: { size: string; color: string; number: number }
): 'WIN' | 'LOSS' {
  const sizeMatch = prediction.sizeResult === actual.size;
  
  const predColors = prediction.colorResult.split('+');
  const actualColors = actual.color.split('+');
  const colorMatch = predColors.some((c) => actualColors.includes(c));
  
  const numberMatch = prediction.predictedNumber === actual.number;

  // WIN if size matches OR color matches OR exact number matches
  if (sizeMatch || colorMatch || numberMatch) {
    return 'WIN';
  }
  return 'LOSS';
}

// Calculate dynamic stats from saved predictions and current period
export function calculateDynamicStats(
  savedPredictionsMap: Record<string, PredictionResult>,
  currentPeriodNumber: string
) {
  const allPredictions = Object.values(savedPredictionsMap);
  const totalPredictions = allPredictions.length;
  let completedWins = 0;
  let completedTotal = 0;
  
  let winStreak = 0;
  let countingStreak = true;

  let bigCount = 0;
  let smallCount = 0;
  let redCount = 0;
  let greenCount = 0;
  let violetCount = 0;

  // Sort predictions by period number descending (newest first)
  const sorted = [...allPredictions].sort((a, b) => b.periodNumber.localeCompare(a.periodNumber));

  for (const pred of sorted) {
    if (pred.sizeResult === 'BIG') bigCount++;
    if (pred.sizeResult === 'SMALL') smallCount++;
    if (pred.colorResult.includes('RED')) redCount++;
    if (pred.colorResult.includes('GREEN')) greenCount++;
    if (pred.colorResult.includes('VIOLET')) violetCount++;

    // Check if period is completed (periodNumber is strictly less than current active period)
    if (pred.periodNumber < currentPeriodNumber) {
      completedTotal++;
      const actual = getSeedResult(pred.periodNumber);
      const result = evaluatePredictionResult(pred, actual);
      
      if (result === 'WIN') {
        completedWins++;
        if (countingStreak) {
          winStreak++;
        }
      } else {
        if (countingStreak) {
          countingStreak = false;
        }
      }
    }
  }

  const accuracyRate = completedTotal > 0 ? (completedWins / completedTotal) * 100 : 100;

  return {
    totalPredictions,
    accuracyRate,
    winStreak,
    bigCount,
    smallCount,
    redCount,
    greenCount,
    violetCount,
    completedTotal,
    completedWins,
  };
}
