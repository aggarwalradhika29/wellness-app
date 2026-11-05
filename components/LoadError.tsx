"use client";

export default function LoadError({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ padding: "48px 16px" }}>
      <div className="card" style={{ padding: 24, textAlign: "center" }}>
        <p style={{ fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Couldn&apos;t load your data</p>
        <p style={{ fontSize: 13, color: "var(--text-faint)", marginBottom: 16 }}>Check your connection and try again.</p>
        <button onClick={onRetry} style={{
          background: "var(--accent)", color: "white", fontWeight: 700, padding: "10px 20px",
          borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14,
        }}>Try again</button>
      </div>
    </div>
  );
}
