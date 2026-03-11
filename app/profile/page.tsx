"use client";
import { useEffect, useState } from "react";
import { getUserProfile, saveUserProfile, getWeightLogs, calcBMI, bmiCategory, UserProfile, WeightLog } from "@/lib/db";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>({ heightCm: 0, startWeight: 66, goalWeight: undefined, age: 22 });
  const [latestWeight, setLatestWeight] = useState<number>(66);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const p = await getUserProfile();
      if (p) setProfile(p);
      const w = await getWeightLogs();
      if (w.length) setLatestWeight(w[w.length - 1].weight);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    await saveUserProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const bmi = profile.heightCm > 0 ? calcBMI(latestWeight, profile.heightCm) : null;
  const cat = bmi ? bmiCategory(bmi) : null;
  const goalBMI = profile.goalWeight && profile.heightCm > 0 ? calcBMI(profile.goalWeight, profile.heightCm) : null;
  const weightToGoal = profile.goalWeight ? (latestWeight - profile.goalWeight).toFixed(1) : null;
  const startBMI = profile.heightCm > 0 ? calcBMI(profile.startWeight, profile.heightCm) : null;

  const inputStyle = { width: "100%", border: "1px solid var(--input-border)", borderRadius: 12, padding: "12px 14px", fontSize: 16, fontWeight: 700, outline: "none", background: "var(--input-bg)", color: "var(--text)" };
  const labelStyle = { fontSize: 11, fontWeight: 700, color: "var(--text-faint)", textTransform: "uppercase" as const, letterSpacing: 1, display: "block", marginBottom: 6 };

  if (loading) return <div style={{ padding: 32, textAlign: "center", color: "var(--text-faint)" }}>Loading...</div>;

  return (
    <div style={{ padding: "24px 16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", margin: 0 }}>My Profile</h1>
          <p style={{ color: "var(--text-faint)", fontSize: 13, marginTop: 4 }}>Height, weight & BMI tracker</p>
        </div>
        {saved && <span style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", background: "rgba(107,170,117,0.15)", padding: "4px 12px", borderRadius: 99 }}>Saved ✓</span>}
      </div>

      {/* BMI Card */}
      {bmi && cat && (
        <div style={{ background: "var(--card)", border: `1px solid ${cat.color}44`, borderRadius: 20, padding: 20, marginBottom: 16 }}>
          <p style={{ color: "var(--text-faint)", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1.5, margin: "0 0 8px" }}>Current BMI</p>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 12 }}>
            <span style={{ fontSize: 52, fontWeight: 900, color: cat.color, lineHeight: 1 }}>{bmi}</span>
            <div style={{ paddingBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: cat.color + "22", color: cat.color }}>{cat.label}</span>
            </div>
          </div>

          {/* BMI Scale */}
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", height: 8, borderRadius: 99, overflow: "hidden", marginBottom: 4 }}>
              {[["#5A8BE8", 25], ["#6BAA75", 25], ["#E8C45A", 25], ["#E05050", 25]].map(([c, w], i) => (
                <div key={i} style={{ flex: w as number, background: c as string }} />
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "var(--text-faint)" }}>
              <span>Under ({"<"}18.5)</span><span>Healthy (18.5–25)</span><span>Over (25–30)</span><span>Obese (30+)</span>
            </div>
          </div>

          {/* Marker */}
          <div style={{ position: "relative", height: 16 }}>
            <div style={{
              position: "absolute",
              left: `${Math.min(Math.max(((bmi - 15) / 25) * 100, 2), 98)}%`,
              transform: "translateX(-50%)",
              fontSize: 16, lineHeight: 1
            }}>▲</div>
          </div>

          {/* Stats row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
            {[
              { label: "Current", val: `${latestWeight} kg`, color: cat.color },
              { label: "Start", val: `${profile.startWeight} kg`, color: "var(--text-faint)" },
              { label: "Goal", val: profile.goalWeight ? `${profile.goalWeight} kg` : "Not set", color: "var(--green)" },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: "var(--bg2)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
                <p style={{ fontSize: 10, color: "var(--text-faint)", margin: 0 }}>{label}</p>
                <p style={{ fontSize: 13, fontWeight: 700, color, margin: "2px 0 0" }}>{val}</p>
              </div>
            ))}
          </div>

          {weightToGoal && parseFloat(weightToGoal) > 0 && (
            <div style={{ marginTop: 12, background: "rgba(107,170,117,0.1)", border: "1px solid rgba(107,170,117,0.2)", borderRadius: 10, padding: "10px 12px", textAlign: "center" }}>
              <span style={{ fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                {weightToGoal} kg to reach your goal weight
                {goalBMI && <span style={{ color: "var(--text-faint)", fontWeight: 400 }}> (BMI {goalBMI})</span>}
              </span>
            </div>
          )}
          {startBMI && startBMI !== bmi && (
            <div style={{ marginTop: 8, textAlign: "center" }}>
              <span style={{ fontSize: 12, color: "var(--text-faint)" }}>
                BMI change from start: <strong style={{ color: bmi < startBMI ? "var(--green)" : "var(--accent)" }}>
                  {bmi < startBMI ? "↓" : "↑"}{Math.abs(Math.round((bmi - startBMI) * 10) / 10)}
                </strong>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Profile Form */}
      <div className="card" style={{ padding: 16, marginBottom: 14 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 16 }}>Your Details</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Age</label>
            <input type="number" value={profile.age || ""} onChange={e => setProfile({ ...profile, age: parseInt(e.target.value) || undefined })} placeholder="22" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Height (cm)</label>
            <input type="number" value={profile.heightCm || ""} onChange={e => setProfile({ ...profile, heightCm: parseFloat(e.target.value) || 0 })} placeholder="170" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={labelStyle}>Start Weight (kg)</label>
            <input type="number" value={profile.startWeight || ""} onChange={e => setProfile({ ...profile, startWeight: parseFloat(e.target.value) || 0 })} placeholder="66" step="0.1" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Goal Weight (kg)</label>
            <input type="number" value={profile.goalWeight || ""} onChange={e => setProfile({ ...profile, goalWeight: parseFloat(e.target.value) || undefined })} placeholder="58" step="0.1" style={inputStyle} />
          </div>
        </div>
        <button onClick={handleSave} style={{ width: "100%", background: "var(--accent)", color: "white", fontWeight: 700, padding: 12, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14 }}>
          Save Profile
        </button>
      </div>

      {/* BMI Reference */}
      <div className="card" style={{ padding: 16 }}>
        <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>BMI Reference</h3>
        {[
          ["< 18.5", "Underweight", "#5A8BE8"],
          ["18.5 – 24.9", "Healthy Weight", "#6BAA75"],
          ["25 – 29.9", "Overweight", "#E8C45A"],
          ["≥ 30", "Obese", "#E05050"],
        ].map(([range, label, color]) => (
          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--card-border)" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
              <span style={{ fontSize: 13, color: "var(--text)" }}>{label}</span>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color }}>{range}</span>
          </div>
        ))}
        <p style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 10, lineHeight: 1.6 }}>
          Note: BMI doesn&apos;t account for muscle mass. Use it as a general guide, not a definitive health measure.
        </p>
      </div>
    </div>
  );
}
