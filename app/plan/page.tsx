"use client";
import { useState } from "react";

type PlanTab = "overview" | "sleep" | "fitness" | "diet" | "skincare" | "schedule";

const PLAN_TABS: { key: PlanTab; label: string; icon: string }[] = [
  { key: "overview", label: "Overview", icon: "🏠" },
  { key: "sleep", label: "Sleep", icon: "😴" },
  { key: "fitness", label: "Fitness", icon: "💪" },
  { key: "diet", label: "Diet", icon: "🍛" },
  { key: "skincare", label: "Skin", icon: "✨" },
  { key: "schedule", label: "Schedule", icon: "🗓️" },
];

const WEEK = [
  { day: "Monday", type: "Full Body", color: "#6BAA75", exercises: ["Jump Rope Warm-up — 5 min","Squats — 3×15 (hold dumbbells)","Push-ups — 3×10–12","Resistance Band Rows — 3×15","Reverse Lunges — 3×10 each leg","Dumbbell Bicep Curls — 3×12","Plank — 3×30 sec","Cool-down stretch — 5 min"] },
  { day: "Tuesday", type: "Walk", color: "#5A8BE8", exercises: ["Morning Park Walk — 30–45 min","Light stretching on yoga mat — 10 min","Tip: No earphones for first 10 min, just breathe"] },
  { day: "Wednesday", type: "HIIT + Cardio", color: "#E8845A", exercises: ["Jump Rope — 3×3 min with 1 min rest","Burpees — 3×8","High Knees — 3×30 sec","Sumo Squats — 3×15 (inner thighs)","Resistance Band Lateral Walks — 3×12 each side","Mountain Climbers — 3×20","Tricep Dips — 3×12 using chair"] },
  { day: "Thursday", type: "Walk + Yoga", color: "#9B7EC8", exercises: ["Evening Park Walk — 30 min","Yoga: child's pose, cat-cow, pigeon, legs-up-wall","4-7-8 breathing — 5 min before sleep"] },
  { day: "Friday", type: "Upper Body", color: "#6BAA75", exercises: ["Resistance Band Overhead Press — 3×12","Dumbbell Lateral Raises — 3×12","Push-up Variations — 3×10 (wide, narrow, diamond)","Dumbbell Hammer Curls — 3×12","Tricep Kickbacks — 3×12 (targets arm flab)","Resistance Band Pull-Apart — 3×15"] },
  { day: "Saturday", type: "Lower Body", color: "#E8845A", exercises: ["Jump Rope Warm-up — 5 min","Bulgarian Split Squats — 3×10 each leg","Resistance Band Squats — 3×15","Glute Bridges — 3×15","Resistance Band Clamshells — 3×15 each side","Calf Raises — 3×20","Cool-down: pigeon pose, quad stretch — 5 min"] },
  { day: "Sunday", type: "Rest", color: "#A09890", exercises: ["Full rest day","Optional: 20-min gentle walk","Focus: meal prep, good sleep, relax intentionally"] },
];

