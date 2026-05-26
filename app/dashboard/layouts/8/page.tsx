"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Megaphone,
  Coins,
  LayoutDashboard,
  Settings,
  LifeBuoy,
  Bell,
  Search,
  GitBranch,
} from "lucide-react";
import Link from "next/link";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "GEO / KOL", icon: Megaphone },
  { label: "TGE", icon: Coins },
  { label: "Pipeline", icon: GitBranch },
  { label: "Support", icon: LifeBuoy },
  { label: "Settings", icon: Settings },
];

export default function Layout8() {
  const [activeNav, setActiveNav] = React.useState("Dashboard");

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col">
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="flex h-14 items-center gap-3 px-6">
          <div className="flex items-center gap-2 mr-3 shrink-0">
            <div className="size-7 rounded-lg bg-[#FF4FD8] flex items-center justify-center">
              <span className="text-xs font-bold text-white">TM</span>
            </div>
            <span className="font-semibold text-sm hidden sm:block">
              TMX Marketing
            </span>
          </div>
          <div className="h-4 w-px bg-border" />
          <nav className="flex items-center gap-0.5">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  activeNav === item.label
                    ? "bg-[#FFF5FC] text-[#FF4FD8]"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <item.icon className="size-3.5" />
                <span className="hidden lg:block">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[#FFF5FC] hover:text-[#FF4FD8]"
            >
              <Search className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-[#FFF5FC] hover:text-[#FF4FD8] relative"
            >
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#FF4FD8]" />
            </Button>
            <div className="size-7 rounded-full bg-gradient-to-br from-[#FF4FD8] to-[#7c3aed] flex items-center justify-center text-xs font-bold text-white shrink-0">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Bento grid */}
      <main className="flex-1 p-5">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-xl font-semibold">Dashboard</h1>
          <Link
            href="/dashboard/layouts"
            className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4"
          >
            ← All layouts
          </Link>
        </div>

        {/* Bento — using CSS grid with explicit placements */}
        <div className="grid grid-cols-4 grid-rows-[auto] gap-4">
          {/* Feature chart — spans 2 cols, 2 rows */}
          <Card className="col-span-2 row-span-2 border border-border/50 shadow-sm bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>Live metrics over 30 days</CardDescription>
                </div>
                <Badge className="bg-[#FFF5FC] text-[#FF4FD8] border-[#FF4FD8]/20 hover:bg-[#FFF5FC]">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[280px] flex items-center justify-center rounded-xl bg-muted/20 border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  Campaign analytics chart
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stat: Partners */}
          <div className="col-span-1 bg-white rounded-xl border border-border/50 shadow-sm p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Partners
              </span>
              <div className="rounded-lg bg-[#FFF5FC] p-1.5">
                <Users className="size-3.5 text-[#FF4FD8]" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold">2,847</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="size-3 text-emerald-600" />
                <span className="text-xs text-emerald-600">+12.5%</span>
              </div>
            </div>
          </div>

          {/* Stat: Revenue */}
          <div
            className="col-span-1 rounded-xl border border-border/50 shadow-sm p-4 flex flex-col justify-between"
            style={{
              background: "linear-gradient(135deg, #FF4FD8 0%, #7c3aed 100%)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/70 font-medium uppercase tracking-wide">
                Revenue
              </span>
              <div className="rounded-lg bg-white/20 p-1.5">
                <DollarSign className="size-3.5 text-white" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">$1.2M</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="size-3 text-emerald-300" />
                <span className="text-xs text-emerald-300">+18.7%</span>
              </div>
            </div>
          </div>

          {/* Stat: Campaigns */}
          <div className="col-span-1 bg-white rounded-xl border border-border/50 shadow-sm p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Campaigns
              </span>
              <div className="rounded-lg bg-[#FFF5FC] p-1.5">
                <Activity className="size-3.5 text-[#FF4FD8]" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold">24</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="size-3 text-emerald-600" />
                <span className="text-xs text-emerald-600">+4.2%</span>
              </div>
            </div>
          </div>

          {/* Stat: Conversion */}
          <div className="col-span-1 bg-white rounded-xl border border-border/50 shadow-sm p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Conversion
              </span>
              <div className="rounded-lg bg-[#FFF5FC] p-1.5">
                <TrendingUp className="size-3.5 text-[#FF4FD8]" />
              </div>
            </div>
            <div>
              <p className="text-3xl font-bold">3.24%</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowDownRight className="size-3 text-red-500" />
                <span className="text-xs text-red-500">-0.4%</span>
              </div>
            </div>
          </div>

          {/* Pipeline — spans 1 col, tall */}
          <Card className="col-span-1 row-span-2 border border-border/50 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Pipeline</CardTitle>
              <CardDescription className="text-xs">Deal stages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { stage: "Lead", count: 156, pct: 100, color: "#FF4FD8" },
                  { stage: "Qualified", count: 89, pct: 57, color: "#e879f9" },
                  { stage: "Proposal", count: 45, pct: 29, color: "#d946ef" },
                  {
                    stage: "Negotiation",
                    count: 23,
                    pct: 15,
                    color: "#c026d3",
                  },
                  { stage: "Closed", count: 12, pct: 8, color: "#7c3aed" },
                ].map((p) => (
                  <div key={p.stage} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{p.stage}</span>
                      <span className="font-medium">{p.count}</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="col-span-2 border border-border/50 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  {
                    name: "New partner onboarded",
                    time: "2h ago",
                    badge: "Partner",
                  },
                  {
                    name: "Campaign launched",
                    time: "4h ago",
                    badge: "Campaign",
                  },
                  { name: "Deal closed", time: "1d ago", badge: "Deal" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <div className="size-1.5 rounded-full bg-[#FF4FD8] shrink-0" />
                    <span className="text-sm flex-1 truncate">{a.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {a.time}
                    </span>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {a.badge}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* TGE — spans remaining width */}
          <Card className="col-span-1 border border-border/50 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">TGE Progress</CardTitle>
              <CardDescription className="text-xs">
                Token generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {[
                  { label: "Users", value: "12,847" },
                  { label: "KYC", value: "9,234" },
                  { label: "Tokens", value: "2.4M" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="font-semibold">{r.value}</span>
                  </div>
                ))}
                <div className="pt-1">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "68%",
                        background: "linear-gradient(90deg, #FF4FD8, #7c3aed)",
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center mt-1">
                    68% of target
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
