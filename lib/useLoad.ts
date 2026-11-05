import { useEffect, useRef, useState } from 'react'
import { todayStr } from './db'

// Runs a page's load on mount, exposes failure and retry, and reloads if the
// app is resumed on a new day so nothing saves to a stale date.
export function useLoad(load: () => Promise<void>) {
  const [failed, setFailed] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const loadedDay = useRef(todayStr())
  const retry = () => setAttempt(a => a + 1)

  useEffect(() => {
    let active = true
    loadedDay.current = todayStr()
    setFailed(false)
    load().catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [attempt]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const onResume = () => {
      if (document.visibilityState === 'visible' && todayStr() !== loadedDay.current) retry()
    }
    document.addEventListener('visibilitychange', onResume)
    window.addEventListener('focus', onResume)
    return () => {
      document.removeEventListener('visibilitychange', onResume)
      window.removeEventListener('focus', onResume)
    }
  }, [])

  return { failed, retry }
}
