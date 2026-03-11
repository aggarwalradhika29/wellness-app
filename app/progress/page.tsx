"use client";
import { useEffect, useState } from "react";
import { getHabits, getWeightLogs, getSleepLogs, getLast7Days, getStreak, HabitLog, WeightLog, SleepLog } from "@/lib/storage";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ProgressPage() {
  const [habits, setHabits] = useState<HabitLog[]>([]);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [sleeps, setSleeps] = useState<SleepLog[]>([]);
  const [streak, setStreak] = useState(0);
  const [last7, setLast7] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setHabits(getHabits());
    setWeights(getWeightLogs());
    setSleeps(getSleepLogs());
    setStreak(getStreak());
    setLast7(getLast7Days());
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  function habitScore(h: HabitLog) {
    return [h.workout, h.skincareAM, h.skincarePM, h.dinner730, h.noPhoneInBed].filter(Boolean).length;
  }

  const weekData = last7.map(date => {
    const h = habits.find(x => x.date === date);
    const s = sleeps.find(x => x.date === date);
    let sleepHrs = 0;
    if (s) {
      const [sh, sm] = s.sleepTime.split(":").map(Number);
      const [wh, wm] = s.wakeTime.split(":").map(Number);
      let mins = (wh * 60 + wm) - (sh * 60 + sm);
      if (mins < 0) mins += 24 * 60;
      sleepHrs = Math.round((mins / 60) * 10) / 10;
    }
    return {
      day: new Date(date).toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2),
      habits: h ? habitScore(h) : 0,
      water: h ? h.waterGlasses : 0,
      sleep: sleepHrs,
    };
  });

  const weightData = weights.slice(-14).map(w => ({
    day: new Date(w.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    weight: w.weight,
  }));

  const totalDaysTracked = habits.length;
  const perfectDays = habits.filter(h => habitScore(h) === 5).length;
  const avgHabits = habits.length ? (habits.reduce((s, h) => s + habitScore(h), 0) / habits.length).toFixed(1) : "0";
  const avgWater = habits.length ? (habits.reduce((s, h) => s + h.waterGlasses, 0) / habits.length).toFixed(1) : "0";

  const chartColors = { grid: isDark ? "#2E2C2A" : "#F0EAE2", text: isDark ? "#6A6058" : "#A09890", tooltip: isDark ? "#1E1C1A" : "#fff" };

  return (
    <div style={{ padding: "24px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Progress</h1>
      <p style={{ color: "var(--text-faint)", fontSize: 13, marginBottom: 24 }}>Your wellness journey at a glance</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {[
          { val: streak, label: "Streak 🔥", color: "var(--accent)" },
          { val: perfectDays, label: "Perfect Days ⭐", color: "var(--green)" },
          { val: totalDaysTracked, label: "Days Tracked", color: "var(--blue)" },
          { val: `${avgHabits}/5`, label: "Avg Habits", color: "#9B7EC8" },
        ].map(({ val, label, color }) => (
          <div key={label} className="card" style={{ padding: "14px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 28, fontWeight: 900, color }}>{val}</div>
            <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 3 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Habits bar */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <h2 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 16 }}>This Week — Habits</h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 96 }}>
          {weekData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: 80, display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%", borderRadius: "6px 6px 0 0",
                  height: `${(d.habits / 5) * 100}%`,
                  minHeight: d.habits > 0 ? 4 : 0,
                  background: d.habits === 5 ? "var(--green)" : d.habits >= 3 ? "var(--accent)" : d.habits > 0 ? "#E8C45A" : "var(--bg2)",
                  transition: "height 0.4s",
                }} />
              </div>
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Water bar */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <h2 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 16 }}>This Week — Water</h2>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
          {weekData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{ width: "100%", height: 64, display: "flex", alignItems: "flex-end" }}>
                <div style={{
                  width: "100%", borderRadius: "6px 6px 0 0",
                  height: `${(d.water / 8) * 100}%`,
                  minHeight: d.water > 0 ? 4 : 0,
                  background: d.water >= 6 ? "var(--blue)" : d.water >= 4 ? "#8BB8E8" : "#C8D8F8",
                }} />
              </div>
              <span style={{ fontSize: 10, color: "var(--text-faint)" }}>{d.day}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 8 }}>Avg: {avgWater} glasses/day (target: 8)</p>
      </div>

      {/* Weight chart */}
      {weightData.length > 1 && (
        <div className="card" style={{ padding: 16, marginBottom: 14 }}>
          <h2 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Weight Trend</h2>
          <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12 }}>Starting: 66 kg</p>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: chartColors.text }} />
              <YAxis domain={["auto","auto"]} tick={{ fontSize: 10, fill: chartColors.text }} width={30} />
              <Tooltip contentStyle={{ background: chartColors.tooltip, border: "1px solid var(--card-border)", borderRadius: 10, fontSize: 12 }} formatter={(v: number) => [`${v} kg`, "Weight"]} />
              <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: "var(--accent)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Sleep chart */}
      {weekData.some(d => d.sleep > 0) && (
        <div className="card" style={{ padding: 16, marginBottom: 14 }}>
          <h2 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Sleep This Week</h2>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: chartColors.text }} />
              <YAxis domain={[0,10]} tick={{ fontSize: 10, fill: chartColors.text }} width={20} />
              <Tooltip contentStyle={{ background: chartColors.tooltip, border: "1px solid var(--card-border)", borderRadius: 10, fontSize: 12 }} formatter={(v: number) => [`${v} hrs`, "Sleep"]} />
              <Line type="monotone" dataKey="sleep" stroke="var(--blue)" strokeWidth={2.5} dot={{ fill: "var(--blue)", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {totalDaysTracked === 0 && (
        <div className="card" style={{ padding: 32, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📊</div>
          <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>No data yet</p>
          <p style={{ fontSize: 13, color: "var(--text-faint)" }}>Start logging habits, sleep, and weight to see your progress here.</p>
        </div>
      )}
    </div>
  );
}
