import type { HabitLog } from './db'

export const HABITS = [
  { key: 'workout', label: 'Workout done', shortLabel: 'Workout', icon: '💪', desc: 'Home workout, walk or yoga' },
  { key: 'skincareAM', label: 'Morning skincare', shortLabel: 'Skincare AM', icon: '🌅', desc: 'Cleanser → CeraVe → Aveeno → Sunscreen' },
  { key: 'skincarePM', label: 'Night skincare', shortLabel: 'Skincare PM', icon: '🌙', desc: 'Cleanser → Moisturiser → Lip care' },
  { key: 'dinner730', label: 'Dinner by 8 PM', shortLabel: 'Dinner by 8', icon: '🍛', desc: 'No eating after 10 PM' },
  { key: 'noPhoneInBed', label: 'Phone outside bedroom', shortLabel: 'No phone in bed', icon: '📵', desc: 'Charge phone in another room' },
] as const

export type HabitKey = (typeof HABITS)[number]['key']

export function habitScore(log: HabitLog): number {
  return HABITS.filter(h => log[h.key]).length
}
