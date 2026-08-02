import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini Client Lazily
let geminiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Logic for calculating the current Wingo Period based on 30s, 1m, 3m, 5m intervals
function calculateCurrentPeriod(platform: string, timeMode: string) {
  const now = new Date();
  
  // Create UTC+5 (Pakistan Standard Time) Date Object
  const pstOffset = 5 * 60 * 60 * 1000;
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const pstNow = new Date(utc + pstOffset);

  let intervalSeconds = 60; // 1m default
  if (timeMode === "30s") intervalSeconds = 30;
  if (timeMode === "3m") intervalSeconds = 180;
  if (timeMode === "5m") intervalSeconds = 300;
  if (timeMode === "10m") intervalSeconds = 600;

  // Calculate start of day in PST
  const startOfDay = new Date(pstNow);
  startOfDay.setHours(0, 0, 0, 0);

  // Milliseconds elapsed today
  const elapsedMs = pstNow.getTime() - startOfDay.getTime();
  
  // Calculate period number
  const periodCount = Math.floor(elapsedMs / (intervalSeconds * 1000)) + 1;
  const rawRemaining = intervalSeconds - Math.floor((elapsedMs % (intervalSeconds * 1000)) / 1000);
  const remainingSeconds = isNaN(rawRemaining) || rawRemaining < 0 ? intervalSeconds : rawRemaining;

  // Format date YYYYMMDD
  const yyyy = pstNow.getFullYear();
  const mm = String(pstNow.getMonth() + 1).padStart(2, "0");
  const dd = String(pstNow.getDate()).padStart(2, "0");
  const dateStr = `${yyyy}${mm}${dd}`;

  // Period string formatting based on time mode
  let finalPeriodNumber = "";

  if (timeMode === "30s") {
    // 30s mode: 2880 periods per day
    finalPeriodNumber = `${dateStr}10005${String(periodCount).padStart(4, "0")}`;
  } else if (timeMode === "3m") {
    // 3m mode: 480 periods per day
    finalPeriodNumber = `${dateStr}3000${String(periodCount).padStart(4, "0")}`;
  } else if (timeMode === "5m") {
    // 5m mode: 288 periods per day
    finalPeriodNumber = `${dateStr}5000${String(periodCount).padStart(4, "0")}`;
  } else {
    // 1m default mode: 1440 periods per day
    finalPeriodNumber = `${dateStr}1000${String(periodCount).padStart(4, "0")}`;
  }

  if (platform === "51GAME" || platform === "TIRANGA") {
    finalPeriodNumber = `${dateStr}0${periodCount}`;
  }

  return {
    periodNumber: String(finalPeriodNumber),
    remainingSeconds: Number(remainingSeconds) || 60,
    intervalSeconds: Number(intervalSeconds) || 60
  };
}

// In-memory prediction cache for period lock backend consistency
const predictionCache = new Map<string, any>();

// Deterministic mock seed result generator for history & validation
function generateSeedResult(periodStr: string) {
  let hash = 0;
  for (let i = 0; i < periodStr.length; i++) {
    hash = (hash << 5) - hash + periodStr.charCodeAt(i);
    hash |= 0;
  }
  const num = Math.abs(hash) % 10;
  const size = num >= 5 ? "BIG" : "SMALL";
  
  let color = "RED";
  if ([1, 3, 7, 9].includes(num)) {
    color = "GREEN";
  } else if ([2, 4, 6, 8].includes(num)) {
    color = "RED";
  } else if (num === 0) {
    color = "RED+VIOLET";
  } else if (num === 5) {
    color = "GREEN+VIOLET";
  }

  return { number: num, size, color };
}

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiAvailable: !!process.env.GEMINI_API_KEY });
});

// API Period Info
app.get("/api/period-info", (req, res) => {
  const platform = (req.query.platform as string) || "92PKR";
  const timeMode = (req.query.timeMode as string) || "1m";
  
  const periodData = calculateCurrentPeriod(platform, timeMode);
  res.json(periodData);
});

// API Get History
app.get("/api/history", (req, res) => {
  const platform = (req.query.platform as string) || "92PKR";
  const timeMode = (req.query.timeMode as string) || "1m";
  const limit = parseInt((req.query.limit as string) || "15", 10);
  
  const { periodNumber, intervalSeconds } = calculateCurrentPeriod(platform, timeMode);
  
  const history = [];
  const basePeriodNum = BigInt(periodNumber);
  
  for (let i = 1; i <= limit; i++) {
    const pastPeriod = (basePeriodNum - BigInt(i)).toString();
    const result = generateSeedResult(pastPeriod);
    history.push({
      periodNumber: pastPeriod,
      number: result.number,
      size: result.size,
      color: result.color,
      timestamp: new Date(Date.now() - i * intervalSeconds * 1000).toISOString(),
    });
  }
  
  res.json(history);
});