function WorkoutDay({ day, type, color, exercises }: typeof WEEK[0]) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ background: "var(--card)", border: `1px solid ${open ? color + "66" : "var(--card-border)"}`, borderRadius: 14, marginBottom: 8, overflow: "hidden" }}>
      <button onClick={() => setOpen(!open)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", textAlign: "left" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text)" }}>{day}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 10px", borderRadius: 99, background: color + "22", color }}>{type}</span>
        </div>
        <span style={{ color: "var(--text-faint)", fontSize: 18 }}>{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div style={{ padding: "0 16px 14px" }}>
          {exercises.map((ex, i) => (
            <div key={i} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
              <span style={{ color, fontWeight: 700 }}>✦</span>
              <span style={{ fontSize: 13, color: "var(--text)" }}>{ex}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Block({ time, text, note, color = "var(--text-faint)" }: { time: string; text: string; note?: string; color?: string }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
      <div style={{ width: 56, textAlign: "right", fontSize: 11, fontWeight: 700, color: "var(--text-faint)", paddingTop: 2, flexShrink: 0, fontFamily: "monospace" }}>{time}</div>
      <div style={{ width: 2, background: color, borderRadius: 99, flexShrink: 0, opacity: 0.6 }} />
      <div>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", margin: 0 }}>{text}</p>
        {note && <p style={{ fontSize: 11, color: "var(--text-faint)", margin: "2px 0 0" }}>{note}</p>}
      </div>
    </div>
  );
}

export default function PlanPage() {
  const [tab, setTab] = useState<PlanTab>("overview");

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ padding: "0 16px 16px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 2 }}>My Wellness Plan</h1>
        <p style={{ color: "var(--text-faint)", fontSize: 13 }}>22 yr • 66 kg • North India • Summer 2026</p>
      </div>

      {/* Scrollable tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 16px 16px", overflowX: "auto" }}>
        {PLAN_TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: 12, border: "none", cursor: "pointer",
            fontSize: 12, fontWeight: 600, whiteSpace: "nowrap", flexShrink: 0,
            background: tab === t.key ? "var(--accent)" : "var(--bg2)",
            color: tab === t.key ? "white" : "var(--text-muted)",
            transition: "all 0.15s",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      <div style={{ padding: "0 16px 24px" }}>
        {tab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ padding: 16, border: "1px solid var(--accent)44" }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 8 }}>The Core Insight</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>Everything — the 3 AM sleep, fatigue, eczema, skipped skincare — is one interconnected loop. <strong style={{ color: "var(--text)" }}>Fix sleep first, and the rest follows.</strong></p>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Your 3 Non-Negotiables</h3>
              {[["Sleep by 12:30 AM — phone outside bedroom", "var(--blue)"],["Bath + skincare every morning (5 min min.)", "var(--green)"],["Dinner by 7:30 PM, nothing after 10 PM", "var(--accent)"]].map(([text, color], i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: color, color: "white", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i+1}</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", paddingTop: 3 }}>{text}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Why Your Eczema Keeps Flaring</h3>
              {[["😴","Sleep deprivation","Raises cortisol → triggers inflammation"],["🚿","Skipping baths","Summer sweat on skin = direct trigger"],["📱","Late night scrolling","Stress + blue light → flares"],["🍟","Irregular/fried food","Gut inflammation = skin inflammation"]].map(([icon,title,desc]) => (
                <div key={title as string} style={{ display: "flex", gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{icon}</span>
                  <div><p style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", margin: 0 }}>{title as string}</p><p style={{ fontSize: 12, color: "var(--text-faint)", margin: "2px 0 0" }}>{desc as string}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "sleep" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "#0D1B2A", borderRadius: 16, padding: 16 }}>
              <p style={{ color: "#8BB8E8", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>The Science</p>
              <p style={{ color: "#C8D8E8", fontSize: 13, lineHeight: 1.6, margin: 0 }}>You have <strong style={{ color: "white" }}>delayed sleep phase</strong> — your melatonin has shifted late. Fix it by shifting bedtime 30 min earlier every 2 weeks + morning light exposure.</p>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Phase Shift Plan</h3>
              {[["Week 1–2","Sleep 2:30 AM → Wake 9:30 AM"],["Week 3–4","Sleep 1:30 AM → Wake 8:00 AM"],["Week 5–6","Sleep 12:30 AM → Wake 7:00 AM"],["Week 7+","Sleep 11:30 PM → Wake 6:00 AM ✓"]].map(([week,target]) => (
                <div key={week as string} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--card-border)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)" }}>{week as string}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{target as string}</span>
                </div>
              ))}
              <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 10 }}>⚠️ Wake at target time EVERY day — even if you slept at 3 AM.</p>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Evening Wind-Down</h3>
              <Block time="10:00" text="Dim all lights" note="Bright light after 10 PM kills melatonin" color="#9B7EC8" />
              <Block time="11:30" text="Work calls end — hard stop" color="var(--text-faint)" />
              <Block time="11:35" text="Night skincare (5 min)" note="Do this BEFORE opening any app" color="#9B7EC8" />
              <Block time="11:45" text="No reels/YouTube" note="Music, podcast, or reading only" color="#9B7EC8" />
              <Block time="11:55" text="4-7-8 Breathing in bed" note="Inhale 4s, hold 7s, exhale 8s. Repeat 4–6x." color="var(--blue)" />
              <Block time="12:00" text="Phone on charge — outside room" color="var(--blue)" />
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 10 }}>Natural Sleep Aids</h3>
              {[["Ashwagandha","250mg with warm milk at night — lowers cortisol"],["Chamomile Tea","One cup at 10 PM — gentle, effective"],["Turmeric Milk","Anti-inflammatory — helps sleep + eczema"],["Banana","Magnesium + tryptophan — eat at dinner"]].map(([item,desc]) => (
                <div key={item as string} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: "var(--green)", fontWeight: 700 }}>→</span>
                  <div><span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{item as string}: </span><span style={{ fontSize: 13, color: "var(--text-muted)" }}>{desc as string}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "fitness" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ padding: 16, border: "1px solid rgba(107,170,117,0.3)", background: "rgba(107,170,117,0.06)" }}>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, margin: 0 }}>With rope + resistance band + 2.5kg dumbbells + yoga mat — you have everything. <strong>Consistency beats intensity.</strong></p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="card" style={{ padding: 14, textAlign: "center" }}>
                <p style={{ color: "var(--text-faint)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", margin: "0 0 4px" }}>Morning</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: "var(--accent)", margin: 0 }}>7–9 AM</p>
                <p style={{ fontSize: 10, color: "var(--text-faint)", margin: "2px 0 0" }}>Mon, Wed, Fri, Sat</p>
              </div>
              <div className="card" style={{ padding: 14, textAlign: "center" }}>
                <p style={{ color: "var(--text-faint)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", margin: "0 0 4px" }}>Evening</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: "var(--blue)", margin: 0 }}>6–8 PM</p>
                <p style={{ fontSize: 10, color: "var(--text-faint)", margin: "2px 0 0" }}>Tue, Thu (walks)</p>
              </div>
            </div>
            <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text)" }}>Weekly Plan (tap to expand)</p>
            {WEEK.map(w => <WorkoutDay key={w.day} {...w} />)}
          </div>
        )}

        {tab === "diet" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 14 }}>Daily Meal Plan</h3>
              {[
                { time:"7:00",icon:"🫖",label:"Wake-up",text:"Warm lemon water / jeera water (empty stomach)"},
                { time:"8:00",icon:"🥣",label:"Breakfast",text:"Moong dal chilla / Poha + peanuts / Oats upma + curd"},
                { time:"10:30",icon:"🍌",label:"Snack",text:"Banana or apple, or soaked almonds (8–10)"},
                { time:"1:00 PM",icon:"🍛",label:"Lunch",text:"2 rotis + dal + sabzi + curd + salad (biggest meal)"},
                { time:"4:00 PM",icon:"☕",label:"Snack",text:"Roasted chana, makhana, sprouts, or green tea"},
                { time:"7:00 PM",icon:"🫘",label:"Dinner",text:"1–2 rotis + light sabzi + dal. Done by 7:30 PM."},
                { time:"9:30 PM",icon:"🥛",label:"Optional",text:"Warm turmeric milk + ashwagandha. Nothing after 10 PM."},
              ].map(m => (
                <div key={m.time} style={{ display: "flex", gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid var(--card-border)" }}>
                  <span style={{ fontSize: 20 }}>{m.icon}</span>
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
                      <span style={{ fontWeight: 700, fontSize: 13, color: "var(--text)" }}>{m.label}</span>
                      <span style={{ fontSize: 10, color: "var(--text-faint)", fontFamily: "monospace" }}>{m.time}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", margin: "3px 0 0", lineHeight: 1.5 }}>{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Eczema Diet</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p style={{ color: "var(--green)", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✓ Eat More</p>
                  {["Turmeric daily","Flaxseeds","Leafy greens","Curd/probiotics","Coconut water","Sweet potato"].map(i => <p key={i} style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 4px" }}>+ {i}</p>)}
                </div>
                <div>
                  <p style={{ color: "#E05050", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✗ Reduce</p>
                  {["Spicy/oily food","Processed snacks","Maida items","Late night eating","Excess chai","Aerated drinks"].map(i => <p key={i} style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 4px" }}>− {i}</p>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "skincare" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ padding: 16, border: "1px solid rgba(232,132,90,0.3)", background: "rgba(232,132,90,0.05)" }}>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, margin: 0 }}>Your products are excellent. The issue is <strong>doing it only when inflamed</strong>. Eczema needs prevention, not just treatment.</p>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>🌅 Morning Routine (7 min)</h3>
              <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12 }}>Trigger: Right after post-workout shower</p>
              {[["1","Cetaphil Syndet Bar","Cleanse face + body, lukewarm water only","var(--accent)"],["2","CeraVe Moisturising Cream","Apply on DAMP skin within 3 min of shower","var(--accent)"],["3","Aveeno Dermexa Lotion","Layer on arms + eczema-prone areas","var(--accent)"],["4","ReEquil Sunscreen","Face, neck, hands before going out","var(--accent)"],["5","Vaseline","Lips","var(--accent)"]].map(([n,product,action,c]) => (
                <div key={n as string} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: c as string, color: "white", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n as string}</div>
                  <div><p style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", margin: 0 }}>{product as string}</p><p style={{ fontSize: 12, color: "var(--text-faint)", margin: "2px 0 0" }}>{action as string}</p></div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>🌙 Night Routine (4 min)</h3>
              <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12 }}>Trigger: Immediately after 11:30 PM work calls end</p>
              {[["1","Cetaphil Gentle Cleanser","Remove sweat + pollution + sunscreen","#9B7EC8"],["2","CeraVe or Aveeno","Alternate each night — apply on damp skin","#9B7EC8"],["3","Vaseline","Lips","#9B7EC8"]].map(([n,product,action,c]) => (
                <div key={n as string} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: c as string, color: "white", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n as string}</div>
                  <div><p style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", margin: 0 }}>{product as string}</p><p style={{ fontSize: 12, color: "var(--text-faint)", margin: "2px 0 0" }}>{action as string}</p></div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 16, background: "rgba(232,196,90,0.08)", border: "1px solid rgba(232,196,90,0.3)" }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 8 }}>⚡ 2-Minute Minimum (bad days)</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 6px" }}><strong>Morning:</strong> Cool water splash → CeraVe → Sunscreen → Lips</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}><strong>Night:</strong> Water splash → CeraVe or Aveeno → Lips</p>
            </div>
          </div>
        )}

        {tab === "schedule" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)", marginBottom: 12 }}>Morning Block</h3>
              <Block time="6:30" text="Wake up — get light immediately" note="Window/balcony. No phone for 10 min." color="var(--accent)" />
              <Block time="6:35" text="Warm lemon water (500ml)" color="var(--accent)" />
              <Block time="6:45" text="Workout / Park Walk" note="45–50 min workout or 30–40 min walk" color="var(--green)" />
              <Block time="7:30" text="Shower immediately" note="Cool/lukewarm. Cetaphil bar." color="var(--accent)" />
              <Block time="7:40" text="Morning skincare (7 min)" color="var(--accent)" />
              <Block time="8:00" text="Breakfast" color="#E8C45A" />
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>Work Block</h3>
              <Block time="11:00" text="Work begins" />
              <Block time="1:00 PM" text="Lunch break (30–45 min)" color="#E8C45A" />
              <Block time="4:00 PM" text="Snack break (15 min)" color="#E8C45A" />
              <Block time="7:00 PM" text="Dinner — done by 7:30 PM" color="#E8C45A" />
              <Block time="8:00 PM" text="Evening work calls" />
              <Block time="11:30 PM" text="Work ends — hard stop" />
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "#9B7EC8", marginBottom: 12 }}>Wind-Down Block</h3>
              <Block time="11:30" text="Night skincare (5 min)" note="BEFORE opening any app" color="#9B7EC8" />
              <Block time="11:40" text="Dim lights + Night mode" color="#9B7EC8" />
              <Block time="11:50" text="No reels/social media" note="Music / podcast / book only" color="#9B7EC8" />
              <Block time="11:55" text="4-7-8 breathing in bed" color="var(--blue)" />
              <Block time="12:10" text="Lights off, phone outside room" color="var(--blue)" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
