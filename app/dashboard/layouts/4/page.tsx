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
    border: "border-l-violet-400",
  },
  {
    title: "Active Campaigns",
    value: "24",
    change: "+4.2%",
    type: "positive" as const,
    icon: Activity,
    border: "border-l-pink-400",
  },
  {
    title: "Revenue",
    value: "$1.2M",
    change: "+18.7%",
    type: "positive" as const,
    icon: DollarSign,
    border: "border-l-fuchsia-400",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "-0.4%",
    type: "negative" as const,
    icon: TrendingUp,
    border: "border-l-purple-400",
  },
];

const pipeline = [
  { stage: "Lead", count: 156, pct: 100, color: "#FF4FD8" },
  { stage: "Qualified", count: 89, pct: 57, color: "#FF5BEF" },
  { stage: "Proposal", count: 45, pct: 29, color: "#E93DFF" },
  { stage: "Negotiation", count: 23, pct: 15, color: "#C45BFF" },
  { stage: "Closed", count: 12, pct: 8, color: "#A855F7" },
];

export default function Layout4() {
  return (
    <div className="[--header-height:calc(--spacing(14))] bg-slate-100">
      <SidebarProvider className="flex flex-col bg-slate-100">
        <SiteHeader />
        <div className="flex flex-1">
          {/* Inset/floating sidebar variant */}
          <AppSidebar variant={"floating" as "sidebar"} />
          <SidebarInset className="bg-slate-100">
            <div className="flex flex-1 flex-col gap-5 p-4">
              {/* Page Header */}
              <div className="flex items-center justify-between px-2 pt-1">
                <div>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground">
                    Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Welcome back! Here's your overview.
                  </p>
                </div>
                <Link
                  href="/dashboard/layouts"
                  className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4"
                >
                  ← All layouts
                </Link>
              </div>

              {/* Stats — colored left-border style */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                  <div
                    key={s.title}
                    className={`bg-white rounded-xl shadow-sm border-l-4 ${s.border} p-4`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium mb-1">
                          {s.title}
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                          {s.value}
                        </p>
                      </div>
                      <div className="rounded-full bg-slate-100 p-2 mt-0.5">
                        <s.icon className="h-4 w-4 text-slate-500" />
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {s.type === "positive" ? (
                        <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 text-red-500" />
                      )}
                      <span
                        className={`text-xs font-medium ${s.type === "positive" ? "text-emerald-600" : "text-red-500"}`}
                      >
                        {s.change}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        vs last month
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main content */}
              <div className="grid gap-4 lg:grid-cols-7">
                <Card className="lg:col-span-4 bg-white rounded-xl shadow-sm border-0">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base">
                          Campaign Performance
                        </CardTitle>
                        <CardDescription>
                          Metrics across all active campaigns
                        </CardDescription>
                      </div>
                      <Badge className="bg-slate-100 text-slate-600 border-0 hover:bg-slate-200">
                        Last 30 days
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px] flex items-center justify-center rounded-xl bg-slate-50 border border-dashed border-slate-200">
                      <p className="text-sm text-muted-foreground">
                        Campaign analytics chart
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3 bg-white rounded-xl shadow-sm border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                    <CardDescription>Latest pipeline updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      {[
                        {
                          name: "New partner onboarded",
                          time: "2 hours ago",
                          badge: "Partner",
                        },
                        {
                          name: "Campaign launched",
                          time: "4 hours ago",
                          badge: "Campaign",
                        },
                        {
                          name: "Deal closed",
                          time: "1 day ago",
                          badge: "Deal",
                        },
                        {
                          name: "KYC approved",
                          time: "2 days ago",
                          badge: "KYC",
                        },
                      ].map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <div className="h-7 w-7 rounded-full bg-[#FFF5FC] flex items-center justify-center shrink-0">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#FF4FD8]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
                              {a.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {a.time}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="text-[10px] shrink-0 bg-slate-100"
                          >
                            {a.badge}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Bottom */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="bg-white rounded-xl shadow-sm border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">
                      Pipeline Overview
                    </CardTitle>
                    <CardDescription>
                      Current deal stage breakdown
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pipeline.map((p) => (
                        <div key={p.stage} className="flex items-center gap-3">
                          <span className="text-sm text-muted-foreground w-24 shrink-0">
                            {p.stage}
                          </span>
                          <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${p.pct}%`,
                                backgroundColor: p.color,
                              }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-foreground w-8 text-right">
                            {p.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* TGE card with circular progress feel */}
                <Card className="bg-white rounded-xl shadow-sm border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">TGE Statistics</CardTitle>
                    <CardDescription>
                      Token generation event progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {[
                        {
                          label: "Total Users",
                          value: "12,847",
                          color: "text-violet-600",
                        },
                        {
                          label: "KYC Verified",
                          value: "9,234",
                          color: "text-pink-600",
                        },
                        {
                          label: "Transactions",
                          value: "45,678",
                          color: "text-fuchsia-600",
                        },
                        {
                          label: "Tokens Sold",
                          value: "2.4M",
                          color: "text-purple-600",
                        },
                      ].map((r) => (
                        <div
                          key={r.label}
                          className="bg-slate-50 rounded-lg p-3"
                        >
                          <p className="text-xs text-muted-foreground">
                            {r.label}
                          </p>
                          <p className={`text-lg font-bold mt-0.5 ${r.color}`}>
                            {r.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Target progress</span>
                        <span className="font-medium text-[#FF4FD8]">68%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
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
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
