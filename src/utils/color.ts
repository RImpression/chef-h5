/** 卡路里颜色：<200 绿色, 200-400 橙色, >400 红色 */
export function getCaloriesColor(calories: number): string {
  if (calories < 200) return '#7BA05B';
  if (calories <= 400) return '#D4956A';
  return '#C4654A';
}

/** 难度颜色：1-2星 绿色, 3-4星 橙色, 5星 红色 */
export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 2) return '#7BA05B';
  if (difficulty <= 4) return '#D4956A';
  return '#C4654A';
}