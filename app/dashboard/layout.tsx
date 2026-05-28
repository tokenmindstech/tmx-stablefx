"use client";

import * as React from "react";
import Link from "next/link";
import {
  Megaphone,
  Coins,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  Settings,
  HelpCircle,
  Database,
  GitBranch,
  FileText,
  ShieldCheck,
  ArrowRightLeft,
  Landmark,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Home,
  BookMarked,
  BarChart3,
  Zap,
  Sparkles,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Nav ───────────────────────────────────────────────────────────────────────

const NAV_MAIN = [
  { id: "home", label: "Home", icon: Home, href: "/dashboard", items: [] },
  {
    id: "bookmarks",
    label: "Bookmarks",
    icon: BookMarked,
    href: "/dashboard/bookmarks",
    items: [],
  },
  {
    id: "geo-kol",
    label: "GEO / KOL",
    icon: Megaphone,
    items: [
      {
        label: "Database Partner",
        icon: Database,
        href: "/dashboard/database-partner",
      },
      { label: "Campaign", icon: Megaphone, href: "/dashboard/campaign" },
      { label: "Pipeline", icon: GitBranch, href: "/dashboard/pipeline" },
      {
        label: "Content / Brief",
        icon: FileText,
        href: "/dashboard/content-brief",
      },
      { label: "Cost", icon: DollarSign, href: "/dashboard/cost" },
    ],
  },
  {
    id: "tge",
    label: "TGE",
    icon: Coins,
    items: [
      {
        label: "Token Information",
        icon: Coins,
        href: "/dashboard/token-information",
      },
      { label: "User List", icon: Users, href: "/dashboard/user-list" },
      { label: "KYC List", icon: ShieldCheck, href: "/dashboard/kyc-list" },
      {
        label: "Transactions",
        icon: ArrowRightLeft,
        href: "/dashboard/transactions",
      },
      { label: "ICO / STO", icon: Landmark, href: "/dashboard/ico-sto" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: TrendingUp,
    href: "/dashboard/marketing",
    items: [],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/dashboard/analytics",
    items: [],
  },
  {
    id: "automation",
    label: "Automation",
    icon: Zap,
    href: "/dashboard/automation",
    items: [],
  },
  {
    id: "reporting",
    label: "Reporting",
    icon: Activity,
    href: "/dashboard/reporting",
    items: [],
  },
];

const NAV_BOTTOM = [
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    href: "/dashboard/help",
    items: [],
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    items: [],
  },
];

// ── Layout ────────────────────────────────────────────────────────────────────

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [activeItem, setActiveItem] = React.useState("geo-kol");
  const [hoveredItem, setHoveredItem] = React.useState<string | null>(null);
  const [flyoutY, setFlyoutY] = React.useState(0);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const sidebarW = collapsed ? 56 : 220;
  const allNav = [...NAV_MAIN, ...NAV_BOTTOM];
  const hoveredNav = allNav.find((i) => i.id === hoveredItem);
  const showFlyout = !!(hoveredNav && hoveredNav.items.length > 0);

  function openFlyout(id: string, e: React.MouseEvent) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setFlyoutY(rect.top);
    setHoveredItem(id);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setHoveredItem(null), 250);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <div
      className="flex overflow-hidden bg-background"
      style={{ height: "100vh" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col h-screen border-r border-border bg-white shrink-0 z-40 transition-[width] duration-200"
        style={{ width: sidebarW }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-14 border-b border-border px-3 shrink-0 overflow-hidden"
          style={{
            justifyContent: collapsed ? "center" : "flex-start",
            gap: collapsed ? 0 : 10,
          }}
        >
          <div
            className="size-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
          >
            TM
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              TMX Marketing
            </span>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto py-1.5 px-1.5">
          {NAV_MAIN.map((item) => {
            const isActive = activeItem === item.id;
            const hasChildren = item.items.length > 0;
            const sharedClass = cn(
              "relative mb-0.5 w-full h-auto font-medium gap-2.5 px-2 py-2",
              collapsed ? "justify-center" : "justify-start",
              isActive
                ? "bg-[#FFF5FC] text-[#FF4FD8] hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
                : "text-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
            );
            const content = (
              <>
                <item.icon className="size-4 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left truncate">
                      {item.label}
                    </span>
                    {hasChildren && (
                      <ChevronRight className="size-3.5 shrink-0 opacity-40" />
                    )}
                  </>
                )}
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: "#FF4FD8" }}
                  />
                )}
              </>
            );
            if (!hasChildren && (item as { href?: string }).href) {
              return (
                <Link
                  key={item.id}
                  href={(item as { href: string }).href}
                  onClick={() => setActiveItem(item.id)}
                  onMouseEnter={(e) => openFlyout(item.id, e)}
                  onMouseLeave={scheduleClose}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    sharedClass,
                  )}
                >
                  {content}
                </Link>
              );
            }
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveItem(item.id)}
                onMouseEnter={(e) => openFlyout(item.id, e)}
                onMouseLeave={scheduleClose}
                className={sharedClass}
              >
                {content}
              </Button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border pt-1.5 pb-2 px-1.5 space-y-0.5">
          {NAV_BOTTOM.map((item) => {
            const isActive = activeItem === item.id;
            const sharedClass = cn(
              "w-full h-auto justify-start gap-2.5 px-2 py-2 font-medium",
              collapsed ? "justify-center" : "justify-start",
              isActive
                ? "bg-[#FFF5FC] text-[#FF4FD8] hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
                : "text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
            );
            const content = (
              <>
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            );
            if ((item as { href?: string }).href) {
              return (
                <Link
                  key={item.id}
                  href={(item as { href: string }).href}
                  onClick={() => setActiveItem(item.id)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    sharedClass,
                  )}
                >
                  {content}
                </Link>
              );
            }
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setActiveItem(item.id)}
                className={sharedClass}
              >
                {content}
              </Button>
            );
          })}

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            onClick={() => setCollapsed((c) => !c)}
            className={[
              "w-full h-auto justify-start gap-2.5 px-2 py-2 text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
              collapsed ? "justify-center" : "justify-start",
            ].join(" ")}
          >
            {collapsed ? (
              <ChevronRight className="size-4 shrink-0" />
            ) : (
              <>
                <ChevronLeft className="size-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* ── Flyout submenu (hover-triggered) ── */}
      {showFlyout && hoveredNav && (
        <div
          className="fixed z-50 bg-white border border-border rounded-lg shadow-xl overflow-hidden"
          style={{
            left: sidebarW,
            top: flyoutY,
            minWidth: 208,
            maxHeight: "60vh",
            overflowY: "auto",
          }}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <div className="px-3 py-2 border-b border-border bg-muted/30">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              {hoveredNav.label}
            </span>
          </div>
          <div className="py-1">
            {hoveredNav.items.map((sub, i) => (
              <Link
                key={i}
                href={sub.href}
                className={cn(
                  buttonVariants({ variant: "ghost", size: "sm" }),
                  "w-full justify-start gap-2.5 px-3 py-2 h-auto rounded-none font-normal text-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
                )}
              >
                <sub.icon className="size-3.5 shrink-0 text-muted-foreground" />
                <span>{sub.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-14 border-b border-border bg-white flex items-center gap-3 px-4 shrink-0">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none z-10" />
            <Input
              placeholder="Find or Ask..."
              className="h-8 pl-8 pr-3 text-sm bg-muted/40 focus-visible:ring-1 focus-visible:ring-[#FF4FD8] focus-visible:border-[#FF4FD8]"
            />
          </div>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
              title="Help"
            >
              <HelpCircle className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8] relative"
              title="Notifications"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#FF4FD8]" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
              title="Settings"
            >
              <Settings className="size-4" />
            </Button>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs font-medium ml-1 text-white border-0"
              style={{
                background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
              }}
            >
              <Sparkles className="size-3.5" />
              AI Assistant
            </Button>
            <div
              className="ml-1 size-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer shrink-0"
              style={{
                background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
              }}
              title="Profile"
            >
              A
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
