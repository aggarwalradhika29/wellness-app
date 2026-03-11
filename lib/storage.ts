export type HabitLog = {
  date: string;
  workout: boolean;
  skincareAM: boolean;
  skincarePM: boolean;
  dinner730: boolean;
  noPhoneInBed: boolean;
  waterGlasses: number;
};

export type SleepLog = {
  date: string;
  sleepTime: string;
  wakeTime: string;
  quality: 1 | 2 | 3 | 4 | 5;
  notes?: string;
};

export type WeightLog = {
  date: string;
  weight: number;
};

export type MealLog = {
  date: string;
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
};

const KEYS = {
  habits: "wt_habits",
  sleep: "wt_sleep",
  weight: "wt_weight",
  meals: "wt_meals",
};

function get<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(key) || "[]"); }
  catch { return []; }
}

function set<T>(key: string, data: T[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function getHabits(): HabitLog[] { return get<HabitLog>(KEYS.habits); }
export function getTodayHabits(): HabitLog {
  const today = todayStr();
  return getHabits().find(h => h.date === today) || {
    date: today, workout: false, skincareAM: false, skincarePM: false,
    dinner730: false, noPhoneInBed: false, waterGlasses: 0
  };
}
export function saveHabits(log: HabitLog) {
  const all = getHabits().filter(h => h.date !== log.date);
  set(KEYS.habits, [...all, log]);
}

export function getSleepLogs(): SleepLog[] { return get<SleepLog>(KEYS.sleep); }
export function saveSleepLog(log: SleepLog) {
  const all = getSleepLogs().filter(s => s.date !== log.date);
  set(KEYS.sleep, [...all, log].sort((a, b) => a.date.localeCompare(b.date)));
}

export function getWeightLogs(): WeightLog[] { return get<WeightLog>(KEYS.weight); }
export function saveWeightLog(log: WeightLog) {
  const all = getWeightLogs().filter(w => w.date !== log.date);
  set(KEYS.weight, [...all, log].sort((a, b) => a.date.localeCompare(b.date)));
}

export function getMealLogs(): MealLog[] { return get<MealLog>(KEYS.meals); }
export function getTodayMeals(): MealLog {
  return getMealLogs().find(m => m.date === todayStr()) || { date: todayStr() };
}
export function saveMealLog(log: MealLog) {
  const all = getMealLogs().filter(m => m.date !== log.date);
  set(KEYS.meals, [...all, log]);
}

export function getStreak(): number {
  const habits = getHabits().sort((a, b) => b.date.localeCompare(a.date));
  if (!habits.length) return 0;
  let streak = 0;
  let checkDate = todayStr();
  for (const h of habits) {
    if (h.date !== checkDate) break;
    const done = [h.workout, h.skincareAM, h.skincarePM, h.dinner730, h.noPhoneInBed].filter(Boolean).length;
    if (done >= 3) streak++;
    else break;
    const d = new Date(checkDate);
    d.setDate(d.getDate() - 1);
    checkDate = d.toISOString().split("T")[0];
  }
  return streak;
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split("T")[0];
  });
}
