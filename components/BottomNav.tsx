"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

const nav = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/habits", label: "Habits", icon: "✅" },
  { href: "/trackers", label: "Track", icon: "📊" },
  { href: "/plan", label: "Plan", icon: "📋" },
  { href: "/progress", label: "Progress", icon: "📈" },
  { href: "/profile", label: "Profile", icon: "⚖️" },
];

export default function BottomNav() {
  const path = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <nav style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "var(--nav-bg)", borderTop: "1px solid var(--nav-border)",
    }}>
      <div style={{ maxWidth: 512, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-around", padding: "6px 2px 10px", overflowX: "auto" }}>
        {nav.map(({ href, label, icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href);
          return (
            <Link key={href} href={href} style={{
              display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
              padding: "5px 8px", borderRadius: 10, flexShrink: 0,
              background: active ? "rgba(232,132,90,0.12)" : "transparent",
              textDecoration: "none",
            }}>
              <span style={{ fontSize: 18, lineHeight: 1 }}>{icon}</span>
              <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? "var(--accent)" : "var(--text-faint)", whiteSpace: "nowrap" }}>
                {label}
              </span>
            </Link>
          );
        })}
        <button onClick={toggle} style={{
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
          padding: "5px 8px", borderRadius: 10, background: "transparent",
          border: "none", cursor: "pointer", flexShrink: 0,
        }}>
          <span style={{ fontSize: 18, lineHeight: 1 }}>{theme === "dark" ? "☀️" : "🌙"}</span>
          <span style={{ fontSize: 9, fontWeight: 500, color: "var(--text-faint)" }}>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
      </div>
    </nav>
  );
}
