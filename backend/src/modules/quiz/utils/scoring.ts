export interface ScoreResult {
  basePoints: number;
  speedBonus: number;
  total: number;
}

const BASE_POINTS = 10;
const SPEED_THRESHOLD_MS = 5000;
const SPEED_BONUS = 5;

export function calculateScore(
  isCorrect: boolean,
  answerTimeMs: number,
): ScoreResult {
  if (!isCorrect) {
    return { basePoints: 0, speedBonus: 0, total: 0 };
  }

  const speedBonus =
    answerTimeMs > 0 && answerTimeMs <= SPEED_THRESHOLD_MS ? SPEED_BONUS : 0;

  return {
    basePoints: BASE_POINTS,
    speedBonus,
    total: BASE_POINTS + speedBonus,
  };
}
