// Database layer. Every row belongs to the signed-in Supabase user, and the
// database's row-level security policies enforce that on the server.

import { supabase } from './supabase'

async function uid(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not signed in')
  return session.user.id
}

function rows<T>(res: { data: T[] | null; error: { message: string } | null }): T[] {
  if (res.error) throw new Error(res.error.message)
  return res.data || []
}

function check(res: { error: { message: string } | null }): void {
  if (res.error) throw new Error(res.error.message)
}

export function todayStr(): string { return new Date().toISOString().split('T')[0] }

// ─── HABIT LOGS ─────────────────────────────────────────────────────────────

export type HabitLog = {
  date: string; workout: boolean; skincareAM: boolean; skincarePM: boolean;
  dinner730: boolean; noPhoneInBed: boolean; waterGlasses: number;
}

export async function getHabits(): Promise<HabitLog[]> {
  const res = await supabase.from('habit_logs').select('*').eq('user_id', await uid()).order('date')
  return rows(res).map(r => ({
    date: r.date, workout: r.workout, skincareAM: r.skincare_am,
    skincarePM: r.skincare_pm, dinner730: r.dinner_730,
    noPhoneInBed: r.no_phone_in_bed, waterGlasses: r.water_glasses
  }))
}

export function todayHabits(all: HabitLog[]): HabitLog {
  return all.find(h => h.date === todayStr()) || {
    date: todayStr(), workout: false, skincareAM: false, skincarePM: false,
    dinner730: false, noPhoneInBed: false, waterGlasses: 0
  }
}

export async function saveHabit(log: HabitLog): Promise<void> {
  check(await supabase.from('habit_logs').upsert({
    user_id: await uid(), date: log.date, workout: log.workout,
    skincare_am: log.skincareAM, skincare_pm: log.skincarePM,
    dinner_730: log.dinner730, no_phone_in_bed: log.noPhoneInBed,
    water_glasses: log.waterGlasses
  }, { onConflict: 'user_id,date' }))
}

// ─── SLEEP LOGS ─────────────────────────────────────────────────────────────

export type SleepLog = {
  date: string; sleepTime: string; wakeTime: string; quality: 1|2|3|4|5; notes?: string
}

export async function getSleepLogs(): Promise<SleepLog[]> {
  const res = await supabase.from('sleep_logs').select('*').eq('user_id', await uid()).order('date')
  return rows(res).map(r => ({
    date: r.date, sleepTime: r.sleep_time, wakeTime: r.wake_time,
    quality: r.quality as 1|2|3|4|5, notes: r.notes
  }))
}

export async function saveSleepLog(log: SleepLog): Promise<void> {
  check(await supabase.from('sleep_logs').upsert({
    user_id: await uid(), date: log.date, sleep_time: log.sleepTime,
    wake_time: log.wakeTime, quality: log.quality, notes: log.notes
  }, { onConflict: 'user_id,date' }))
}

// ─── WEIGHT LOGS ─────────────────────────────────────────────────────────────

export type WeightLog = { date: string; weight: number }

export async function getWeightLogs(): Promise<WeightLog[]> {
  const res = await supabase.from('weight_logs').select('*').eq('user_id', await uid()).order('date')
  return rows(res).map(r => ({ date: r.date, weight: r.weight }))
}

export async function saveWeightLog(log: WeightLog): Promise<void> {
  check(await supabase.from('weight_logs').upsert({
    user_id: await uid(), date: log.date, weight: log.weight
  }, { onConflict: 'user_id,date' }))
}

// ─── MEAL LOGS ────────────────────────────────────────────────────────────────

export type MealLog = { date: string; breakfast?: string; lunch?: string; dinner?: string; snacks?: string }

export async function getMealLogs(): Promise<MealLog[]> {
  const res = await supabase.from('meal_logs').select('*').eq('user_id', await uid()).order('date')
  return rows(res).map(r => ({ date: r.date, breakfast: r.breakfast, lunch: r.lunch, dinner: r.dinner, snacks: r.snacks }))
}

export async function getTodayMeals(): Promise<MealLog> {
  const all = await getMealLogs()
  return all.find(m => m.date === todayStr()) || { date: todayStr() }
}

export async function saveMealLog(log: MealLog): Promise<void> {
  check(await supabase.from('meal_logs').upsert({
    user_id: await uid(), date: log.date, breakfast: log.breakfast,
    lunch: log.lunch, dinner: log.dinner, snacks: log.snacks
  }, { onConflict: 'user_id,date' }))
}

// ─── USER PROFILE ─────────────────────────────────────────────────────────────

export type UserProfile = {
  heightCm: number; startWeight: number; goalWeight?: number; age?: number
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const { data, error } = await supabase.from('user_profile').select('*').eq('user_id', await uid()).maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return { heightCm: data.height_cm, startWeight: data.start_weight, goalWeight: data.goal_weight, age: data.age }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  check(await supabase.from('user_profile').upsert({
    user_id: await uid(), height_cm: profile.heightCm, start_weight: profile.startWeight,
    goal_weight: profile.goalWeight, age: profile.age
  }, { onConflict: 'user_id' }))
}

// ─── IMPORT OLD BROWSER DATA ──────────────────────────────────────────────────

const IMPORT_FLAG = 'wt_imported_v1'

function readLocal<T extends { date?: string }>(key: string): T[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '[]')
    if (!Array.isArray(parsed)) return []
    const byDate = new Map<string, T>()
    for (const row of parsed as T[]) if (row?.date) byDate.set(row.date, row)
    return Array.from(byDate.values())
  } catch { return [] }
}

// One-time copy of history the old app kept only in this browser. Rows already
// in Supabase win, and the browser copy is left in place as a backup.
export async function importLocalData(): Promise<number> {
  if (localStorage.getItem(IMPORT_FLAG)) return 0
  const user_id = await uid()
  const conflict = { onConflict: 'user_id,date', ignoreDuplicates: true }

  const habits = readLocal<HabitLog>('wt_habits').map(h => ({
    user_id, date: h.date, workout: !!h.workout, skincare_am: !!h.skincareAM,
    skincare_pm: !!h.skincarePM, dinner_730: !!h.dinner730,
    no_phone_in_bed: !!h.noPhoneInBed, water_glasses: h.waterGlasses || 0
  }))
  const sleep = readLocal<SleepLog>('wt_sleep')
    .filter(s => s.sleepTime && s.wakeTime && s.quality >= 1 && s.quality <= 5)
    .map(s => ({ user_id, date: s.date, sleep_time: s.sleepTime, wake_time: s.wakeTime, quality: s.quality, notes: s.notes ?? null }))
  const weight = readLocal<WeightLog>('wt_weight')
    .filter(w => Number.isFinite(w.weight))
    .map(w => ({ user_id, date: w.date, weight: w.weight }))
  const meals = readLocal<MealLog>('wt_meals').map(m => ({
    user_id, date: m.date, breakfast: m.breakfast ?? null, lunch: m.lunch ?? null,
    dinner: m.dinner ?? null, snacks: m.snacks ?? null
  }))

  if (habits.length) check(await supabase.from('habit_logs').upsert(habits, conflict))
  if (sleep.length) check(await supabase.from('sleep_logs').upsert(sleep, conflict))
  if (weight.length) check(await supabase.from('weight_logs').upsert(weight, conflict))
  if (meals.length) check(await supabase.from('meal_logs').upsert(meals, conflict))

  localStorage.setItem(IMPORT_FLAG, new Date().toISOString())
  return habits.length + sleep.length + weight.length + meals.length
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
