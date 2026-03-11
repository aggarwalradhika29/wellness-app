import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  habit_logs: {
    id?: number
    user_id: string
    date: string
    workout: boolean
    skincare_am: boolean
    skincare_pm: boolean
    dinner_730: boolean
    no_phone_in_bed: boolean
    water_glasses: number
    created_at?: string
  }
  sleep_logs: {
    id?: number
    user_id: string
    date: string
    sleep_time: string
    wake_time: string
    quality: number
    notes?: string
    created_at?: string
  }
  weight_logs: {
    id?: number
    user_id: string
    date: string
    weight: number
    created_at?: string
  }
  meal_logs: {
    id?: number
    user_id: string
    date: string
    breakfast?: string
    lunch?: string
    dinner?: string
    snacks?: string
    created_at?: string
  }
  user_profile: {
    id?: number
    user_id: string
    height_cm: number
    start_weight: number
    goal_weight?: number
    age?: number
    updated_at?: string
  }
}
