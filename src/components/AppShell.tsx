import type { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { CyberBackground } from "./CyberBackground";
import { Shield } from "lucide-react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <CyberBackground />
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 h-14 flex items-center gap-3 px-4 glass border-b border-border/50">
            <SidebarTrigger className="hover:text-primary transition-colors" />
            <div className="flex items-center gap-2 text-sm font-mono text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-accent" />
              <span className="hidden sm:inline">secure-session</span>
              <span className="text-accent">●</span>
              <span className="hidden md:inline neon-text-green">ENCRYPTED</span>
            </div>
            <div className="ml-auto text-xs font-mono text-muted-foreground hidden md:block">
              v1.0.0 · client-side runtime
            </div>
          </header>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
