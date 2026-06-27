import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, Search, ShieldAlert, ShieldCheck, ShieldX } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { bumpStat, addHistory } from "@/lib/stats";

export const Route = createFileRoute("/tools/phishing")({
  head: () => ({ meta: [{ title: "Phishing URL Detection — CyberShield AI" }, { name: "description", content: "Heuristic risk analysis for suspicious URLs." }] }),
  component: PhishingPage,
});

const PHISH_KEYWORDS = ["login", "verify", "secure", "account", "update", "bank", "wallet", "confirm", "signin", "support", "billing", "free", "gift", "bonus"];

interface Analysis {
  url: string;
  score: number; // 0-100, higher = riskier
  band: "safe" | "medium" | "danger";
  checks: { ok: boolean; label: string; detail: string }[];
  recs: string[];
}

function analyze(input: string): Analysis | null {
  let u: URL;
  try { u = new URL(input.startsWith("http") ? input : "http://" + input); } catch { return null; }
  const host = u.hostname;
  const checks: Analysis["checks"] = [];
  let score = 0;
  const recs: string[] = [];

  const https = u.protocol === "https:";
  checks.push({ ok: https, label: "HTTPS encrypted", detail: https ? "TLS in use" : "Plain HTTP — credentials would be sent in clear" });
  if (!https) { score += 25; recs.push("Avoid sending credentials to non-HTTPS sites."); }

  const ipHost = /^(\d{1,3}\.){3}\d{1,3}$/.test(host);
  checks.push({ ok: !ipHost, label: "Hostname is a domain", detail: ipHost ? "IP address used as host" : "Domain name used" });
  if (ipHost) { score += 25; recs.push("Legitimate brands rarely use raw IPs."); }

  const longUrl = input.length > 75;
  checks.push({ ok: !longUrl, label: "Reasonable URL length", detail: `${input.length} chars` });
  if (longUrl) { score += 10; recs.push("Long URLs often hide redirects or payloads."); }

  const suspiciousChars = /[@%]|--/.test(input);
  checks.push({ ok: !suspiciousChars, label: "No suspicious symbols", detail: suspiciousChars ? "Contains @, %, or --" : "Clean character set" });
  if (suspiciousChars) { score += 15; recs.push("@ symbols can mask the real destination."); }

  const subs = host.split(".").length - 2;
  const tooManySubs = subs > 2;
  checks.push({ ok: !tooManySubs, label: "Few subdomains", detail: `${Math.max(0, subs)} subdomain(s)` });
  if (tooManySubs) { score += 15; recs.push("Excessive subdomains can imitate trusted brands."); }

  const matchedKw = PHISH_KEYWORDS.filter((k) => input.toLowerCase().includes(k));
  checks.push({ ok: matchedKw.length === 0, label: "No phishing keywords", detail: matchedKw.length ? `Matches: ${matchedKw.join(", ")}` : "Clean vocabulary" });
  if (matchedKw.length > 0) { score += Math.min(20, matchedKw.length * 8); recs.push("Watch for urgency words: verify, confirm, login."); }

  score = Math.min(100, score);
  const band: Analysis["band"] = score >= 55 ? "danger" : score >= 25 ? "medium" : "safe";
  if (band === "safe" && recs.length === 0) recs.push("Looks clean — but still verify the domain in your address bar.");

  return { url: u.toString(), score, band, checks, recs };
}

function PhishingPage() {
  const [url, setUrl] = useState("");
  const [a, setA] = useState<Analysis | null>(null);
  const [err, setErr] = useState("");

  const onCheck = () => {
    setErr("");
    if (!url.trim()) { setErr("Enter a URL to analyze."); return; }
    const res = analyze(url.trim());
    if (!res) { setErr("That doesn't look like a valid URL."); return; }
    setA(res);
    bumpStat("phishingChecks");
    addHistory({
      tool: "phishing", label: res.url.slice(0, 60),
      status: res.band === "safe" ? "safe" : res.band === "medium" ? "warning" : "danger",
      detail: `Risk score ${res.score}/100`,
    });
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader icon={Globe} eyebrow="Tool 02" title="Phishing URL Detection" description="Paste any URL. We run heuristic checks (HTTPS, IP host, length, symbols, subdomains, keywords) and assign a risk score." />

      <div className="glass rounded-2xl p-6">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">URL</label>
        <div className="mt-2 flex flex-wrap gap-3">
          <input
            value={url} onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onCheck()}
            placeholder="https://example.com/login"
            className="flex-1 min-w-[260px] bg-input/60 border border-border rounded-lg px-4 py-3 font-mono text-sm focus:outline-none focus:border-primary focus:shadow-neon transition"
          />
          <button onClick={onCheck} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
            <Search className="h-4 w-4" /> Analyze
          </button>
        </div>
        {err && <div className="mt-3 text-sm text-destructive">{err}</div>}
      </div>

      {a && <Result a={a} />}
    </div>
  );
}

function Result({ a }: { a: Analysis }) {
  const cfg = {
    safe:   { label: "Safe", color: "var(--success)", text: "text-accent", Icon: ShieldCheck },
    medium: { label: "Medium risk", color: "var(--warning)", text: "text-warning", Icon: ShieldAlert },
    danger: { label: "Dangerous", color: "var(--danger)", text: "text-destructive", Icon: ShieldX },
  }[a.band];

  return (
    <div className="mt-8 grid md:grid-cols-[280px_1fr] gap-6 animate-fade-up">
      {/* Gauge */}
      <div className="glass-strong rounded-2xl p-6 text-center">
        <Gauge value={a.score} color={cfg.color} />
        <div className={`mt-4 font-display text-xl font-bold ${cfg.text} flex items-center justify-center gap-2`}>
          <cfg.Icon className="h-5 w-5" /> {cfg.label}
        </div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">Risk score</div>
      </div>

      {/* Checks + recs */}
      <div className="space-y-6">
        <div className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Indicators</div>
          <ul className="space-y-2">
            {a.checks.map((c, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <span className={`mt-1 inline-block h-2 w-2 rounded-full ${c.ok ? "bg-accent shadow-neon-green" : "bg-destructive"}`} />
                <div className="flex-1">
                  <div className="font-medium">{c.label}</div>
                  <div className="text-xs text-muted-foreground font-mono">{c.detail}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Recommendations</div>
          <ul className="space-y-2 text-sm">
            {a.recs.map((r, i) => <li key={i} className="flex gap-2"><span className="text-primary">›</span>{r}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Gauge({ value, color }: { value: number; color: string }) {
  const r = 70, c = Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-48 h-28 mx-auto">
      <svg viewBox="0 0 180 100" className="w-full">
        <path d={`M 20 90 A ${r} ${r} 0 0 1 160 90`} fill="none" stroke="oklch(0.3 0.04 230 / 0.4)" strokeWidth="14" strokeLinecap="round" />
        <path
          d={`M 20 90 A ${r} ${r} 0 0 1 160 90`}
          fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.2,.8,.2,1)", filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <div className="font-display text-4xl font-bold">{value}</div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</div>
      </div>
    </div>
  );
}
