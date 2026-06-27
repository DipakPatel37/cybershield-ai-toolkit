import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { KeyRound, Eye, EyeOff, Check, X } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { bumpStat, addHistory } from "@/lib/stats";

export const Route = createFileRoute("/tools/password")({
  head: () => ({ meta: [{ title: "Password Strength — CyberShield AI" }, { name: "description", content: "Real-time entropy, crack-time, and character analysis for passwords." }] }),
  component: PasswordPage,
});

function analyze(pw: string) {
  const length = pw.length;
  const upper = /[A-Z]/.test(pw);
  const lower = /[a-z]/.test(pw);
  const digit = /\d/.test(pw);
  const symbol = /[^A-Za-z0-9]/.test(pw);
  let pool = 0;
  if (upper) pool += 26;
  if (lower) pool += 26;
  if (digit) pool += 10;
  if (symbol) pool += 32;
  const entropy = length === 0 ? 0 : Math.round(length * Math.log2(pool || 1) * 10) / 10;

  // 1e10 guesses/sec offline GPU estimate
  const guesses = Math.pow(2, entropy) / 2;
  const seconds = guesses / 1e10;
  const crack = formatTime(seconds);

  const strength = Math.min(100, Math.round((entropy / 80) * 100));
  const band =
    entropy < 28 ? { label: "Very weak", color: "text-destructive", bg: "bg-destructive" } :
    entropy < 40 ? { label: "Weak", color: "text-warning", bg: "bg-warning" } :
    entropy < 60 ? { label: "Decent", color: "text-primary", bg: "bg-primary" } :
    entropy < 80 ? { label: "Strong", color: "text-accent", bg: "bg-accent" } :
                   { label: "Excellent", color: "text-accent", bg: "bg-accent" };

  const suggestions: string[] = [];
  if (length < 12) suggestions.push("Increase length to at least 12 characters");
  if (!upper) suggestions.push("Add UPPERCASE letters");
  if (!lower) suggestions.push("Add lowercase letters");
  if (!digit) suggestions.push("Add numbers");
  if (!symbol) suggestions.push("Add special symbols (e.g. !@#$%)");
  if (/^(.)\1+$/.test(pw)) suggestions.push("Avoid repeating a single character");
  if (/^(password|qwerty|admin|letmein|welcome|123456)/i.test(pw)) suggestions.push("Avoid common dictionary words");

  return { length, upper, lower, digit, symbol, entropy, crack, strength, band, suggestions };
}

function formatTime(s: number) {
  if (s < 1) return "instant";
  const units: [number, string][] = [
    [60, "seconds"], [60, "minutes"], [24, "hours"], [365, "days"], [100, "years"], [10, "centuries"], [10, "millennia"],
  ];
  let v = s, name = "seconds";
  for (const [div, n] of units) {
    if (v < div) { name = n; break; }
    v /= div; name = n;
  }
  return `${v < 10 ? v.toFixed(1) : Math.round(v).toLocaleString()} ${name}`;
}

function PasswordPage() {
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const a = useMemo(() => analyze(pw), [pw]);

  // Debounced stats bump (only counts meaningful tests)
  useEffect(() => {
    if (pw.length < 4) return;
    const t = setTimeout(() => {
      bumpStat("passwordTests");
      addHistory({
        tool: "password", label: `Tested ${pw.length} chars`,
        status: a.entropy < 40 ? "danger" : a.entropy < 60 ? "warning" : "safe",
        detail: `${a.band.label} · ${a.entropy} bits entropy`,
      });
    }, 1500);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pw]);

  const checks = [
    { ok: a.length >= 12, label: "12+ characters" },
    { ok: a.upper, label: "Uppercase letter" },
    { ok: a.lower, label: "Lowercase letter" },
    { ok: a.digit, label: "Number" },
    { ok: a.symbol, label: "Special symbol" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader icon={KeyRound} eyebrow="Tool 03" title="Password Strength Analyzer" description="Type a password to see live entropy, character breakdown and an estimated offline crack time. Your password never leaves your browser." />

      <div className="glass rounded-2xl p-6">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Password</label>
        <div className="mt-2 relative">
          <input
            type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)}
            placeholder="Try something memorable…"
            className="w-full bg-input/60 border border-border rounded-lg px-4 py-3 pr-12 font-mono focus:outline-none focus:border-primary focus:shadow-neon transition"
          />
          <button onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* Strength bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs font-mono mb-1">
            <span className={a.band.color}>{a.band.label}</span>
            <span className="text-muted-foreground">{a.strength}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div className={`h-full ${a.band.bg} transition-all duration-500`} style={{ width: `${a.strength}%` }} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Metric label="Entropy" value={`${a.entropy} bits`} />
        <Metric label="Crack time (GPU)" value={a.crack} />
        <Metric label="Length" value={`${a.length}`} />
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Character classes</div>
          <ul className="space-y-2">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center gap-3 text-sm">
                {c.ok ? <Check className="h-4 w-4 text-accent" /> : <X className="h-4 w-4 text-destructive" />}
                <span className={c.ok ? "" : "text-muted-foreground"}>{c.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Suggestions</div>
          {a.suggestions.length === 0 ? (
            <div className="text-sm neon-text-green">Looks excellent. No suggestions.</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {a.suggestions.map((s, i) => <li key={i} className="flex gap-2"><span className="text-primary">›</span>{s}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-xl p-5">
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-2xl font-bold gradient-text mt-1">{value}</div>
    </div>
  );
}
