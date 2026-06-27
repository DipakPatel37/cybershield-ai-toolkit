import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Shield, FileSearch, Globe, KeyRound, Lock, Zap, Eye, Cpu,
  ArrowRight, Sparkles, Activity, Server, ChevronDown,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CyberShield AI — Modern Cybersecurity Toolkit" },
      { name: "description", content: "Premium cyber-themed toolkit with malware hash scans, phishing URL detection, password strength analysis and AES file encryption." },
      { property: "og:title", content: "CyberShield AI — Modern Cybersecurity Toolkit" },
      { property: "og:description", content: "Premium cyber-themed toolkit with malware, phishing, password and encryption tools." },
    ],
  }),
  component: Home,
});

const features = [
  { icon: FileSearch, title: "Malware Hash Scan", desc: "SHA-256 file fingerprinting with heuristic reputation indicators.", to: "/tools/malware", color: "text-primary" },
  { icon: Globe, title: "Phishing URL Detection", desc: "Analyze URLs for HTTPS, IP-as-host, length, suspicious tokens and subdomain abuse.", to: "/tools/phishing", color: "text-accent" },
  { icon: KeyRound, title: "Password Strength", desc: "Real-time entropy, character analysis, and crack-time estimation.", to: "/tools/password", color: "text-primary" },
  { icon: Lock, title: "AES File Encryption", desc: "Encrypt and decrypt files locally with AES-GCM via the Web Crypto API.", to: "/tools/encrypt", color: "text-accent" },
];

const stats = [
  { value: "256-bit", label: "AES Encryption", icon: Lock },
  { value: "100%", label: "Client-side", icon: Cpu },
  { value: "0ms", label: "Server upload", icon: Zap },
  { value: "24/7", label: "Always available", icon: Activity },
];

const whyUs = [
  { icon: Eye, title: "Zero data leaks", text: "Files never leave your browser. Hashing, encryption and analysis all happen on-device." },
  { icon: Sparkles, title: "Premium UX", text: "Glassmorphism cards, neon accents, smooth motion and a dashboard built for analysts." },
  { icon: Server, title: "No backend required", text: "Powered entirely by the Web Crypto API. No accounts, no tracking, no upload." },
];

const faqs = [
  { q: "Is my data sent to a server?", a: "No. Every operation — hashing, encryption, URL analysis — runs locally in your browser using the Web Crypto API." },
  { q: "What encryption is used?", a: "AES-GCM 256-bit via the standards-based Web Crypto API. Keys are exported as base64 for you to store securely." },
  { q: "How accurate is the phishing detector?", a: "It's a heuristic risk score based on URL structure (HTTPS, IP, length, tokens, subdomains). Always combine with judgment." },
  { q: "Can I use this commercially?", a: "Yes. CyberShield AI is built as a learning toolkit and reference for security-aware UX." },
];

function Home() {
  return (
    <div className="min-h-screen">
      {/* HERO */}
      <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 cyber-grid opacity-30" />
        <div className="max-w-6xl mx-auto text-center animate-fade-up">
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.25em] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="text-muted-foreground">Live secure session</span>
          </div>

          <h1 className="font-display font-bold text-5xl md:text-7xl leading-[1.05] mb-6">
            <span className="block">Defend the</span>
            <span className="block gradient-text">digital perimeter.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            CyberShield AI is a futuristic browser-native security toolkit. Hash files, detect phishing URLs,
            audit passwords and encrypt secrets — without trusting a single server.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/dashboard" className="group relative inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:scale-105 animate-pulse-glow">
              Enter Dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/tools/malware" className="inline-flex items-center gap-2 glass rounded-lg px-6 py-3 text-sm font-semibold hover:border-primary/50 transition">
              Run a scan
            </Link>
          </div>

          {/* Floating shield illustration */}
          <div className="relative mx-auto mt-16 w-48 h-48 animate-float">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse-glow" />
            <div className="absolute inset-4 rounded-full border border-primary/40 animate-spin-slow" />
            <div className="absolute inset-8 rounded-full border border-accent/30 animate-spin-slow" style={{ animationDirection: "reverse" }} />
            <Shield className="absolute inset-0 m-auto h-20 w-20 text-primary drop-shadow-[0_0_15px_var(--neon-cyan)]" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div key={s.label} className="glass rounded-xl p-6 text-center animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <s.icon className="h-5 w-5 mx-auto mb-3 text-primary" />
              <div className="font-display text-3xl font-bold gradient-text">{s.value}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Toolkit</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Four tools. One mission.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <Link key={f.title} to={f.to} className="group glass rounded-2xl p-6 hover:border-primary/50 hover:-translate-y-1 transition-all animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="relative w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition">
                  Launch tool <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto glass-strong rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-accent/15 blur-3xl" />
          <div className="relative">
            <div className="text-xs uppercase tracking-[0.3em] text-accent mb-2">Why CyberShield</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-10 max-w-2xl">Built for analysts who don't trust the network.</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {whyUs.map((w) => (
                <div key={w.title}>
                  <w.icon className="h-6 w-6 text-accent mb-3" />
                  <h3 className="font-display font-semibold text-lg mb-2">{w.title}</h3>
                  <p className="text-sm text-muted-foreground">{w.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">FAQ</div>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Questions, answered.</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 py-10 border-t border-border/50 mt-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-display font-bold gradient-text">CyberShield AI</span>
            <span className="font-mono text-xs">© {new Date().getFullYear()}</span>
          </div>
          <div className="flex gap-6 font-mono text-xs">
            <Link to="/about" className="hover:text-primary transition">About</Link>
            <Link to="/contact" className="hover:text-primary transition">Contact</Link>
            <Link to="/dashboard" className="hover:text-primary transition">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(!open)} className="w-full text-left glass rounded-xl p-5 hover:border-primary/40 transition">
      <div className="flex items-center justify-between gap-4">
        <span className="font-display font-semibold">{q}</span>
        <ChevronDown className={`h-4 w-4 text-primary transition-transform ${open ? "rotate-180" : ""}`} />
      </div>
      {open && <p className="mt-3 text-sm text-muted-foreground animate-fade-up">{a}</p>}
    </button>
  );
}
