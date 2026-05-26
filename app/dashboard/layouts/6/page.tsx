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
} from "lucide-react";
import Link from "next/link";

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

const activities = [
  { name: "New partner onboarded", time: "2 hours ago", badge: "Partner" },
  { name: "Campaign launched", time: "4 hours ago", badge: "Campaign" },
  { name: "Deal closed", time: "1 day ago", badge: "Deal" },
  { name: "KYC approved", time: "2 days ago", badge: "KYC" },
  { name: "Token sale started", time: "3 days ago", badge: "TGE" },
];

const pipeline = [
  { stage: "Lead", count: 156, pct: 100, color: "#FF4FD8" },
  { stage: "Qualified", count: 89, pct: 57, color: "#e879f9" },
  { stage: "Proposal", count: 45, pct: 29, color: "#d946ef" },
  { stage: "Negotiation", count: 23, pct: 15, color: "#c026d3" },
  { stage: "Closed", count: 12, pct: 8, color: "#a21caf" },
];

export default function Layout6() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col bg-background">
              {/* Hero Banner */}
              <div
                className="relative overflow-hidden px-8 py-8"
                style={{
                  background:
                    "linear-gradient(135deg, #FF4FD8 0%, #c026d3 40%, #7c3aed 100%)",
                }}
              >
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 size-48 rounded-full bg-white/5" />
                <div className="absolute -bottom-16 right-32 size-64 rounded-full bg-white/5" />
                <div className="absolute top-4 right-80 size-24 rounded-full bg-white/8" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        Dashboard
                      </h1>
                      <p className="text-white/70 text-sm mt-0.5">
                        Welcome back! Here's your marketing overview.
                      </p>
                    </div>
                    <Link
                      href="/dashboard/layouts"
                      className="text-xs text-white/50 hover:text-white underline underline-offset-4"
                    >
                      ← All layouts
                    </Link>
                  </div>

                  {/* Stats row inside the hero */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((s) => (
                      <div
                        key={s.title}
                        className="bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-white/70 uppercase tracking-wide">
                            {s.title}
                          </span>
                          <s.icon className="size-3.5 text-white/50" />
                        </div>
                        <p className="text-2xl font-bold text-white leading-none">
                          {s.value}
                        </p>
                        <div className="flex items-center gap-1 mt-1.5">
                          {s.type === "positive" ? (
                            <ArrowUpRight className="size-3 text-emerald-300" />
                          ) : (
                            <ArrowDownRight className="size-3 text-red-300" />
                          )}
                          <span
                            className={`text-xs ${s.type === "positive" ? "text-emerald-300" : "text-red-300"}`}
                          >
                            {s.change}
                          </span>
                          <span className="text-xs text-white/40">
                            vs last month
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Content below hero */}
              <div className="flex flex-col gap-5 p-6">
                {/* Chart + Activity */}
                <div className="grid gap-4 lg:grid-cols-7">
                  <Card className="lg:col-span-4 border border-border/50 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Campaign Performance</CardTitle>
                          <CardDescription>
                            Track metrics over time
                          </CardDescription>
                        </div>
                        <Badge className="bg-[#FFF5FC] text-[#FF4FD8] border-[#FF4FD8]/20 hover:bg-[#FFF5FC]">
                          Live
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[240px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
                        <p className="text-sm text-muted-foreground">
                          Campaign analytics chart
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-3 border border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest pipeline updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-1.5">
                        {activities.map((a, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="size-6 rounded-full bg-[#FFF5FC] flex items-center justify-center shrink-0">
                              <div className="size-1.5 rounded-full bg-[#FF4FD8]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {a.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {a.time}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="text-[10px] shrink-0"
                            >
                              {a.badge}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Pipeline + TGE */}
                <div className="grid gap-4 md:grid-cols-2">
                  <Card className="border border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle>Pipeline Overview</CardTitle>
                      <CardDescription>Current deal stages</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pipeline.map((p) => (
                          <div key={p.stage} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-medium">{p.stage}</span>
                              <span className="text-muted-foreground">
                                {p.count} deals
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{
                                  width: `${p.pct}%`,
                                  backgroundColor: p.color,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-border/50 shadow-sm">
                    <CardHeader>
                      <CardTitle>TGE Statistics</CardTitle>
                      <CardDescription>
                        Token generation event progress
                      </CardDescription>
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
                            className="flex justify-between items-center py-1 border-b border-border/40 last:border-0"
                          >
                            <span className="text-sm text-muted-foreground">
                              {r.label}
                            </span>
                            <span className="text-sm font-semibold">
                              {r.value}
                            </span>
                          </div>
                        ))}
                        <div>
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Target progress</span>
                            <span className="text-[#FF4FD8] font-medium">
                              68%
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: "68%",
                                background:
                                  "linear-gradient(90deg, #FF4FD8, #7c3aed)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
