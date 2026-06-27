import { createFileRoute } from "@tanstack/react-router";
import { Info, Target, Eye, Cpu, Shield } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — CyberShield AI" }, { name: "description", content: "What CyberShield AI is, why it exists, and the technologies behind it." }] }),
  component: AboutPage,
});

const tech = [
  "React 19 + TypeScript", "TanStack Start", "Tailwind CSS v4",
  "Web Crypto API (AES-GCM, SHA-256)", "Lucide icons", "Glassmorphism design system",
];

function AboutPage() {
  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto">
      <PageHeader icon={Info} eyebrow="About" title="A toolkit built for the paranoid." description="CyberShield AI is a futuristic, browser-native security workbench. Everything runs locally — no servers, no telemetry, no tradeoffs." />

      <div className="grid md:grid-cols-2 gap-6">
        <Card icon={Shield} title="What is cybersecurity?">
          Cybersecurity is the discipline of protecting systems, networks, and data
          from digital attacks. It blends cryptography, behavioral analysis, network
          defense and human awareness into a layered defense.
        </Card>
        <Card icon={Cpu} title="Why CyberShield AI?">
          Most security tools demand uploads, accounts, and trust. CyberShield runs
          purely in your browser using the same Web Crypto primitives that power
          banks and password managers. Your files never leave the page.
        </Card>
        <Card icon={Target} title="Our mission">
          Make modern security tooling effortless and beautiful — so analysts,
          developers, and curious users can audit, encrypt and verify without
          rolling the dice on a third-party service.
        </Card>
        <Card icon={Eye} title="Our vision">
          A web where security tools default to client-side execution, where
          encryption is invisible, and where premium UX isn't reserved for SaaS
          dashboards behind a login wall.
        </Card>
      </div>

      <div className="mt-8 glass-strong rounded-2xl p-8">
        <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Technologies</div>
        <h3 className="font-display text-2xl font-bold mb-6">Built with modern web primitives</h3>
        <div className="flex flex-wrap gap-2">
          {tech.map((t) => (
            <span key={t} className="glass rounded-full px-4 py-1.5 text-sm font-mono border border-primary/30">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: typeof Info; title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6 hover:border-primary/40 transition">
      <Icon className="h-6 w-6 text-primary mb-3" />
      <h3 className="font-display font-semibold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}
