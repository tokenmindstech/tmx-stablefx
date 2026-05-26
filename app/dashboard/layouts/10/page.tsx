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
  Bell,
  Search,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const pipeline = [
  { stage: "Lead", count: 156, pct: 100, color: "#FF4FD8" },
  { stage: "Qualified", count: 89, pct: 57, color: "#e879f9" },
  { stage: "Proposal", count: 45, pct: 29, color: "#d946ef" },
  { stage: "Negotiation", count: 23, pct: 15, color: "#c026d3" },
  { stage: "Closed", count: 12, pct: 8, color: "#7c3aed" },
];

export default function Layout10() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Fixed Left Overview Panel — replaces sidebar entirely */}
      <div className="w-72 shrink-0 border-r border-border bg-white flex flex-col sticky top-0 h-screen overflow-y-auto">
        {/* Logo + branding */}
        <div className="px-6 pt-6 pb-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-[#FF4FD8] to-[#7c3aed] flex items-center justify-center shrink-0">
              <span className="text-sm font-bold text-white">TM</span>
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">TMX Marketing</p>
              <p className="text-xs text-muted-foreground">
                Sales & Deals Platform
              </p>
            </div>
          </div>
        </div>

        {/* Quick stats — the panel's main value */}
        <div className="px-5 py-5 border-b border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            At a Glance
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                label: "Partners",
                value: "2,847",
                change: "+12.5%",
                up: true,
                icon: Users,
              },
              {
                label: "Campaigns",
                value: "24",
                change: "+4.2%",
                up: true,
                icon: Activity,
              },
              {
                label: "Revenue",
                value: "$1.2M",
                change: "+18.7%",
                up: true,
                icon: DollarSign,
              },
              {
                label: "Conversion",
                value: "3.24%",
                change: "-0.4%",
                up: false,
                icon: TrendingUp,
              },
            ].map((s) => (
              <div key={s.label} className="bg-[#FFF5FC] rounded-xl p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-muted-foreground">
                    {s.label}
                  </span>
                  <s.icon className="size-3 text-[#FF4FD8]" />
                </div>
                <p className="text-base font-bold text-foreground leading-none">
                  {s.value}
                </p>
                <div className="flex items-center gap-0.5 mt-1">
                  {s.up ? (
                    <ArrowUpRight className="size-2.5 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="size-2.5 text-red-500" />
                  )}
                  <span
                    className={`text-[10px] ${s.up ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {s.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline mini */}
        <div className="px-5 py-5 border-b border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            Pipeline
          </p>
          <div className="space-y-2.5">
            {pipeline.map((p) => (
              <div key={p.stage} className="flex items-center gap-2">
                <div
                  className="size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: p.color }}
                />
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                  />
                </div>
                <div className="flex items-center justify-between gap-2 shrink-0">
                  <span className="text-xs text-muted-foreground w-20">
                    {p.stage}
                  </span>
                  <span className="text-xs font-medium w-6 text-right">
                    {p.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TGE mini */}
        <div className="px-5 py-5 border-b border-border/50">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">
            TGE Progress
          </p>
          <div className="flex items-end justify-between mb-2">
            <span className="text-3xl font-bold text-[#FF4FD8]">68%</span>
            <span className="text-xs text-muted-foreground pb-1">
              of target
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: "68%",
                background: "linear-gradient(90deg, #FF4FD8, #7c3aed)",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {[
              { label: "Users", val: "12,847" },
              { label: "KYC", val: "9,234" },
            ].map((r) => (
              <div
                key={r.label}
                className="text-center bg-muted/40 rounded-lg py-2"
              >
                <p className="text-xs text-muted-foreground">{r.label}</p>
                <p className="text-sm font-bold">{r.val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom nav */}
        <div className="mt-auto px-4 py-4 border-t border-border/50 space-y-1">
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors">
            <Settings className="size-4" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-colors">
            <LogOut className="size-4" />
            <span>Sign out</span>
          </button>
        </div>
      </div>

      {/* Main scrollable content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
          <div className="flex h-14 items-center gap-3 px-6">
            <div>
              <h1 className="text-sm font-semibold text-foreground">
                Dashboard
              </h1>
              <p className="text-xs text-muted-foreground">
                Welcome back, Admin
              </p>
            </div>
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
              <Link
                href="/dashboard/layouts"
                className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4 ml-2"
              >
                ← All layouts
              </Link>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-5">
          {/* Chart */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campaign Performance</CardTitle>
                  <CardDescription>
                    Metrics over the last 30 days
                  </CardDescription>
                </div>
                <Badge className="bg-[#FFF5FC] text-[#FF4FD8] border-[#FF4FD8]/20 hover:bg-[#FFF5FC]">
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[240px] flex items-center justify-center rounded-xl bg-muted/30 border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  Campaign analytics chart
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="border border-border/50 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Latest updates across your pipeline
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#FF4FD8] hover:bg-[#FFF5FC] h-7 text-xs gap-1"
                >
                  View all <ChevronRight className="size-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[
                  {
                    name: "New partner onboarded",
                    desc: "Crypto Labs added to partner database",
                    time: "2h ago",
                    badge: "Partner",
                  },
                  {
                    name: "Campaign launched",
                    desc: "ICO Promo is now live",
                    time: "4h ago",
                    badge: "Campaign",
                  },
                  {
                    name: "Deal closed",
                    desc: "Web3 Studio — $42k contract",
                    time: "1d ago",
                    badge: "Deal",
                  },
                  {
                    name: "KYC approved",
                    desc: "234 users verified in batch",
                    time: "2d ago",
                    badge: "KYC",
                  },
                  {
                    name: "Token sale started",
                    desc: "Phase 2 public sale open",
                    time: "3d ago",
                    badge: "TGE",
                  },
                ].map((a, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 py-3 px-2 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <div className="mt-2 size-1.5 rounded-full bg-[#FF4FD8] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{a.name}</p>
                      <p className="text-xs text-muted-foreground">{a.desc}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {a.time}
                      </span>
                      <Badge variant="outline" className="text-[10px]">
                        {a.badge}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
