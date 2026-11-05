"use client";
import { FormEvent, ReactNode, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { importLocalData } from "@/lib/db";

const input = {
  width: "100%", padding: 12, borderRadius: 12, fontSize: 14, marginBottom: 10,
  background: "var(--bg2)", color: "var(--text)", border: "1px solid var(--card-border)",
};

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setBusy(false);
  }

  return (
    <main className="max-w-lg mx-auto" style={{ padding: "64px 16px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--text)", marginBottom: 4 }}>Wellness</h1>
      <p style={{ color: "var(--text-faint)", fontSize: 13, marginBottom: 24 }}>Sign in to your tracker</p>
      <form onSubmit={submit} className="card" style={{ padding: 16 }}>
        <input style={input} type="email" required autoComplete="username" placeholder="Email"
          aria-label="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={input} type="password" required autoComplete="current-password" placeholder="Password"
          aria-label="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <p role="alert" style={{ color: "#E05050", fontSize: 13, marginBottom: 10 }}>{error}</p>}
        <button type="submit" disabled={busy} style={{
          width: "100%", background: "var(--accent)", color: "white", fontWeight: 700,
          padding: 12, borderRadius: 12, border: "none", cursor: "pointer", fontSize: 14,
        }}>{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

export default function AuthGate({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id;
  useEffect(() => {
    if (!userId) { setReady(false); return; }
    importLocalData()
      .then(n => { if (n) setNotice(`Found ${n} old entries in this browser and added any that were missing.`); })
      .catch(() => setNotice("Couldn't copy old entries from this browser. It will try again next time."))
      .finally(() => setReady(true));
  }, [userId]);

  // Pages let failed loads and saves reject, so they all surface here.
  useEffect(() => {
    const onFail = () => setNotice("Something didn't load or save. Check your connection and try again.");
    window.addEventListener("unhandledrejection", onFail);
    return () => window.removeEventListener("unhandledrejection", onFail);
  }, []);

  if (session === undefined) return null;
  if (!session) return <Login />;
  if (!ready) return null;

  return (
    <>
      {notice && (
        <button onClick={() => setNotice("")} role="status" style={{
          position: "fixed", top: 12, left: 16, right: 16, zIndex: 60, maxWidth: 480, margin: "0 auto",
          padding: "10px 14px", borderRadius: 12, fontSize: 13, textAlign: "left", cursor: "pointer",
          background: "var(--card)", color: "var(--text)", border: "1px solid var(--accent)",
        }}>{notice}</button>
      )}
      {children}
    </>
  );
}
