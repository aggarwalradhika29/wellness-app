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

const WARM_UP = "Warm-up indoors — 5 min (cold muscles need longer)";
const FINISH = "Skipping — 5 min, 30 sec on / 30 sec off";

const WORKOUT_A = [WARM_UP, "3 rounds: Squats — 12", "Incline push-ups — 8", "Resistance band rows — 12", "Glute bridges — 15", "Plank — 20–30 sec", FINISH];
const WORKOUT_B = [WARM_UP, "3 rounds: Reverse lunges — 10 each leg", "Dumbbell press — 12", "Dumbbell deadlifts — 12", "Band pull-aparts — 15", "Dead bugs — 8 each side", FINISH];

const WEEK = [
  { day: "Monday", type: "Workout A", color: "#6BAA75", exercises: WORKOUT_A },
  { day: "Tuesday", type: "Walk", color: "#5A8BE8", exercises: ["20-min walk after lunch", "Check AQI first. Above 200, walk indoors or use the stairs"] },
  { day: "Wednesday", type: "Workout B", color: "#E8845A", exercises: WORKOUT_B },
  { day: "Thursday", type: "Walk + Yoga", color: "#9B7EC8", exercises: ["20-min walk after lunch", "Yoga before bed: child's pose, cat-cow, legs-up-wall"] },
  { day: "Friday", type: "Workout A", color: "#6BAA75", exercises: WORKOUT_A },
  { day: "Saturday", type: "Walk", color: "#5A8BE8", exercises: ["20-min walk after lunch", "Check AQI first. Above 200, walk indoors or use the stairs"] },
  { day: "Sunday", type: "Rest", color: "#A09890", exercises: ["Full rest day", "Plan the week's meals", "Weekly average weight check"] },
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
        <p style={{ color: "var(--text-faint)", fontSize: 13 }}>Gurgaon • Winter 2026–27</p>
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
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 8 }}>This Winter</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7, margin: 0 }}>Dry air, heaters, smog and short days all push you indoors and off routine. <strong style={{ color: "var(--text)" }}>The goal is simple: move, protect your skin, and keep logging.</strong> Target: 64.3 kg by Dec 31.</p>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Your 3 Non-Negotiables</h3>
              {[["Moisturise within 3 min of every shower", "var(--green)"],["Workout Mon, Wed, Fri at 9 AM — indoors", "var(--accent)"],["Weigh in 3–4 mornings a week", "var(--blue)"]].map(([text, color], i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: color, color: "white", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i+1}</div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", paddingTop: 3 }}>{text}</span>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Winter Eczema Triggers</h3>
              {[["🌬️","Cold, dry air","Pulls moisture out of your skin"],["🔥","Room heaters","Dry the air indoors. Keep some distance from them"],["🚿","Long, hot showers","Strip the skin barrier. Keep them short and lukewarm"],["🧶","Wool on bare skin","Wear a soft cotton layer underneath"],["😴","Poor sleep and stress","Can make flares and itching worse"]].map(([icon,title,desc]) => (
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
              <p style={{ color: "#8BB8E8", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", margin: "0 0 8px" }}>Winter Target</p>
              <p style={{ color: "#C8D8E8", fontSize: 13, lineHeight: 1.6, margin: 0 }}>Sleep at <strong style={{ color: "white" }}>1:00 AM</strong>, wake at <strong style={{ color: "white" }}>8:30 AM</strong>. Keep the wake time steady, even on cold mornings.</p>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Evening Wind-Down</h3>
              <Block time="11:30" text="Work ends — hard stop" color="var(--text-faint)" />
              <Block time="12:00" text="Laptop down, night skincare" note="Do this before relaxing, so it doesn't get skipped" color="#9B7EC8" />
              <Block time="12:05" text="OTT wind-down" note="Protected time, not optional" color="#9B7EC8" />
              <Block time="12:55" text="Phone outside the bedroom" color="var(--blue)" />
              <Block time="1:00" text="Lights off, 4-7-8 breathing" note="Inhale 4s, hold 7s, exhale 8s. Repeat 4–6x." color="var(--blue)" />
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 10 }}>Cold-Weather Sleep</h3>
              {[["Heater","Warm the room before bed, then switch it off. It dries your skin and the air overnight"],["Bedding","Cotton sheets, with a layer between skin and any wool blanket"],["Air","A clean humidifier can help if your room feels very dry"],["Morning light","Open the curtains on waking. Get outside around midday when it's clearer"],["Warm drink","Chamomile tea or haldi milk, not a late chai"]].map(([item,desc]) => (
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
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, margin: 0 }}>Your workouts are all indoors, so fog and smog can't cancel them. <strong>Consistency beats intensity.</strong> Add 1–2 reps each week.</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="card" style={{ padding: 14, textAlign: "center" }}>
                <p style={{ color: "var(--text-faint)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", margin: "0 0 4px" }}>Workout</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: "var(--accent)", margin: 0 }}>9:00–9:40 AM</p>
                <p style={{ fontSize: 10, color: "var(--text-faint)", margin: "2px 0 0" }}>Mon, Wed, Fri</p>
              </div>
              <div className="card" style={{ padding: 14, textAlign: "center" }}>
                <p style={{ color: "var(--text-faint)", fontSize: 10, fontWeight: 700, textTransform: "uppercase", margin: "0 0 4px" }}>Walk</p>
                <p style={{ fontSize: 18, fontWeight: 900, color: "var(--blue)", margin: 0 }}>After lunch</p>
                <p style={{ fontSize: 10, color: "var(--text-faint)", margin: "2px 0 0" }}>Tue, Thu, Sat</p>
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
                { time:"8:45",icon:"🫖",label:"Wake-up",text:"Warm water"},
                { time:"10:00",icon:"🥣",label:"Breakfast",text:"Chai + 1 parantha + curd. Swap in moong chilla or sprouts on some days"},
                { time:"1:30 PM",icon:"🍛",label:"Lunch",text:"Dal, chana or paneer first, then sabzi + salad, then 1–2 rotis or a little rice, plus dahi. Walk after"},
                { time:"5:00 PM",icon:"☕",label:"Snack",text:"Chai with less sugar + roasted chana, guava or an orange"},
                { time:"7:30 PM",icon:"🍲",label:"Dinner",text:"Same plate, a little lighter. Soup first if you're hungry. Done by 8 PM"},
                { time:"Late",icon:"🥛",label:"Optional",text:"Chamomile tea or haldi milk. Nothing to eat after 10 PM"},
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
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 12 }}>Winter Food</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <p style={{ color: "var(--green)", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✓ Eat More</p>
                  {["Palak, methi, sarson","Matar, gajar, mooli","Amla, oranges, guava","Sweet potato","Dal and veg soups","Curd, paneer, sprouts"].map(i => <p key={i} style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 4px" }}>+ {i}</p>)}
                </div>
                <div>
                  <p style={{ color: "#E05050", fontWeight: 700, fontSize: 12, marginBottom: 8 }}>✗ Keep Small</p>
                  {["Gajar halwa, gajak","Pakoras, samosas","Extra ghee on paranthas","Peanuts by the bowl","Sugary chai","Wedding-buffet seconds"].map(i => <p key={i} style={{ fontSize: 12, color: "var(--text-muted)", margin: "0 0 4px" }}>− {i}</p>)}
                </div>
              </div>
            </div>
            <div className="card" style={{ padding: 16, background: "rgba(232,196,90,0.08)", border: "1px solid rgba(232,196,90,0.3)" }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 8 }}>Planned Treats</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>One serving of Maggi, or anything fried or maida-based, on <strong>Wed and Sat</strong>. Decide in advance, and keep less of it in the house.</p>
            </div>
          </div>
        )}

        {tab === "skincare" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ padding: 16, border: "1px solid rgba(232,132,90,0.3)", background: "rgba(232,132,90,0.05)" }}>
              <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.7, margin: 0 }}>Winter makes eczema easier to trigger. Your products are fine, so the job is <strong>using them every day, not only when skin flares</strong>.</p>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>🌅 Morning Routine (7 min)</h3>
              <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12 }}>Trigger: Your morning shower</p>
              {[["1","Aveeno Daily Moisturising Body Wash","Body, in a short 5–10 min lukewarm shower","var(--accent)"],["2","Cetaphil Gentle Cleanser","Face, with lukewarm water. Pat dry, don't rub","var(--accent)"],["3","CeraVe Moisturising Cream","Apply on DAMP skin within 3 min of shower","var(--accent)"],["4","Aveeno Dermexa Lotion","Layer on arms + eczema-prone areas","var(--accent)"],["5","ReEquil Sunscreen","Face, neck and hands before going out, even on foggy days","var(--accent)"],["6","Vaseline","Lips","var(--accent)"]].map(([n,product,action,c]) => (
                <div key={n as string} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: c as string, color: "white", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n as string}</div>
                  <div><p style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", margin: 0 }}>{product as string}</p><p style={{ fontSize: 12, color: "var(--text-faint)", margin: "2px 0 0" }}>{action as string}</p></div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>🌙 Night Routine (4 min)</h3>
              <p style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 12 }}>Trigger: When the laptop goes down at midnight</p>
              {[["1","Cetaphil Gentle Cleanser","Remove pollution + sunscreen. Lukewarm water","#9B7EC8"],["2","CeraVe or Aveeno","Alternate each night, on slightly damp skin","#9B7EC8"],["3","Vaseline","Lips, plus a thin layer over very dry patches","#9B7EC8"]].map(([n,product,action,c]) => (
                <div key={n as string} style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: c as string, color: "white", fontWeight: 900, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n as string}</div>
                  <div><p style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", margin: 0 }}>{product as string}</p><p style={{ fontSize: 12, color: "var(--text-faint)", margin: "2px 0 0" }}>{action as string}</p></div>
                </div>
              ))}
            </div>
            <div className="card" style={{ padding: 16, background: "rgba(232,196,90,0.08)", border: "1px solid rgba(232,196,90,0.3)" }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 8 }}>⚡ 2-Minute Minimum (bad days)</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 6px" }}><strong>Morning:</strong> Lukewarm splash → CeraVe → Sunscreen if going out → Lips</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}><strong>Night:</strong> Lukewarm splash → CeraVe or Aveeno → Lips</p>
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 10 }}>All Day</h3>
              {["Moisturise your hands after washing them","Reapply CeraVe to dry spots at midday","Wear soft cotton under wool and on your neck","Stay a little back from the heater","Wash with lukewarm water, even when it's freezing"].map(i => (
                <p key={i} style={{ fontSize: 13, color: "var(--text-muted)", margin: "0 0 6px" }}>→ {i}</p>
              ))}
              <p style={{ fontSize: 12, color: "var(--text-faint)", margin: "10px 0 0", lineHeight: 1.6 }}>See a doctor if skin cracks, oozes or spreads, or if itching keeps you awake. Keep using any prescribed treatment as directed.</p>
            </div>
          </div>
        )}

        {tab === "schedule" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)", marginBottom: 12 }}>Morning Block</h3>
              <Block time="8:30" text="Wake up, open the curtains" note="No phone for 10 min. Warm water." color="var(--accent)" />
              <Block time="9:00" text="Workout (Mon, Wed, Fri)" note="Other days: an easy start or extra prep" color="var(--green)" />
              <Block time="9:40" text="Lukewarm shower + skincare" note="Moisturise within 3 min" color="var(--accent)" />
              <Block time="10:00" text="Breakfast" color="#E8C45A" />
              <Block time="10:15" text="Job search prep — 1 hour" note="One specific thing" color="var(--accent)" />
              <Block time="11:15" text="R&D reading and deep work" color="var(--accent)" />
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "var(--text-muted)", marginBottom: 12 }}>Work Block</h3>
              <Block time="12:00" text="Oddr work begins" />
              <Block time="1:30 PM" text="Lunch" note="Walk after on Tue, Thu, Sat" color="#E8C45A" />
              <Block time="5:00 PM" text="Chai + snack" color="#E8C45A" />
              <Block time="6:30 PM" text="Break — stretch, get outside if AQI allows" color="var(--green)" />
              <Block time="7:30 PM" text="Dinner — done by 8 PM" color="#E8C45A" />
              <Block time="8:30 PM" text="Evening Oddr work" />
              <Block time="11:30 PM" text="Work ends — hard stop" />
            </div>
            <div className="card" style={{ padding: 16 }}>
              <h3 style={{ fontWeight: 700, fontSize: 14, color: "#9B7EC8", marginBottom: 12 }}>Wind-Down Block</h3>
              <Block time="12:00" text="Laptop down, night skincare" color="#9B7EC8" />
              <Block time="12:05" text="OTT wind-down" color="#9B7EC8" />
              <Block time="12:55" text="Phone outside the bedroom" color="var(--blue)" />
              <Block time="1:00" text="Lights off" color="var(--blue)" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
