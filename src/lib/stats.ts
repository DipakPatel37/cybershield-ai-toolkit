// Lightweight localStorage-backed stats for the CyberShield dashboard.
export type StatKey =
  | "totalScans"
  | "malwareFiles"
  | "safeFiles"
  | "phishingChecks"
  | "passwordTests"
  | "encryptionOps";

const KEY = "cybershield_stats_v1";
const HISTORY_KEY = "cybershield_history_v1";

export interface Stats {
  totalScans: number;
  malwareFiles: number;
  safeFiles: number;
  phishingChecks: number;
  passwordTests: number;
  encryptionOps: number;
}

export interface HistoryEntry {
  id: string;
  tool: "malware" | "phishing" | "password" | "encryption";
  label: string;
  status: "safe" | "warning" | "danger" | "info";
  detail: string;
  timestamp: number;
}

const defaults: Stats = {
  totalScans: 0,
  malwareFiles: 0,
  safeFiles: 0,
  phishingChecks: 0,
  passwordTests: 0,
  encryptionOps: 0,
};

export function getStats(): Stats {
  if (typeof window === "undefined") return defaults;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
  } catch {
    return defaults;
  }
}

export function bumpStat(key: StatKey, by = 1) {
  if (typeof window === "undefined") return;
  const s = getStats();
  s[key] += by;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("cybershield:stats"));
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addHistory(entry: Omit<HistoryEntry, "id" | "timestamp">) {
  if (typeof window === "undefined") return;
  const list = getHistory();
  list.unshift({ ...entry, id: crypto.randomUUID(), timestamp: Date.now() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list.slice(0, 50)));
  window.dispatchEvent(new Event("cybershield:history"));
}
