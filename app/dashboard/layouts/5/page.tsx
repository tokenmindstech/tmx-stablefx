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
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  LayoutDashboard,
  BarChart2,
  FileText,
} from "lucide-react";
import Link from "next/link";

const subTabs = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Analytics", icon: BarChart2 },
  { label: "Reports", icon: FileText },
];

const stats = [
  {
    title: "Partners",
    value: "2,847",
    change: "+12.5%",
    type: "positive" as const,
    icon: Users,
  },
  {
    title: "Campaigns",
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
    title: "Conversion",
    value: "3.24%",
    change: "-0.4%",
    type: "negative" as const,
    icon: TrendingUp,
  },
];

const tableData = [
  {
    partner: "Crypto Labs",
    campaign: "Token Launch Q2",
    status: "Active",
    revenue: "$42,000",
    leads: 312,
    kyc: "89%",
  },
  {
    partner: "Web3 Studio",
    campaign: "ICO Promo",
    status: "Active",
    revenue: "$28,500",
    leads: 187,
    kyc: "76%",
  },
  {
    partner: "DeFi Hub",
    campaign: "KOL Outreach",
    status: "Paused",
    revenue: "$15,200",
    leads: 94,
    kyc: "91%",
  },
  {
    partner: "NFT Collective",
    campaign: "GEO Expansion",
    status: "Active",
    revenue: "$67,800",
    leads: 456,
    kyc: "83%",
  },
  {
    partner: "Chain Partners",
    campaign: "TGE Awareness",
    status: "Draft",
    revenue: "$—",
    leads: 0,
    kyc: "—",
  },
  {
    partner: "Block Agency",
    campaign: "Pipeline Push",
    status: "Active",
    revenue: "$19,300",
    leads: 128,
    kyc: "72%",
  },
];

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  Paused: "bg-amber-100 text-amber-700",
  Draft: "bg-slate-100 text-slate-500",
};

export default function Layout5() {
  const [activeTab, setActiveTab] = React.useState("Overview");

  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col bg-background">
              {/* Sub-navigation bar */}
              <div className="border-b border-border/50 bg-background px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5">
                    {subTabs.map((tab) => (
                      <button
                        key={tab.label}
                        onClick={() => setActiveTab(tab.label)}
                        className={`flex items-center gap-1.5 px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                          activeTab === tab.label
                            ? "border-[#FF4FD8] text-[#FF4FD8]"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <tab.icon className="size-3.5" />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <Link
                    href="/dashboard/layouts"
                    className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4 py-3"
                  >
                    ← All layouts
                  </Link>
                </div>
              </div>

              <div className="flex flex-col gap-4 p-4">
                {/* Inline metrics strip */}
                <div className="grid grid-cols-4 gap-3">
                  {stats.map((s) => (
                    <div
                      key={s.title}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border/50 bg-card"
                    >
                      <div className="rounded-md bg-[#FFF5FC] p-1.5 shrink-0">
                        <s.icon className="size-3.5 text-[#FF4FD8]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-muted-foreground leading-none mb-1">
                          {s.title}
                        </p>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-bold text-foreground leading-none">
                            {s.value}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {s.type === "positive" ? (
                              <ArrowUpRight className="size-2.5 text-emerald-600" />
                            ) : (
                              <ArrowDownRight className="size-2.5 text-red-500" />
                            )}
                            <span
                              className={`text-[10px] ${s.type === "positive" ? "text-emerald-600" : "text-red-500"}`}
                            >
                              {s.change}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Two-column: chart + pipeline */}
                <div className="grid gap-3 lg:grid-cols-5">
                  <Card className="lg:col-span-3 border border-border/50 shadow-sm">
                    <CardHeader className="py-3 px-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-semibold">
                          Campaign Performance
                        </CardTitle>
                        <div className="flex gap-1">
                          {["7d", "30d", "90d"].map((p) => (
                            <button
                              key={p}
                              className={`text-[10px] px-2 py-0.5 rounded ${p === "30d" ? "bg-[#FFF5FC] text-[#FF4FD8]" : "text-muted-foreground hover:bg-muted"}`}
                            >
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 pb-4">
                      <div className="h-[180px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
                        <p className="text-xs text-muted-foreground">
                          Campaign analytics chart
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 border border-border/50 shadow-sm">
                    <CardHeader className="py-3 px-4">
                      <CardTitle className="text-sm font-semibold">
                        Pipeline & TGE
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-4">
                      <div className="space-y-2">
                        {[
                          {
                            stage: "Lead",
                            count: 156,
                            pct: 100,
                            color: "#FF4FD8",
                          },
                          {
                            stage: "Qualified",
                            count: 89,
                            pct: 57,
                            color: "#FF5BEF",
                          },
                          {
                            stage: "Proposal",
                            count: 45,
                            pct: 29,
                            color: "#C45BFF",
                          },
                          {
                            stage: "Closed",
                            count: 12,
                            pct: 8,
                            color: "#A855F7",
                          },
                        ].map((p) => (
                          <div
                            key={p.stage}
                            className="flex items-center gap-2"
                          >
                            <span className="text-xs text-muted-foreground w-20 shrink-0">
                              {p.stage}
                            </span>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${p.pct}%`,
                                  backgroundColor: p.color,
                                }}
                              />
                            </div>
                            <span className="text-xs font-medium w-6 text-right">
                              {p.count}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border/50 pt-3 space-y-1.5">
                        {[
                          { label: "Users", value: "12,847" },
                          { label: "KYC", value: "9,234" },
                          { label: "Tokens", value: "2.4M" },
                        ].map((r) => (
                          <div
                            key={r.label}
                            className="flex justify-between text-xs"
                          >
                            <span className="text-muted-foreground">
                              {r.label}
                            </span>
                            <span className="font-semibold">{r.value}</span>
                          </div>
                        ))}
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden mt-1">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: "68%",
                              background:
                                "linear-gradient(90deg, #FF4FD8, #A855F7)",
                            }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data table */}
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-semibold">
                        Campaigns & Partners
                      </CardTitle>
                      <Badge className="bg-[#FFF5FC] text-[#FF4FD8] border-[#FF4FD8]/20 hover:bg-[#FFF5FC] text-xs">
                        {tableData.length} records
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border/50 bg-muted/30">
                            {[
                              "Partner",
                              "Campaign",
                              "Status",
                              "Revenue",
                              "Leads",
                              "KYC",
                            ].map((h) => (
                              <th
                                key={h}
                                className="px-4 py-2 text-left text-xs font-medium text-muted-foreground"
                              >
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData.map((row, i) => (
                            <tr
                              key={i}
                              className="border-b border-border/30 hover:bg-muted/20 transition-colors last:border-0"
                            >
                              <td className="px-4 py-2.5 font-medium text-foreground">
                                {row.partner}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {row.campaign}
                              </td>
                              <td className="px-4 py-2.5">
                                <span
                                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColors[row.status]}`}
                                >
                                  {row.status}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 font-medium text-foreground">
                                {row.revenue}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {row.leads || "—"}
                              </td>
                              <td className="px-4 py-2.5 text-muted-foreground">
                                {row.kyc}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