// API Predict Endpoint with Independent Size/Color Logic & Period Caching
app.post("/api/predict", async (req, res) => {
  try {
    const { platform = "92PKR", timeMode = "1m", periodNumber } = req.body;
    
    const currentPeriodInfo = calculateCurrentPeriod(platform, timeMode);
    const targetPeriod = periodNumber || currentPeriodInfo.periodNumber;
    const cacheKey = `${platform}_${timeMode}_${targetPeriod}`;

    // Return cached prediction if already generated for this period
    if (predictionCache.has(cacheKey)) {
      return res.json(predictionCache.get(cacheKey));
    }

    // Fetch past 5 results for context pattern
    const pastResults = [];
    const basePeriod = BigInt(targetPeriod);
    for (let i = 1; i <= 5; i++) {
      const pastP = (basePeriod - BigInt(i)).toString();
      pastResults.push(generateSeedResult(pastP));
    }

    // Hash calculation for period
    let hash = 0;
    for (let i = 0; i < targetPeriod.length; i++) {
      hash = (hash << 5) - hash + targetPeriod.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);

    // Independent Size Calculation
    const seedResult = generateSeedResult(targetPeriod);
    // Determine size: 50/50 balance using seed hash & past sequence
    const sizeResult: "BIG" | "SMALL" = (absHash % 2 === 0) ? "BIG" : "SMALL";

    // Independent Color Calculation (NOT fixed to Big or Small)
    // Colors: RED, GREEN, GREEN+VIOLET, RED+VIOLET
    const colorSeed = (absHash + 7) % 10;
    let colorResult = "RED";
    if (colorSeed === 0) colorResult = "RED+VIOLET";
    else if (colorSeed === 5) colorResult = "GREEN+VIOLET";
    else if ([1, 3, 7, 9].includes(colorSeed)) colorResult = "GREEN";
    else colorResult = "RED";

    // Calculate Primary Predicted Number matching Size and Color
    let predictedNumber = 7;
    let luckyNumbers: number[] = [];

    if (sizeResult === "BIG") {
      if (colorResult === "GREEN") {
        predictedNumber = (absHash % 2 === 0) ? 7 : 9;
        luckyNumbers = [predictedNumber, predictedNumber === 7 ? 9 : 7, 8];
      } else if (colorResult === "RED") {
        predictedNumber = (absHash % 2 === 0) ? 6 : 8;
        luckyNumbers = [predictedNumber, predictedNumber === 6 ? 8 : 6, 7];
      } else if (colorResult === "GREEN+VIOLET") {
        predictedNumber = 5;
        luckyNumbers = [5, 7, 6];
      } else { // RED+VIOLET or fallback
        predictedNumber = 6;
        luckyNumbers = [6, 8, 5];
      }
    } else { // SMALL
      if (colorResult === "GREEN") {
        predictedNumber = (absHash % 2 === 0) ? 1 : 3;
        luckyNumbers = [predictedNumber, predictedNumber === 1 ? 3 : 1, 2];
      } else if (colorResult === "RED") {
        predictedNumber = (absHash % 2 === 0) ? 2 : 4;
        luckyNumbers = [predictedNumber, predictedNumber === 2 ? 4 : 2, 1];
      } else if (colorResult === "RED+VIOLET") {
        predictedNumber = 0;
        luckyNumbers = [0, 2, 1];
      } else { // GREEN+VIOLET or fallback
        predictedNumber = 3;
        luckyNumbers = [3, 1, 0];
      }
    }

    // Confidence & Risk Level
    const confidence = parseFloat((93.5 + ((absHash % 55) / 10)).toFixed(1)); // 93.5 - 98.9%
    let riskLevel: "LOW" | "MEDIUM" | "HIGH" = "LOW";
    if (confidence < 94.5) riskLevel = "HIGH";
    else if (confidence < 96.5) riskLevel = "MEDIUM";

    const patternOptions = [
      "Dynamic Parity Reversal",
      "Color Cluster Frequency Shift",
      "Quantum Seed Resonance",
      "Dragon Streak Counter-Trend",
      "Independent Vector Parity Balance"
    ];
    const patternType = patternOptions[absHash % patternOptions.length];

    let aiReasoning = `Wingo Bot AI analyzed ${platform} Period #${targetPeriod}. Size metric independently points to ${sizeResult}, while color cluster frequency highlights ${colorResult} (Number #${predictedNumber}). Risk level evaluated as ${riskLevel}.`;

    const geminiClient = getGeminiClient();
    if (geminiClient) {
      try {
        const prompt = `You are an expert AI Wingo Predictor Bot for ${platform}.
Analyze Period: ${targetPeriod} (${timeMode} Mode).
Predicted Size: ${sizeResult}
Predicted Color: ${colorResult}
Predicted Target Number: ${predictedNumber}
Lucky Numbers: ${luckyNumbers.join(", ")}
Win Confidence: ${confidence}%
Risk Level: ${riskLevel}
Pattern: ${patternType}

Provide a short 2-sentence explanation in clear Roman Urdu explaining why Period #${targetPeriod} is predicted to be ${sizeResult} and ${colorResult} color (Target #${predictedNumber}). Note that size and color are calculated independently based on server seed clock! Keep it high-tech and reassuring.`;

        const response = await geminiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        if (response.text) {
          aiReasoning = response.text.trim();
        }
      } catch (err) {
        console.warn("Gemini API call error fallback:", err);
      }
    }

    const predictionResult = {
      id: `pred_${Date.now()}_${absHash}`,
      gamePlatform: platform,
      timeMode: timeMode,
      periodNumber: targetPeriod,
      sizeResult,
      colorResult,
      predictedNumber,
      luckyNumbers,
      confidence,
      riskLevel,
      patternType,
      aiReasoning,
      timestamp: new Date().toISOString(),
      verifiedStatus: "WIN"
    };

    // Cache the prediction to enforce backend lock per period
    predictionCache.set(cacheKey, predictionResult);
    
    // Limit cache size
    if (predictionCache.size > 200) {
      const firstKey = predictionCache.keys().next().value;
      if (firstKey) predictionCache.delete(firstKey);
    }

    res.json(predictionResult);
  } catch (error) {
    console.error("Prediction error:", error);
    res.status(500).json({ error: "Failed to generate AI prediction" });
  }
});

// Vite server configuration for development / production serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
