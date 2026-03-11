"use client";
import { useEffect, useState } from "react";
import { getSleepLogs, saveSleepLog, getWeightLogs, saveWeightLog, getMealLogs, saveMealLog, getTodayMeals, todayStr, filterByRange, SleepLog, WeightLog, MealLog } from "@/lib/db";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

type Tab = "sleep" | "weight" | "meals";
type Range = "week" | "month" | "year";

export default function TrackersPage() {
  const [tab, setTab] = useState<Tab>("sleep");
  const [range, setRange] = useState<Range>("week");
  const [saved, setSaved] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Sleep
  const [sleepTime, setSleepTime] = useState("23:30");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [quality, setQuality] = useState<1|2|3|4|5>(3);
  const [sleepNotes, setSleepNotes] = useState("");
  const [allSleep, setAllSleep] = useState<SleepLog[]>([]);

  // Weight
  const [weight, setWeight] = useState("");
  const [allWeights, setAllWeights] = useState<WeightLog[]>([]);

  // Meals
  const [meals, setMeals] = useState<MealLog>({ date: todayStr() });

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const obs = new MutationObserver(() => setIsDark(document.documentElement.classList.contains("dark")));
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    async function load() {
      const [sl, wl, ml] = await Promise.all([getSleepLogs(), getWeightLogs(), getTodayMeals()]);
      setAllSleep(sl);
      setAllWeights(wl);
      setMeals(ml);
      const todayLog = sl.find(s => s.date === todayStr());
      if (todayLog) { setSleepTime(todayLog.sleepTime); setWakeTime(todayLog.wakeTime); setQuality(todayLog.quality); setSleepNotes(todayLog.notes || ""); }
      if (wl.length) setWeight(String(wl[wl.length - 1].weight));
    }
    load();
    return () => obs.disconnect();
  }, []);

  function notify() { setSaved(true); setTimeout(() => setSaved(false), 1500); }

  function sleepDuration(s: string, w: string): string {
    const [sh, sm] = s.split(":").map(Number);
    const [wh, wm] = w.split(":").map(Number);
    let mins = (wh * 60 + wm) - (sh * 60 + sm);
    if (mins < 0) mins += 24 * 60;
    return `${Math.floor(mins / 60)}h ${mins % 60}m`;
  }

  function sleepHours(s: string, w: string): number {
    const [sh, sm] = s.split(":").map(Number);
    const [wh, wm] = w.split(":").map(Number);
    let mins = (wh * 60 + wm) - (sh * 60 + sm);
    if (mins < 0) mins += 24 * 60;
    return Math.round((mins / 60) * 10) / 10;
  }

  function xLabel(date: string, r: Range): string {
    const d = new Date(date);
    if (r === "week") return d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 2);
    if (r === "month") return d.getDate().toString();
    return d.toLocaleDateString("en-IN", { month: "short" });
  }

  const filteredSleep = filterByRange(allSleep, range);
  const filteredWeights = filterByRange(allWeights, range);

  // For year range, group weight by month
  const weightChartData = range === "year"
    ? Object.values(filteredWeights.reduce((acc, w) => {
        const key = w.date.slice(0, 7);
        if (!acc[key] || w.date > acc[key].date) acc[key] = w;
        return acc;
      }, {} as Record<string, WeightLog>))
      .map(w => ({ day: new Date(w.date).toLocaleDateString("en-IN", { month: "short" }), weight: w.weight }))
    : filteredWeights.map(w => ({ day: xLabel(w.date, range), weight: w.weight }));

  const sleepChartData = filteredSleep.map(s => ({
    day: xLabel(s.date, range),
    hours: sleepHours(s.sleepTime, s.wakeTime),
    quality: s.quality,
  }));

  const chartStyle = { grid: isDark ? "#2E2C2A" : "#F0EAE2", tick: isDark ? "#6A6058" : "#A09890", tooltip: isDark ? "#1E1C1A" : "#ffffff" };
  const inputStyle = { width: "100%", border: "1px solid var(--input-border)", borderRadius: 12, padding: "10px 12px", fontSize: 14, outline: "none", background: "var(--input-bg)", color: "var(--text)" };
  const labelStyle = { fontSize: 11, fontWeight: 700 as const, color: "var(--text-faint)" as const, textTransform: "uppercase" as const, letterSpacing: 0.8, display: "block" as const, marginBottom: 6 };

  const tabs: { key: Tab; icon: string; label: string }[] = [
    { key: "sleep", icon: "😴", label: "Sleep" },
    { key: "weight", icon: "⚖️", label: "Weight" },
    { key: "meals", icon: "🍽️", label: "Meals" },
  ];

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)" }}>Trackers</h1>
        {saved && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", background: "rgba(107,170,117,0.15)", padding: "4px 12px", borderRadius: 99 }}>Saved ✓</span>}
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "var(--bg2)", borderRadius: 14, padding: 4, gap: 4, marginBottom: 20 }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            padding: "8px 4px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600,
            background: tab === t.key ? "var(--card)" : "transparent",
            color: tab === t.key ? "var(--accent)" : "var(--text-faint)",
            boxShadow: tab === t.key ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
            transition: "all 0.15s",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* ── SLEEP ── */}
      {tab === "sleep" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* Log form */}
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 14 }}>Log Last Night</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label style={labelStyle}>Slept at</label>
                <input type="time" value={sleepTime} onChange={e => setSleepTime(e.target.value)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Woke up</label>
                <input type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} style={inputStyle} /></div>
            </div>
            <div style={{ background: "var(--bg2)", borderRadius: 12, padding: "10px 14px", textAlign: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "var(--accent)" }}>{sleepDuration(sleepTime, wakeTime)}</span>
              <span style={{ fontSize: 12, color: "var(--text-faint)", marginLeft: 8 }}>total sleep</span>
            </div>
            <label style={{ ...labelStyle, marginBottom: 8 }}>Sleep Quality</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              {([1,2,3,4,5] as const).map(q => (
                <button key={q} onClick={() => setQuality(q)} style={{
                  flex: 1, padding: "8px 0", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 22,
                  background: quality === q ? "var(--accent)" : "var(--bg2)",
                  transform: quality === q ? "scale(1.1)" : "scale(1)", transition: "all 0.15s",
                }}>{["😫","😔","😐","😊","😴"][q-1]}</button>
              ))}
            </div>
            <textarea value={sleepNotes} onChange={e => setSleepNotes(e.target.value)} placeholder="Notes (optional)..."
              style={{ ...inputStyle, resize: "none", height: 52, marginBottom: 12 }} />
            <button onClick={async () => {
              await saveSleepLog({ date: todayStr(), sleepTime, wakeTime, quality, notes: sleepNotes });
              setAllSleep(await getSleepLogs()); notify();
            }} style={{ width: "100%", background: "var(--accent)", color: "white", fontWeight: 700, padding: 12, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14 }}>
              Save Sleep Log
            </button>
          </div>

          {/* Chart */}
          {allSleep.length > 0 && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", margin: 0 }}>Sleep History</h3>
                <RangeToggle value={range} onChange={setRange} />
              </div>
              {sleepChartData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <BarChart data={sleepChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.grid} />
                      <XAxis dataKey="day" tick={{ fontSize: 10, fill: chartStyle.tick }} />
                      <YAxis domain={[0, 10]} tick={{ fontSize: 10, fill: chartStyle.tick }} width={20} />
                      <Tooltip contentStyle={{ background: chartStyle.tooltip, border: "1px solid var(--card-border)", borderRadius: 10, fontSize: 12 }} formatter={(v: number) => [`${v} hrs`, "Sleep"]} />
                      <Bar dataKey="hours" fill="var(--blue)" radius={[4,4,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
                    <span style={{ fontSize: 11, color: "var(--text-faint)" }}>Target: 7–8 hrs</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--blue)" }}>
                      Avg: {sleepChartData.length > 0 ? (sleepChartData.reduce((s, d) => s + d.hours, 0) / sleepChartData.length).toFixed(1) : "—"} hrs
                    </span>
                  </div>
                </>
              ) : <p style={{ color: "var(--text-faint)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>No data for this period</p>}
            </div>
          )}

          {/* Recent list */}
          {allSleep.length > 0 && (
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Recent</h3>
              {[...allSleep].reverse().slice(0, 5).map(s => (
                <div key={s.date} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--card-border)" }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{new Date(s.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                    <span style={{ fontSize: 11, color: "var(--text-faint)", marginLeft: 6 }}>{s.sleepTime} → {s.wakeTime}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "var(--accent)" }}>{sleepDuration(s.sleepTime, s.wakeTime)}</span>
                    <span>{["😫","😔","😐","😊","😴"][(s.quality||3)-1]}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── WEIGHT ── */}
      {tab === "weight" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 14 }}>Log Today&apos;s Weight</h2>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end", marginBottom: 14 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Weight (kg)</label>
                <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                  placeholder="66.0" step="0.1"
                  style={{ ...inputStyle, fontSize: 28, fontWeight: 900, padding: "10px 14px" }} />
              </div>
              <button onClick={async () => {
                if (!weight) return;
                await saveWeightLog({ date: todayStr(), weight: parseFloat(weight) });
                setAllWeights(await getWeightLogs()); notify();
              }} style={{ background: "var(--accent)", color: "white", fontWeight: 700, padding: "12px 20px", borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14 }}>Log</button>
            </div>
            {allWeights.length > 0 && (
              <div style={{ background: "var(--bg2)", borderRadius: 12, padding: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  {[
                    { label: "Start", val: `${allWeights[0].weight} kg`, color: "var(--text-muted)" },
                    { label: "Current", val: `${allWeights[allWeights.length-1].weight} kg`, color: "var(--accent)" },
                    { label: "Lost", val: `${(allWeights[0].weight - allWeights[allWeights.length-1].weight).toFixed(1)} kg`, color: "var(--green)" },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <p style={{ fontSize: 10, color: "var(--text-faint)", margin: 0 }}>{label}</p>
                      <p style={{ fontSize: 15, fontWeight: 800, color, margin: "3px 0 0" }}>{val}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          {allWeights.length > 1 && (
            <div className="card" style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", margin: 0 }}>Weight Trend</h3>
                <RangeToggle value={range} onChange={setRange} />
              </div>
              {weightChartData.length > 1 ? (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={weightChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={chartStyle.grid} />
                    <XAxis dataKey="day" tick={{ fontSize: 10, fill: chartStyle.tick }} />
                    <YAxis domain={["auto","auto"]} tick={{ fontSize: 10, fill: chartStyle.tick }} width={32} />
                    <Tooltip contentStyle={{ background: chartStyle.tooltip, border: "1px solid var(--card-border)", borderRadius: 10, fontSize: 12 }} formatter={(v: number) => [`${v} kg`, "Weight"]} />
                    <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2.5} dot={{ fill: "var(--accent)", r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : <p style={{ color: "var(--text-faint)", fontSize: 13, textAlign: "center", padding: "20px 0" }}>Log more entries to see the trend</p>}
            </div>
          )}

          {/* Log history */}
          {allWeights.length > 0 && (
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Log History</h3>
              {[...allWeights].reverse().slice(0, 10).map(w => (
                <div key={w.date} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid var(--card-border)" }}>
                  <span style={{ fontSize: 12, color: "var(--text-faint)" }}>{new Date(w.date).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{w.weight} kg</span>
                </div>
              ))}
            </div>
          )}

          <div className="card" style={{ padding: 14 }}>
            <h3 style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 8 }}>💡 Tips</h3>
            {["Weigh in the morning after washroom, before eating", "Every 3–4 days is better than daily for accurate trends", "1–2 kg daily fluctuation from water is normal"].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: 12 }}>→</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── MEALS ── */}
      {tab === "meals" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <h2 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>Today&apos;s Meal Log</h2>
            <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 14 }}>{new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</p>
            {[
              { key: "breakfast", label: "🥣 Breakfast", placeholder: "Moong dal chilla, poha with peanuts..." },
              { key: "lunch", label: "🍛 Lunch", placeholder: "Dal + roti + sabzi + salad + curd..." },
              { key: "dinner", label: "🫘 Dinner", placeholder: "Light dal + 1 roti + sabzi..." },
              { key: "snacks", label: "🥜 Snacks", placeholder: "Roasted chana, makhana, fruit..." },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", display: "block", marginBottom: 6 }}>{field.label}</label>
                <textarea value={meals[field.key as keyof MealLog] || ""} onChange={e => setMeals({ ...meals, [field.key]: e.target.value })}
                  placeholder={field.placeholder} style={{ ...inputStyle, resize: "none", height: 52 }} />
              </div>
            ))}
            <button onClick={async () => { await saveMealLog(meals); notify(); }}
              style={{ width: "100%", background: "var(--accent)", color: "white", fontWeight: 700, padding: 12, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14 }}>
              Save Meal Log
            </button>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 10 }}>Quick Protein Reference</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[["Moong Dal","14g"],["Rajma","8g"],["Chana","19g"],["Paneer","18g"],["Peanuts","26g"],["Curd","11g/cup"]].map(([item,val]) => (
                <div key={item} style={{ background: "var(--bg2)", borderRadius: 10, padding: "8px 12px", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{item}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--green)" }}>{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RangeToggle({ value, onChange }: { value: Range; onChange: (r: Range) => void }) {
  return (
    <div style={{ display: "flex", background: "var(--bg2)", borderRadius: 10, padding: 3, gap: 2 }}>
      {(["week", "month", "year"] as Range[]).map(r => (
        <button key={r} onClick={() => onChange(r)} style={{
          padding: "4px 10px", borderRadius: 8, border: "none", cursor: "pointer",
          fontSize: 11, fontWeight: 600, transition: "all 0.15s",
          background: value === r ? "var(--accent)" : "transparent",
          color: value === r ? "white" : "var(--text-faint)",
        }}>{r.charAt(0).toUpperCase() + r.slice(1)}</button>
      ))}
    </div>
  );
}
