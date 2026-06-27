import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LayoutDashboard, FileSearch, Globe, KeyRound, Lock, ShieldCheck, ShieldAlert, Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { getStats, getHistory, type Stats, type HistoryEntry } from "@/lib/stats";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — CyberShield AI" }, { name: "description", content: "Live overview of your CyberShield activity: scans, threats, password tests and encryption operations." }] }),
  component: DashboardPage,
});

function useStats(): [Stats, HistoryEntry[]] {
  const [s, setS] = useState<Stats>(() => getStats());
  const [h, setH] = useState<HistoryEntry[]>(() => getHistory());
  useEffect(() => {
    const update = () => { setS(getStats()); setH(getHistory()); };
    update();
    window.addEventListener("cybershield:stats", update);
    window.addEventListener("cybershield:history", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("cybershield:stats", update);
      window.removeEventListener("cybershield:history", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return [s, h];
}

function DashboardPage() {
  const [s, history] = useStats();

  const tiles = [
    { label: "Total scans", value: s.totalScans, Icon: Activity, color: "text-primary" },
    { label: "Malware/suspicious", value: s.malwareFiles, Icon: ShieldAlert, color: "text-destructive" },
    { label: "Safe files", value: s.safeFiles, Icon: ShieldCheck, color: "text-accent" },
    { label: "Phishing checks", value: s.phishingChecks, Icon: Globe, color: "text-primary" },
    { label: "Password tests", value: s.passwordTests, Icon: KeyRound, color: "text-accent" },
    { label: "Encryption ops", value: s.encryptionOps, Icon: Lock, color: "text-primary" },
  ];

  const barData = [
    { label: "Malware", value: s.malwareFiles, color: "var(--danger)" },
    { label: "Safe", value: s.safeFiles, color: "var(--success)" },
    { label: "Phishing", value: s.phishingChecks, color: "var(--neon-cyan)" },
    { label: "Passwords", value: s.passwordTests, color: "var(--neon-green)" },
    { label: "Encryption", value: s.encryptionOps, color: "var(--neon-pink)" },
  ];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader icon={LayoutDashboard} eyebrow="Command center" title="Security dashboard" description="Live activity from this device. Stats are stored locally — clear your browser data to reset." />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {tiles.map((t, i) => (
          <div key={t.label} className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-primary/50 transition animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition" />
            <div className="relative flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">{t.label}</div>
                <div className="font-display text-4xl font-bold mt-2 gradient-text">{t.value.toLocaleString()}</div>
              </div>
              <t.Icon className={`h-6 w-6 ${t.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 mb-6">
        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg">Activity overview</h2>
            <div className="text-xs font-mono text-muted-foreground">last 50 events</div>
          </div>
          <BarChart data={barData} />
        </div>
        <div className="glass rounded-2xl p-6">
          <h2 className="font-display font-bold text-lg mb-4">Threat distribution</h2>
          <Donut malware={s.malwareFiles} safe={s.safeFiles} />
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-lg">Recent activity</h2>
          <span className="text-xs font-mono text-muted-foreground">{history.length} entries</span>
        </div>
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No activity yet — run a tool to populate your dashboard.
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {history.slice(0, 12).map((e) => <HistoryRow key={e.id} e={e} />)}
          </ul>
        )}
      </div>
    </div>
  );
}

const TOOL_ICON = { malware: FileSearch, phishing: Globe, password: KeyRound, encryption: Lock };
const STATUS_COLOR = { safe: "text-accent", warning: "text-warning", danger: "text-destructive", info: "text-primary" };

function HistoryRow({ e }: { e: HistoryEntry }) {
  const Icon = TOOL_ICON[e.tool];
  return (
    <li className="py-3 flex items-center gap-4">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center"><Icon className="h-4 w-4 text-primary" /></div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{e.label}</div>
        <div className="text-xs text-muted-foreground font-mono truncate">{e.detail}</div>
      </div>
      <div className={`text-xs uppercase tracking-widest font-mono ${STATUS_COLOR[e.status]}`}>{e.status}</div>
      <div className="text-xs text-muted-foreground hidden sm:block">{new Date(e.timestamp).toLocaleTimeString()}</div>
    </li>
  );
}

function BarChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="flex items-end justify-between gap-3 h-56">
      {data.map((d) => {
        const h = (d.value / max) * 100;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            <div className="text-xs font-mono text-muted-foreground">{d.value}</div>
            <div className="w-full flex-1 rounded-t-lg relative overflow-hidden bg-muted/40">
              <div className="absolute bottom-0 left-0 right-0 rounded-t-lg transition-all duration-700"
                style={{ height: `${h}%`, background: `linear-gradient(to top, ${d.color}, transparent)`, boxShadow: `0 0 20px ${d.color}` }} />
            </div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground truncate w-full text-center">{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function Donut({ malware, safe }: { malware: number; safe: number }) {
  const total = malware + safe || 1;
  const r = 60, c = 2 * Math.PI * r;
  const malwarePart = (malware / total) * c;
  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 160 160" className="w-40 h-40 -rotate-90">
        <circle cx="80" cy="80" r={r} fill="none" stroke="oklch(0.3 0.04 230 / 0.4)" strokeWidth="18" />
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--success)" strokeWidth="18"
          strokeDasharray={`${c - malwarePart} ${c}`} strokeDashoffset={-malwarePart}
          style={{ filter: "drop-shadow(0 0 8px var(--success))", transition: "stroke-dasharray 0.6s" }} />
        <circle cx="80" cy="80" r={r} fill="none" stroke="var(--danger)" strokeWidth="18"
          strokeDasharray={`${malwarePart} ${c}`}
          style={{ filter: "drop-shadow(0 0 8px var(--danger))", transition: "stroke-dasharray 0.6s" }} />
      </svg>
      <div className="space-y-3 text-sm">
        <Legend dot="var(--success)" label="Safe" value={safe} />
        <Legend dot="var(--danger)" label="Threats" value={malware} />
      </div>
    </div>
  );
}
function Legend({ dot, label, value }: { dot: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-3 w-3 rounded-full" style={{ background: dot, boxShadow: `0 0 8px ${dot}` }} />
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <span className="font-display font-bold">{value}</span>
    </div>
  );
}
