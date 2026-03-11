"use client";
import { useEffect, useState } from "react";
import { getTodayHabits, saveHabits, HabitLog, getLast7Days, getHabits } from "@/lib/storage";

const HABITS = [
  { key: "workout", label: "Workout done", icon: "💪", desc: "Any exercise — home workout, walk, yoga" },
  { key: "skincareAM", label: "Morning skincare", icon: "🌅", desc: "Cleanser → CeraVe → Aveeno → Sunscreen" },
  { key: "skincarePM", label: "Night skincare", icon: "🌙", desc: "Cleanser → Moisturiser → Lip care" },
  { key: "dinner730", label: "Dinner by 7:30 PM", icon: "🍛", desc: "No eating after 10 PM" },
  { key: "noPhoneInBed", label: "Phone outside bedroom", icon: "📵", desc: "Charge phone in another room" },
];

function dayLabel(date: string) {
  return new Date(date).toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2);
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<HabitLog | null>(null);
  const [saved, setSaved] = useState(false);
  const [history, setHistory] = useState<HabitLog[]>([]);
  const [last7, setLast7] = useState<string[]>([]);

  useEffect(() => {
    setHabits(getTodayHabits());
    setLast7(getLast7Days());
    setHistory(getHabits());
  }, []);

  function toggle(key: string) {
    if (!habits) return;
    const updated = { ...habits, [key]: !habits[key as keyof HabitLog] };
    setHabits(updated as HabitLog);
    saveHabits(updated as HabitLog);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  function setWater(n: number) {
    if (!habits) return;
    const updated = { ...habits, waterGlasses: n };
    setHabits(updated as HabitLog);
    saveHabits(updated as HabitLog);
  }

  function getDotColor(date: string) {
    const h = history.find(x => x.date === date);
    if (!h) return "var(--bg2)";
    const done = [h.workout, h.skincareAM, h.skincarePM, h.dinner730, h.noPhoneInBed].filter(Boolean).length;
    if (done >= 5) return "var(--green)";
    if (done >= 3) return "#E8C45A";
    if (done >= 1) return "var(--accent)";
    return "var(--bg2)";
  }

  if (!habits) return null;
  const completedCount = HABITS.filter(h => habits[h.key as keyof HabitLog]).length;

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Today&apos;s Habits</h1>
          <p style={{ color: "var(--text-faint)", fontSize: 13, marginTop: 2 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}
          </p>
        </div>
        {saved && (
          <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", background: "rgba(107,170,117,0.15)", padding: "4px 12px", borderRadius: 99 }}>
            Saved ✓
          </span>
        )}
      </div>

      {/* 7-day mini calendar */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 12 }}>
          Last 7 days
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {last7.map(date => (
            <div key={date} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{dayLabel(date)}</span>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: getDotColor(date),
                outline: date === habits.date ? "2px solid var(--accent)" : "none",
                outlineOffset: 2,
              }} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
          {[["var(--green)", "All 5"], ["#E8C45A", "3–4"], ["var(--accent)", "1–2"], ["var(--bg2)", "None"]].map(([bg, label]) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: bg }} />
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Habit toggles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
        {HABITS.map(h => {
          const done = !!habits[h.key as keyof HabitLog];
          return (
            <button key={h.key} onClick={() => toggle(h.key)} style={{
              background: done ? "rgba(107,170,117,0.08)" : "var(--card)",
              border: `1px solid ${done ? "rgba(107,170,117,0.3)" : "var(--card-border)"}`,
              borderRadius: 14, padding: "14px 16px",
              display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left",
              cursor: "pointer", width: "100%", transition: "all 0.15s",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                border: done ? "none" : "2px solid var(--card-border)",
                background: done ? "var(--green)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.2s",
              }}>
                {done && <span style={{ color: "white", fontSize: 12, fontWeight: 900 }}>✓</span>}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 15 }}>{h.icon}</span>
                  <span style={{
                    fontWeight: 600, fontSize: 14,
                    color: done ? "var(--text-faint)" : "var(--text)",
                    textDecoration: done ? "line-through" : "none",
                  }}>{h.label}</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "3px 0 0" }}>{h.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Water */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>💧 Water Intake</span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "var(--blue)" }}>{habits.waterGlasses}/8</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 6 }}>
          {Array.from({ length: 8 }, (_, i) => (
            <button key={i} onClick={() => setWater(habits.waterGlasses === i + 1 ? i : i + 1)} style={{
              height: 40, borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 11,
              background: i < habits.waterGlasses ? "var(--blue)" : "var(--bg2)",
              color: i < habits.waterGlasses ? "white" : "var(--text-faint)",
              transition: "all 0.15s",
            }}>{i + 1}</button>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>
          Target: 8 glasses (2.5–3L) — crucial for eczema in Delhi summer
        </p>
      </div>

      {/* Score */}
      <div style={{
        borderRadius: 20, padding: 20,
        background: completedCount === 5 ? "var(--green)" : completedCount >= 3 ? "var(--accent)" : "var(--card)",
        border: completedCount < 3 ? "1px solid var(--card-border)" : "none",
      }}>
        <p style={{ fontSize: 36, fontWeight: 900, margin: 0, color: completedCount < 3 ? "var(--text)" : "white" }}>
          {completedCount}/5
        </p>
        <p style={{ fontSize: 14, margin: "4px 0 0", color: completedCount < 3 ? "var(--text-muted)" : "rgba(255,255,255,0.85)" }}>
          {completedCount === 5 ? "Perfect day! 🎉 You're crushing it." :
           completedCount >= 3 ? "Good progress — finish strong today." :
           "Every small step counts. Keep going."}
        </p>
      </div>
    </div>
  );
}
