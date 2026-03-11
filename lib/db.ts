// Database layer — wraps Supabase calls with localStorage fallback
// Falls back to localStorage if Supabase is not configured

import { supabase } from './supabase'

// A stable anonymous user ID stored in localStorage
export function getUserId(): string {
  if (typeof window === 'undefined') return 'server'
  let id = localStorage.getItem('wt_user_id')
  if (!id) {
    id = 'user_' + Math.random().toString(36).slice(2, 18)
    localStorage.setItem('wt_user_id', id)
  }
  return id
}

function isSupabaseConfigured(): boolean {
  return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'YOUR_SUPABASE_URL')
}

// ─── LOCAL STORAGE FALLBACK ─────────────────────────────────────────────────

function lsGet<T>(key: string): T[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function lsSet<T>(key: string, data: T[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(data))
}
export function todayStr(): string { return new Date().toISOString().split('T')[0] }

// ─── HABIT LOGS ─────────────────────────────────────────────────────────────

export type HabitLog = {
  date: string; workout: boolean; skincareAM: boolean; skincarePM: boolean;
  dinner730: boolean; noPhoneInBed: boolean; waterGlasses: number;
}

export async function getHabits(): Promise<HabitLog[]> {
  if (!isSupabaseConfigured()) {
    return lsGet<HabitLog>('wt_habits')
  }
  const { data } = await supabase.from('habit_logs').select('*').eq('user_id', getUserId()).order('date')
  return (data || []).map(r => ({
    date: r.date, workout: r.workout, skincareAM: r.skincare_am,
    skincarePM: r.skincare_pm, dinner730: r.dinner_730,
    noPhoneInBed: r.no_phone_in_bed, waterGlasses: r.water_glasses
  }))
}

export async function getTodayHabits(): Promise<HabitLog> {
  const all = await getHabits()
  return all.find(h => h.date === todayStr()) || {
    date: todayStr(), workout: false, skincareAM: false, skincarePM: false,
    dinner730: false, noPhoneInBed: false, waterGlasses: 0
  }
}

export async function saveHabit(log: HabitLog): Promise<void> {
  if (!isSupabaseConfigured()) {
    const all = lsGet<HabitLog>('wt_habits').filter(h => h.date !== log.date)
    lsSet('wt_habits', [...all, log]); return
  }
  const uid = getUserId()
  await supabase.from('habit_logs').upsert({
    user_id: uid, date: log.date, workout: log.workout,
    skincare_am: log.skincareAM, skincare_pm: log.skincarePM,
    dinner_730: log.dinner730, no_phone_in_bed: log.noPhoneInBed,
    water_glasses: log.waterGlasses
  }, { onConflict: 'user_id,date' })
}

// ─── SLEEP LOGS ─────────────────────────────────────────────────────────────

export type SleepLog = {
  date: string; sleepTime: string; wakeTime: string; quality: 1|2|3|4|5; notes?: string
}

export async function getSleepLogs(): Promise<SleepLog[]> {
  if (!isSupabaseConfigured()) return lsGet<SleepLog>('wt_sleep')
  const { data } = await supabase.from('sleep_logs').select('*').eq('user_id', getUserId()).order('date')
  return (data || []).map(r => ({
    date: r.date, sleepTime: r.sleep_time, wakeTime: r.wake_time,
    quality: r.quality as 1|2|3|4|5, notes: r.notes
  }))
}

export async function saveSleepLog(log: SleepLog): Promise<void> {
  if (!isSupabaseConfigured()) {
    const all = lsGet<SleepLog>('wt_sleep').filter(s => s.date !== log.date)
    lsSet('wt_sleep', [...all, log].sort((a,b) => a.date.localeCompare(b.date))); return
  }
  await supabase.from('sleep_logs').upsert({
    user_id: getUserId(), date: log.date, sleep_time: log.sleepTime,
    wake_time: log.wakeTime, quality: log.quality, notes: log.notes
  }, { onConflict: 'user_id,date' })
}

// ─── WEIGHT LOGS ─────────────────────────────────────────────────────────────

export type WeightLog = { date: string; weight: number }

export async function getWeightLogs(): Promise<WeightLog[]> {
  if (!isSupabaseConfigured()) return lsGet<WeightLog>('wt_weight')
  const { data } = await supabase.from('weight_logs').select('*').eq('user_id', getUserId()).order('date')
  return (data || []).map(r => ({ date: r.date, weight: r.weight }))
}

export async function saveWeightLog(log: WeightLog): Promise<void> {
  if (!isSupabaseConfigured()) {
    const all = lsGet<WeightLog>('wt_weight').filter(w => w.date !== log.date)
    lsSet('wt_weight', [...all, log].sort((a,b) => a.date.localeCompare(b.date))); return
  }
  await supabase.from('weight_logs').upsert({
    user_id: getUserId(), date: log.date, weight: log.weight
  }, { onConflict: 'user_id,date' })
}

// ─── MEAL LOGS ────────────────────────────────────────────────────────────────

export type MealLog = { date: string; breakfast?: string; lunch?: string; dinner?: string; snacks?: string }

export async function getMealLogs(): Promise<MealLog[]> {
  if (!isSupabaseConfigured()) return lsGet<MealLog>('wt_meals')
  const { data } = await supabase.from('meal_logs').select('*').eq('user_id', getUserId()).order('date')
  return (data || []).map(r => ({ date: r.date, breakfast: r.breakfast, lunch: r.lunch, dinner: r.dinner, snacks: r.snacks }))
}

export async function getTodayMeals(): Promise<MealLog> {
  const all = await getMealLogs()
  return all.find(m => m.date === todayStr()) || { date: todayStr() }
}

export async function saveMealLog(log: MealLog): Promise<void> {
  if (!isSupabaseConfigured()) {
    const all = lsGet<MealLog>('wt_meals').filter(m => m.date !== log.date)
    lsSet('wt_meals', [...all, log]); return
  }
  await supabase.from('meal_logs').upsert({
    user_id: getUserId(), date: log.date, breakfast: log.breakfast,
    lunch: log.lunch, dinner: log.dinner, snacks: log.snacks
  }, { onConflict: 'user_id,date' })
}

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

export type UserProfile = {
  heightCm: number; startWeight: number; goalWeight?: number; age?: number
}

export async function getUserProfile(): Promise<UserProfile | null> {
  if (!isSupabaseConfigured()) {
    const p = localStorage.getItem('wt_profile')
    return p ? JSON.parse(p) : null
  }
  const { data } = await supabase.from('user_profile').select('*').eq('user_id', getUserId()).single()
  if (!data) return null
  return { heightCm: data.height_cm, startWeight: data.start_weight, goalWeight: data.goal_weight, age: data.age }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (!isSupabaseConfigured()) {
    localStorage.setItem('wt_profile', JSON.stringify(profile)); return
  }
  await supabase.from('user_profile').upsert({
    user_id: getUserId(), height_cm: profile.heightCm, start_weight: profile.startWeight,
    goal_weight: profile.goalWeight, age: profile.age
  }, { onConflict: 'user_id' })
}

// ─── STREAK + UTILS ──────────────────────────────────────────────────────────

export function calcStreak(habits: HabitLog[]): number {
  const sorted = [...habits].sort((a,b) => b.date.localeCompare(a.date))
  if (!sorted.length) return 0
  let streak = 0, checkDate = todayStr()
  for (const h of sorted) {
    if (h.date !== checkDate) break
    const done = [h.workout, h.skincareAM, h.skincarePM, h.dinner730, h.noPhoneInBed].filter(Boolean).length
    if (done >= 3) streak++
    else break
    const d = new Date(checkDate); d.setDate(d.getDate() - 1)
    checkDate = d.toISOString().split('T')[0]
  }
  return streak
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const hm = heightCm / 100
  return Math.round((weightKg / (hm * hm)) * 10) / 10
}

export function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: 'Underweight', color: '#5A8BE8' }
  if (bmi < 25) return { label: 'Healthy', color: '#6BAA75' }
  if (bmi < 30) return { label: 'Overweight', color: '#E8C45A' }
  return { label: 'Obese', color: '#E05050' }
}

export function getDateRange(range: 'week' | 'month' | 'year'): { start: string; end: string } {
  const end = todayStr()
  const d = new Date()
  if (range === 'week') d.setDate(d.getDate() - 6)
  else if (range === 'month') d.setDate(d.getDate() - 29)
  else d.setFullYear(d.getFullYear() - 1)
  return { start: d.toISOString().split('T')[0], end }
}

export function filterByRange<T extends { date: string }>(items: T[], range: 'week' | 'month' | 'year'): T[] {
  const { start } = getDateRange(range)
  return items.filter(i => i.date >= start)
}

export function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}
