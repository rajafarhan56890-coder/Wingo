export type GamePlatform = '92PKR' | '92JEETO' | '92R' | 'BJ_GAME' | 'DAMAN' | 'TIRANGA' | '1KBET';
export type TimeMode = '30s' | '1m' | '3m' | '5m';

export interface PlatformConfig {
  id: GamePlatform;
  name: string;
  code: string;
  color: string;
  badge: string;
  description: string;
}

export interface PredictionResult {
  id: string;
  gamePlatform: GamePlatform;
  timeMode: TimeMode;
  periodNumber: string;
  sizeResult: 'BIG' | 'SMALL';
  colorResult: 'GREEN' | 'RED' | 'VIOLET' | 'GREEN+VIOLET' | 'RED+VIOLET';
  predictedNumber: number;
  luckyNumbers: number[];
  confidence: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  patternType: string;
  aiReasoning: string;
  timestamp: string;
  verifiedStatus?: 'WIN' | 'LOSS' | 'PENDING';
}

export interface HistoryItem {
  periodNumber: string;
  number: number;
  size: 'BIG' | 'SMALL';
  color: 'GREEN' | 'RED' | 'VIOLET';
  timestamp: string;
  predictionMatch?: 'WIN' | 'LOSS' | 'PENDING';
}

export interface StatsData {
  totalPredictions: number;
  accuracyRate: number;
  winStreak: number;
  bigCount: number;
  smallCount: number;
  redCount: number;
  greenCount: number;
  violetCount: number;
}
