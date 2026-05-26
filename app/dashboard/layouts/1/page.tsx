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
  { stage: "Qualified", count: 89, pct: 57, color: "#FF5BEF" },
  { stage: "Proposal", count: 45, pct: 29, color: "#E93DFF" },
  { stage: "Negotiation", count: 23, pct: 15, color: "#C45BFF" },
  { stage: "Closed", count: 12, pct: 8, color: "#A855F7" },
];

const activities = [
  { name: "New partner onboarded", time: "2 hours ago", badge: "Partner" },
  { name: "Campaign launched", time: "4 hours ago", badge: "Campaign" },
  { name: "Deal closed", time: "1 day ago", badge: "Deal" },
  { name: "KYC approved", time: "2 days ago", badge: "KYC" },
];

export default function Layout1() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-6 p-6 bg-background">
              {/* Nav back */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="size-5 text-[#FF4FD8]" />
                  <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                      Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Welcome back! Here's your marketing overview.
                    </p>
                  </div>
                </div>
                <Link
                  href="/dashboard/layouts"
                  className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4"
                >
                  ← All layouts
                </Link>
              </div>

              {/* Stats Grid */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                  <Card
                    key={s.title}
                    className="border border-border/50 bg-card shadow-sm"
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
                      <div className="text-2xl font-bold text-foreground">
                        {s.value}
                      </div>
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

              {/* Main Content */}
              <div className="grid gap-4 lg:grid-cols-7">
                <Card className="lg:col-span-4 border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Campaign Performance</CardTitle>
                    <CardDescription>
                      Track campaign metrics over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[260px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">
                        Campaign analytics chart
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3 border border-border/50 shadow-sm">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Latest updates from your pipeline
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {activities.map((a, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="h-2 w-2 rounded-full bg-[#FF4FD8] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">
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

              {/* Bottom */}
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
                          <div className="flex justify-between items-center text-sm">
                            <span className="font-medium text-foreground">
                              {p.stage}
                            </span>
                            <span className="text-muted-foreground">
                              {p.count}
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
                          <span className="text-sm font-semibold text-foreground">
                            {r.value}
                          </span>
                        </div>
                      ))}
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Target progress</span>
                          <span>68%</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
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
