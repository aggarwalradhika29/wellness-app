"use client";
import { useState } from "react";
import Link from "next/link";
import { getHabits, todayHabits, calcStreak, getWeightLogs, getSleepLogs, dateFromStr, todayStr, HabitLog } from "@/lib/db";
import { HABITS, habitScore } from "@/lib/habits";
import { useLoad } from "@/lib/useLoad";
import LoadError from "@/components/LoadError";

const TIPS = [
  "Keep showers short and lukewarm. Hot water feels great in winter, but it dries out eczema-prone skin.",
  "Apply CeraVe on damp skin within 3 min of stepping out of the shower.",
  "Check AQI before your walk. Above 200, stay indoors and use the stairs instead.",
  "Wear soft cotton under wool, and sit a little back from the heater.",
  "Open the curtains when you wake up, and get outside around midday when you can.",
  "4-7-8 breathing in bed: inhale 4s, hold 7s, exhale 8s. Repeat 4 times.",
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night 🌙";
  if (h < 12) return "Good morning ☀️";
  if (h < 17) return "Good afternoon 🌤️";
  if (h < 20) return "Good evening 🌆";
  return "Good night 🌙";
}

export default function Dashboard() {
  const [habits, setHabits] = useState<HabitLog | null>(null);
  const [streak, setStreak] = useState(0);
  const [lastWeight, setLastWeight] = useState<number | null>(null);
  const [lastSleep, setLastSleep] = useState<string | null>(null);
  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);

  const { failed, retry } = useLoad(async () => {
    const [all, wt, sl] = await Promise.all([getHabits(), getWeightLogs(), getSleepLogs()]);
    setHabits(todayHabits(all));
    setStreak(calcStreak(all));
    if (wt.length) setLastWeight(wt[wt.length - 1].weight);
    if (sl.length) {
      const last = sl[sl.length - 1];
      setLastSleep(`${last.sleepTime} → ${last.wakeTime}`);
    }
  });

  if (failed) return <LoadError onRetry={retry} />;
  if (!habits) return null;

  const completedCount = habitScore(habits);
  const pct = Math.round((completedCount / HABITS.length) * 100);
  const date = dateFromStr(todayStr()).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" });

  return (
    <div style={{ padding: "24px 16px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: "var(--text-faint)", fontSize: 13, fontWeight: 500 }}>{date}</p>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 2, color: "var(--text)" }}>{greeting()}</h1>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
        {[
          { val: streak, label: "Streak 🔥", color: "var(--accent)" },
          { val: lastWeight ? `${lastWeight}kg` : "—", label: "Weight", color: "var(--blue)" },
          { val: `${completedCount}/${HABITS.length}`, label: "Habits", color: "var(--green)" },
        ].map(({ val, label, color }) => (
          <div key={label} className="card" style={{ padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontSize: 22, fontWeight: 900, color }}>{val}</div>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Today's progress */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>Today&apos;s Habits</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>{pct}%</span>
        </div>
        <div style={{ background: "var(--bg2)", borderRadius: 99, height: 6, marginBottom: 14 }}>
          <div style={{ width: `${pct}%`, height: 6, background: "var(--accent)", borderRadius: 99, transition: "width 0.4s" }} />
        </div>
        {HABITS.map(h => {
          const done = habits[h.key];
          return (
            <div key={h.key} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ fontSize: 16 }}>{h.icon}</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: done ? "var(--text-faint)" : "var(--text)", textDecoration: done ? "line-through" : "none" }}>
                {h.shortLabel}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
                background: done ? "rgba(107,170,117,0.15)" : "var(--bg2)",
                color: done ? "var(--green)" : "var(--text-faint)",
              }}>{done ? "Done" : "Pending"}</span>
            </div>
          );
        })}
        <Link href="/habits" style={{
          display: "block", textAlign: "center", background: "var(--accent)", color: "white",
          fontWeight: 700, fontSize: 13, padding: "10px", borderRadius: 12, marginTop: 6, textDecoration: "none",
        }}>Update Habits →</Link>
      </div>

      {/* Water */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>💧 Water</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--blue)" }}>{habits.waterGlasses}/8</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{
              flex: 1, height: 24, borderRadius: 6,
              background: i < habits.waterGlasses ? "var(--blue)" : "var(--bg2)",
              transition: "background 0.2s",
            }} />
          ))}
        </div>
      </div>

      {/* Last sleep */}
      {lastSleep && (
        <div className="card" style={{ padding: 16, marginBottom: 14 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>😴 Last Sleep: </span>
          <span style={{ color: "var(--accent)", fontWeight: 700 }}>{lastSleep}</span>
        </div>
      )}

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
        <Link href="/trackers" className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 20 }}>📊</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>Log Sleep & Weight</span>
        </Link>
        <Link href="/plan" className="card" style={{ padding: 14, display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 20 }}>📋</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>View My Plan</span>
        </Link>
      </div>

      {/* Tip */}
      <div style={{ background: "var(--card)", border: "1px solid var(--accent)44", borderRadius: 16, padding: 16 }}>
        <p style={{ color: "var(--accent)", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>
          Today&apos;s reminder
        </p>
        <p style={{ color: "var(--text)", fontSize: 13, lineHeight: 1.6, margin: 0 }}>{tip}</p>
      </div>
    </div>
  );
}
