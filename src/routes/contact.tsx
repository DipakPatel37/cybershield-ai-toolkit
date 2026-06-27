import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Send, Check, MessageSquare } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — CyberShield AI" }, { name: "description", content: "Reach the CyberShield AI team. Messages are stored locally in your browser." }] }),
  component: ContactPage,
});

interface Msg { id: string; name: string; email: string; message: string; ts: number; }
const KEY = "cybershield_messages_v1";

function load(): Msg[] {
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);

  useEffect(() => { setMsgs(load()); }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!name.trim() || name.length > 100) return setErr("Enter a valid name (max 100 chars).");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 255) return setErr("Enter a valid email.");
    if (!message.trim() || message.length > 1000) return setErr("Message must be 1–1000 chars.");
    const m: Msg = { id: crypto.randomUUID(), name: name.trim(), email: email.trim(), message: message.trim(), ts: Date.now() };
    const all = [m, ...load()].slice(0, 50);
    localStorage.setItem(KEY, JSON.stringify(all));
    setMsgs(all);
    setName(""); setEmail(""); setMessage("");
    setSent(true); setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader icon={Mail} eyebrow="Contact" title="Get in touch" description="Drop a note. Submissions are stored locally on this device (no server)." />

      <div className="grid md:grid-cols-[1.3fr_1fr] gap-6">
        <form onSubmit={submit} className="glass-strong rounded-2xl p-6 space-y-4">
          <Field label="Name">
            <input value={name} onChange={(e) => setName(e.target.value)} maxLength={100}
              className="w-full bg-input/60 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary focus:shadow-neon transition" />
          </Field>
          <Field label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={255}
              className="w-full bg-input/60 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary focus:shadow-neon transition" />
          </Field>
          <Field label="Message">
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} maxLength={1000}
              className="w-full bg-input/60 border border-border rounded-lg px-4 py-2.5 focus:outline-none focus:border-primary focus:shadow-neon transition resize-none" />
            <div className="text-[10px] text-muted-foreground font-mono mt-1 text-right">{message.length}/1000</div>
          </Field>
          {err && <div className="text-sm text-destructive">{err}</div>}
          <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition">
            {sent ? <><Check className="h-4 w-4" /> Sent</> : <><Send className="h-4 w-4" /> Send message</>}
          </button>
        </form>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="font-display font-bold">Inbox ({msgs.length})</h2>
          </div>
          {msgs.length === 0 ? (
            <div className="text-sm text-muted-foreground py-8 text-center">No messages yet.</div>
          ) : (
            <ul className="space-y-3 max-h-[420px] overflow-auto pr-1">
              {msgs.map((m) => (
                <li key={m.id} className="glass rounded-xl p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-display font-semibold text-sm truncate">{m.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{new Date(m.ts).toLocaleString()}</div>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">{m.email}</div>
                  <p className="text-sm mt-2">{m.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</div>
      {children}
    </label>
  );
}
