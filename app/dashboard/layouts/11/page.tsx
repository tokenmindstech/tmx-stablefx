"use client";

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
  LayoutDashboard,
  BarChart2,
  GitBranch,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "pipeline", label: "Pipeline", icon: GitBranch },
];

const stats = [
  {
    title: "Total Partners",
    value: "2,847",
    change: "+12.5%",
    type: "positive" as const,
    icon: Users,
  },
  {
    title: "Active Campaigns",
    value: "24",
    change: "+4.2%",
    type: "positive" as const,
    icon: Activity,
  },
  {
    title: "Revenue",
    value: "$1.2M",
    change: "+18.7%",
    type: "positive" as const,
    icon: DollarSign,
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.4%",
    type: "negative" as const,
    icon: TrendingUp,
  },
];

const pipeline = [
  { stage: "Lead", count: 156, pct: 100, color: "#FF4FD8" },
  { stage: "Qualified", count: 89, pct: 57, color: "#e879f9" },
  { stage: "Proposal", count: 45, pct: 29, color: "#d946ef" },
  { stage: "Negotiation", count: 23, pct: 15, color: "#c026d3" },
  { stage: "Closed", count: 12, pct: 8, color: "#7c3aed" },
];

const tableData = [
  {
    partner: "Crypto Labs",
    campaign: "Token Launch Q2",
    status: "Active",
    revenue: "$42,000",
    leads: 312,
  },
  {
    partner: "Web3 Studio",
    campaign: "ICO Promo",
    status: "Active",
    revenue: "$28,500",
    leads: 187,
  },
  {
    partner: "DeFi Hub",
    campaign: "KOL Outreach",
    status: "Paused",
    revenue: "$15,200",
    leads: 94,
  },
  {
    partner: "NFT Collective",
    campaign: "GEO Expansion",
    status: "Active",
    revenue: "$67,800",
    leads: 456,
  },
  {
    partner: "Chain Partners",
    campaign: "TGE Awareness",
    status: "Draft",
    revenue: "—",
    leads: 0,
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Paused: "bg-amber-100 text-amber-700",
  Draft: "bg-slate-100 text-slate-500",
};

function OverviewTab() {
  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.title} className="border border-border/50 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.title}
              </CardTitle>
              <div className="rounded-lg bg-[#FFF5FC] p-2">
                <s.icon className="h-4 w-4 text-[#FF4FD8]" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="flex items-center gap-1 mt-1">
                {s.type === "positive" ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span
                  className={`text-xs ${s.type === "positive" ? "text-emerald-600" : "text-red-500"}`}
                >
                  {s.change}
                </span>
                <span className="text-xs text-muted-foreground">
                  from last month
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Chart */}
        <Card className="lg:col-span-2 border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Track metrics over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
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
              <CardTitle>Recent Activity</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-[#FF4FD8] hover:bg-[#FFF5FC] gap-1 px-2"
              >
                All <ChevronRight className="size-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { name: "Partner onboarded", time: "2h", badge: "Partner" },
                { name: "Campaign launched", time: "4h", badge: "Campaign" },
                { name: "Deal closed", time: "1d", badge: "Deal" },
                { name: "KYC approved", time: "2d", badge: "KYC" },
              ].map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="size-1.5 rounded-full bg-[#FF4FD8] shrink-0" />
                  <span className="text-sm flex-1 truncate">{a.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {a.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  return (
    <div className="space-y-5">
      {/* Top: 3 chart placeholders in different arrangements */}
      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3 border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Monthly revenue comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Revenue trend chart
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Drop-off at each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
              <p className="text-sm text-muted-foreground">Funnel chart</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom: TGE stats + KPI cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>TGE Statistics</CardTitle>
            <CardDescription>Token generation event breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Total Users", value: "12,847" },
                { label: "KYC Verified", value: "9,234" },
                { label: "Transactions", value: "45,678" },
                { label: "Tokens Sold", value: "2.4M" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex justify-between py-1 border-b border-border/40 last:border-0"
                >
                  <span className="text-sm text-muted-foreground">
                    {r.label}
                  </span>
                  <span className="text-sm font-semibold">{r.value}</span>
                </div>
              ))}
              <div className="h-2 bg-muted rounded-full overflow-hidden mt-1">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "68%",
                    background: "linear-gradient(90deg, #FF4FD8, #7c3aed)",
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                68% of target reached
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle>GEO/KOL Breakdown</CardTitle>
            <CardDescription>Performance by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
              <p className="text-sm text-muted-foreground">Geographic chart</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function PipelineTab() {
  return (
    <div className="space-y-5">
      {/* Pipeline summary bar */}
      <div className="grid grid-cols-5 gap-3">
        {pipeline.map((p) => (
          <div
            key={p.stage}
            className="text-center p-4 rounded-xl border border-border/50 bg-card shadow-sm"
          >
            <div
              className="size-3 rounded-full mx-auto mb-2"
              style={{ backgroundColor: p.color }}
            />
            <p className="text-xs text-muted-foreground mb-1">{p.stage}</p>
            <p className="text-xl font-bold" style={{ color: p.color }}>
              {p.count}
            </p>
          </div>
        ))}
      </div>

      {/* Pipeline table */}
      <Card className="border border-border/50 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>All Campaigns & Partners</CardTitle>
              <CardDescription>Active pipeline records</CardDescription>
            </div>
            <Badge className="bg-[#FFF5FC] text-[#FF4FD8] border-[#FF4FD8]/20 hover:bg-[#FFF5FC]">
              {tableData.length} records
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  {["Partner", "Campaign", "Status", "Revenue", "Leads"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors last:border-0"
                  >
                    <td className="px-5 py-3 font-medium">{row.partner}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {row.campaign}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[row.status]}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium">{row.revenue}</td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {row.leads || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Layout11() {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col bg-background">
              {/* Page header + tab switcher combined */}
              <div className="px-6 pt-5 pb-0 border-b border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                      Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Welcome back! Choose a view below.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/layouts"
                    className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4"
                  >
                    ← All layouts
                  </Link>
                </div>

                {/* Tab strip */}
                <div className="flex gap-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                        activeTab === tab.id
                          ? "border-[#FF4FD8] text-[#FF4FD8]"
                          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                      }`}
                    >
                      <tab.icon className="size-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="flex-1 p-6">
                {activeTab === "overview" && <OverviewTab />}
                {activeTab === "analytics" && <AnalyticsTab />}
                {activeTab === "pipeline" && <PipelineTab />}
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
