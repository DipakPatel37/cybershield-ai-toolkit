import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Lock, Unlock, Upload, Download, KeyRound, Copy, Check } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { bumpStat, addHistory } from "@/lib/stats";

export const Route = createFileRoute("/tools/encrypt")({
  head: () => ({ meta: [{ title: "File Encryption — CyberShield AI" }, { name: "description", content: "AES-GCM 256-bit file encryption in your browser via Web Crypto." }] }),
  component: EncryptPage,
});

// AES-GCM 256, key exported as base64 raw
async function generateKey() {
  const k = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
  const raw = new Uint8Array(await crypto.subtle.exportKey("raw", k));
  return { key: k, b64: btoa(String.fromCharCode(...raw)) };
}
async function importKey(b64: string) {
  const raw = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return crypto.subtle.importKey("raw", raw, "AES-GCM", true, ["encrypt", "decrypt"]);
}
function download(name: string, data: BlobPart, type = "application/octet-stream") {
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function EncryptPage() {
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader icon={Lock} eyebrow="Tool 04" title="File Encryption & Decryption" description="AES-GCM 256-bit, fully client-side via the Web Crypto API. Keys never touch a server." />

      <div className="inline-flex glass rounded-lg p-1 mb-6">
        {(["encrypt", "decrypt"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`px-5 py-2 rounded-md text-sm font-semibold transition capitalize ${mode === m ? "bg-primary text-primary-foreground shadow-neon" : "text-muted-foreground hover:text-foreground"}`}>
            {m === "encrypt" ? <Lock className="inline h-4 w-4 mr-1" /> : <Unlock className="inline h-4 w-4 mr-1" />}
            {m}
          </button>
        ))}
      </div>

      {mode === "encrypt" ? <EncryptPanel /> : <DecryptPanel />}
    </div>
  );
}

function EncryptPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err" | "busy"; msg?: string }>({ kind: "idle" });
  const [keyB64, setKeyB64] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const run = async () => {
    if (!file) return;
    setStatus({ kind: "busy", msg: "Generating key & encrypting…" });
    try {
      const { key, b64 } = await generateKey();
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const cipher = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, await file.arrayBuffer()));
      const out = new Uint8Array(iv.length + cipher.length);
      out.set(iv, 0); out.set(cipher, iv.length);
      download(file.name + ".enc", out);
      download(file.name + ".key", b64, "text/plain");
      setKeyB64(b64);
      setStatus({ kind: "ok", msg: "Encrypted. Encrypted file and key downloaded." });
      bumpStat("encryptionOps");
      addHistory({ tool: "encryption", label: file.name, status: "info", detail: "Encrypted with AES-GCM 256" });
    } catch (e) {
      setStatus({ kind: "err", msg: (e as Error).message });
    }
  };

  return (
    <div className="space-y-6">
      <Dropzone file={file} onFile={(f) => { setFile(f); setStatus({ kind: "idle" }); setKeyB64(null); }} inputRef={ref} />
      <button onClick={run} disabled={!file || status.kind === "busy"} className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-40 hover:opacity-90 transition">
        <Lock className="h-4 w-4" /> {status.kind === "busy" ? "Working…" : "Generate key & encrypt"}
      </button>

      {status.kind !== "idle" && <StatusBar kind={status.kind} msg={status.msg!} />}

      {keyB64 && (
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2"><KeyRound className="h-3 w-3" /> Your key (save this!)</div>
            <button onClick={() => { navigator.clipboard.writeText(keyB64); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="text-xs flex items-center gap-1 text-primary hover:opacity-80">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs break-all bg-input/40 rounded p-3">{keyB64}</div>
          <p className="text-xs text-muted-foreground mt-2">Without this key the encrypted file cannot be recovered. We never store it.</p>
        </div>
      )}
    </div>
  );
}

function DecryptPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [keyB64, setKeyB64] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "err" | "busy"; msg?: string }>({ kind: "idle" });
  const ref = useRef<HTMLInputElement>(null);

  const run = async () => {
    if (!file || !keyB64.trim()) { setStatus({ kind: "err", msg: "Provide both the .enc file and the key." }); return; }
    setStatus({ kind: "busy", msg: "Decrypting…" });
    try {
      const key = await importKey(keyB64.trim());
      const buf = new Uint8Array(await file.arrayBuffer());
      const iv = buf.slice(0, 12);
      const data = buf.slice(12);
      const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
      const name = file.name.replace(/\.enc$/, "") || "decrypted.bin";
      download(name, plain);
      setStatus({ kind: "ok", msg: "Decrypted. File downloaded." });
      bumpStat("encryptionOps");
      addHistory({ tool: "encryption", label: name, status: "safe", detail: "Decrypted successfully" });
    } catch {
      setStatus({ kind: "err", msg: "Decryption failed — wrong key or corrupted file." });
    }
  };

  return (
    <div className="space-y-6">
      <Dropzone file={file} onFile={(f) => { setFile(f); setStatus({ kind: "idle" }); }} inputRef={ref} hint=".enc file" />
      <div className="glass rounded-2xl p-5">
        <label className="text-xs uppercase tracking-widest text-muted-foreground">Decryption key (base64)</label>
        <textarea
          value={keyB64} onChange={(e) => setKeyB64(e.target.value)} rows={3}
          placeholder="Paste the .key contents here…"
          className="mt-2 w-full bg-input/60 border border-border rounded-lg px-3 py-2 font-mono text-xs focus:outline-none focus:border-primary focus:shadow-neon transition"
        />
      </div>
      <button onClick={run} disabled={status.kind === "busy"} className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-40 hover:opacity-90 transition">
        <Unlock className="h-4 w-4" /> {status.kind === "busy" ? "Working…" : "Decrypt"}
      </button>
      {status.kind !== "idle" && <StatusBar kind={status.kind} msg={status.msg!} />}
    </div>
  );
}

function Dropzone({ file, onFile, inputRef, hint }: { file: File | null; onFile: (f: File) => void; inputRef: React.RefObject<HTMLInputElement | null>; hint?: string }) {
  const [drag, setDrag] = useState(false);
  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onFile(f); }}
      onClick={() => inputRef.current?.click()}
      className={`glass rounded-2xl border-2 border-dashed cursor-pointer p-10 text-center transition-all ${drag ? "border-primary bg-primary/5 shadow-neon" : "border-border hover:border-primary/50"}`}
    >
      <input ref={inputRef} type="file" hidden onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
      <Upload className="h-8 w-8 mx-auto text-primary mb-2" />
      <div className="font-display font-semibold">{file ? file.name : "Drop file or click to browse"}</div>
      <div className="text-xs text-muted-foreground font-mono mt-1">{file ? `${(file.size / 1024).toFixed(1)} KB` : hint || "Any file"}</div>
    </div>
  );
}

function StatusBar({ kind, msg }: { kind: "ok" | "err" | "busy"; msg: string }) {
  const cfg = {
    ok:   { Icon: Check,    text: "text-accent", border: "border-accent/40" },
    err:  { Icon: Lock,     text: "text-destructive", border: "border-destructive/40" },
    busy: { Icon: Download, text: "text-primary", border: "border-primary/40" },
  }[kind];
  return (
    <div className={`glass rounded-xl border ${cfg.border} p-4 flex items-center gap-3 animate-fade-up`}>
      <cfg.Icon className={`h-4 w-4 ${cfg.text} ${kind === "busy" ? "animate-pulse" : ""}`} />
      <div className={`text-sm font-medium ${cfg.text}`}>{msg}</div>
    </div>
  );
}
