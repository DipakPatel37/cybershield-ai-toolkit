import { Link, useRouterState } from "@tanstack/react-router";
import {
  Shield, Home, LayoutDashboard, FileSearch, Globe, KeyRound, Lock,
  Info, Mail,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const main = [
  { title: "Home", url: "/", icon: Home },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
];
const tools = [
  { title: "Malware Scan", url: "/tools/malware", icon: FileSearch },
  { title: "Phishing Check", url: "/tools/phishing", icon: Globe },
  { title: "Password Strength", url: "/tools/password", icon: KeyRound },
  { title: "File Encryption", url: "/tools/encrypt", icon: Lock },
];
const info = [
  { title: "About", url: "/about", icon: Info },
  { title: "Contact", url: "/contact", icon: Mail },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const path = useRouterState({ select: (r) => r.location.pathname });
  const isActive = (u: string) => (u === "/" ? path === "/" : path === u || path.startsWith(u + "/"));

  const Section = ({ label, items }: { label: string; items: typeof main }) => (
    <SidebarGroup>
      {!collapsed && <SidebarGroupLabel className="text-xs uppercase tracking-widest text-muted-foreground/70">{label}</SidebarGroupLabel>}
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const active = isActive(item.url);
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={active} className={active ? "bg-primary/10 text-primary border border-primary/30" : ""}>
                  <Link to={item.url} className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 ${active ? "text-primary" : ""}`} />
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border glass-strong">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2 px-2 py-3">
          <div className="relative">
            <Shield className="h-7 w-7 text-primary" />
            <div className="absolute inset-0 blur-md bg-primary/40 -z-10" />
          </div>
          {!collapsed && (
            <div className="font-display text-lg leading-none">
              <div className="gradient-text font-bold">CyberShield</div>
              <div className="text-[10px] tracking-[0.3em] text-muted-foreground">AI TOOLKIT</div>
            </div>
          )}
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <Section label="Overview" items={main} />
        <Section label="Tools" items={tools} />
        <Section label="Info" items={info} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed && (
          <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              System secure
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
