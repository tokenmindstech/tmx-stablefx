"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Wallet,
  ArrowLeftRight,
  ReceiptText,
  Settings,
  HelpCircle,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const NAV_MAIN = [
  { id: "treasury", label: "Treasury Wallets", icon: Wallet, href: "/dashboard" },
  { id: "transfer", label: "Transfer", icon: ArrowLeftRight, href: "/dashboard/transfer" },
  { id: "transactions", label: "Transactions", icon: ReceiptText, href: "/dashboard/transactions" },
];

const NAV_BOTTOM = [
  { id: "help", label: "Help", icon: HelpCircle, href: "/dashboard/help" },
  { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const sidebarW = collapsed ? 56 : 220;

  function isActive(href: string) {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  }

  return (
    <div className="flex overflow-hidden bg-background" style={{ height: "100vh" }}>
      {/* Sidebar */}
      <aside
        className="flex flex-col h-screen border-r border-border bg-white shrink-0 z-40 transition-[width] duration-200"
        style={{ width: sidebarW }}
      >
        {/* Logo */}
        <div
          className="flex items-center h-14 border-b border-border px-3 shrink-0 overflow-hidden"
          style={{ justifyContent: collapsed ? "center" : "flex-start", gap: collapsed ? 0 : 10 }}
        >
          <div
            className="size-7 rounded-lg flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
          >
            TX
          </div>
          {!collapsed && (
            <span className="font-semibold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
              TMX StableFX
            </span>
          )}
        </div>

        {/* Main nav */}
        <nav className="flex-1 overflow-y-auto py-1.5 px-1.5">
          {NAV_MAIN.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "relative mb-0.5 w-full h-auto font-medium gap-2.5 px-2 py-2",
                  collapsed ? "justify-center" : "justify-start",
                  active
                    ? "bg-[#FFF5FC] text-[#FF4FD8] hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
                    : "text-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span className="flex-1 text-left truncate">{item.label}</span>}
                {active && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full"
                    style={{ background: "#FF4FD8" }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom nav */}
        <div className="border-t border-border pt-1.5 pb-2 px-1.5 space-y-0.5">
          {NAV_BOTTOM.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  "w-full h-auto font-medium gap-2.5 px-2 py-2",
                  collapsed ? "justify-center" : "justify-start",
                  active
                    ? "bg-[#FFF5FC] text-[#FF4FD8] hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
                    : "text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}

          {/* Collapse toggle */}
          <Button
            variant="ghost"
            onClick={() => setCollapsed((c) => !c)}
            className={cn(
              "w-full h-auto gap-2.5 px-2 py-2 text-muted-foreground hover:bg-[#FFF5FC] hover:text-[#FF4FD8]",
              collapsed ? "justify-center" : "justify-start",
            )}
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

      {/* Main area */}
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
              style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
            >
              <Sparkles className="size-3.5" />
              AI Assistant
            </Button>
            <div
              className="ml-1 size-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white cursor-pointer shrink-0"
              style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
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
