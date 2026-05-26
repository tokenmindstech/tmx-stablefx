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

const pipeline = [
  { stage: "Lead", count: 156, pct: 100, color: "#FF4FD8" },
  { stage: "Qualified", count: 89, pct: 57, color: "#e879f9" },
  { stage: "Proposal", count: 45, pct: 29, color: "#d946ef" },
  { stage: "Negotiation", count: 23, pct: 15, color: "#c026d3" },
  { stage: "Closed", count: 12, pct: 8, color: "#7c3aed" },
];

export default function Layout7() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      {/* Sidebar on RIGHT — pass side="right" */}
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-6 bg-background">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">
                    Dashboard
                  </h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Welcome back! Here's your marketing overview.
                  </p>
                </div>
                <Link
                  href="/dashboard/layouts"
                  className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4"
                >
                  ← All layouts
                </Link>
              </div>

              {/* Stats */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                  <Card
                    key={s.title}
                    className="border border-border/50 shadow-sm"
                  >
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

              {/* Chart full-width */}
              <Card className="border border-border/50 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Campaign Performance</CardTitle>
                      <CardDescription>
                        Metrics across all active campaigns
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {["7d", "30d", "90d"].map((p) => (
                        <button
                          key={p}
                          className={`text-xs px-3 py-1 rounded-md border transition-colors ${p === "30d" ? "bg-[#FFF5FC] text-[#FF4FD8] border-[#FF4FD8]/30" : "border-border text-muted-foreground hover:border-[#FF4FD8]/30 hover:text-[#FF4FD8]"}`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[220px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">
                      Campaign analytics chart
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Pipeline + Activity side by side */}
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Pipeline</CardTitle>
                    <CardDescription>Deal stage breakdown</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pipeline.map((p) => (
                        <div key={p.stage} className="flex items-center gap-3">
                          <div
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="text-sm w-24 shrink-0">
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
                          <span className="text-sm font-medium w-8 text-right">
                            {p.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest pipeline updates</CardDescription>
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
                        { name: "KYC approved", time: "2d ago", badge: "KYC" },
                      ].map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="size-1.5 rounded-full bg-[#FF4FD8] shrink-0" />
                          <span className="text-sm flex-1 truncate">
                            {a.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {a.time}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {a.badge}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* TGE stats full-width at bottom */}
              <Card className="border border-border/50 shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>TGE Statistics</CardTitle>
                      <CardDescription>
                        Token generation event progress
                      </CardDescription>
                    </div>
                    <span className="text-sm font-semibold text-[#FF4FD8]">
                      68% complete
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: "68%",
                        background: "linear-gradient(90deg, #FF4FD8, #7c3aed)",
                      }}
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      { label: "Total Users", value: "12,847" },
                      { label: "KYC Verified", value: "9,234" },
                      { label: "Transactions", value: "45,678" },
                      { label: "Tokens Sold", value: "2.4M" },
                    ].map((r) => (
                      <div
                        key={r.label}
                        className="text-center p-3 rounded-lg bg-[#FFF5FC]"
                      >
                        <p className="text-xs text-muted-foreground mb-1">
                          {r.label}
                        </p>
                        <p className="text-xl font-bold text-[#FF4FD8]">
                          {r.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </SidebarInset>
          {/* Sidebar on the RIGHT */}
          <AppSidebar side="right" />
        </div>
      </SidebarProvider>
    </div>
  );
}
