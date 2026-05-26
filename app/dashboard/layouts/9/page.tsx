import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
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
  {
    name: "New partner onboarded",
    desc: "Crypto Labs has been added to the partner database",
    time: "2 hours ago",
    type: "Partner",
  },
  {
    name: "Campaign launched",
    desc: "ICO Promo campaign is now live across 3 channels",
    time: "4 hours ago",
    type: "Campaign",
  },
  {
    name: "Deal closed",
    desc: "Web3 Studio signed a $42k contract",
    time: "1 day ago",
    type: "Deal",
  },
  {
    name: "KYC approved",
    desc: "Batch of 234 users verified successfully",
    time: "2 days ago",
    type: "KYC",
  },
  {
    name: "Token sale started",
    desc: "Phase 2 public sale is now open",
    time: "3 days ago",
    type: "TGE",
  },
];

const pipeline = [
  { stage: "Lead", count: 156, color: "#FF4FD8" },
  { stage: "Qualified", count: 89, color: "#e879f9" },
  { stage: "Proposal", count: 45, color: "#d946ef" },
  { stage: "Negotiation", count: 23, color: "#c026d3" },
  { stage: "Closed Won", count: 12, color: "#7c3aed" },
];

export default function Layout9() {
  return (
    <div className="[--header-height:calc(--spacing(14))]">
      <SidebarProvider className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>
            <div className="flex flex-1 flex-col bg-background">
              {/* Page header — minimal, text-only */}
              <div className="px-10 pt-8 pb-6 border-b border-border/40">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#FF4FD8] font-semibold mb-2">
                      Overview
                    </p>
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                      Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-2 text-base">
                      Welcome back, Admin. Here's what's happening.
                    </p>
                  </div>
                  <Link
                    href="/dashboard/layouts"
                    className="text-xs text-muted-foreground hover:text-[#FF4FD8] underline underline-offset-4 mb-1"
                  >
                    ← All layouts
                  </Link>
                </div>
              </div>

              {/* Stats — inline horizontal, no card boxes */}
              <div className="px-10 py-6 border-b border-border/40">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border/40">
                  {stats.map((s, i) => (
                    <div
                      key={s.title}
                      className={`${i > 0 ? "pl-8" : ""} ${i < stats.length - 1 ? "pr-8" : ""}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <s.icon className="size-3 text-[#FF4FD8]" />
                        <span className="text-xs text-muted-foreground">
                          {s.title}
                        </span>
                      </div>
                      <p className="text-3xl font-bold text-foreground tracking-tight">
                        {s.value}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {s.type === "positive" ? (
                          <ArrowUpRight className="size-3 text-emerald-600" />
                        ) : (
                          <ArrowDownRight className="size-3 text-red-500" />
                        )}
                        <span
                          className={`text-xs ${s.type === "positive" ? "text-emerald-600" : "text-red-500"}`}
                        >
                          {s.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="flex flex-1 divide-x divide-border/40">
                {/* Left: Activity feed — clean list */}
                <div className="flex-1 px-10 py-6">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-5">
                    Activity Feed
                  </p>

                  {/* Chart placeholder */}
                  <div className="h-[200px] flex items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 mb-6">
                    <p className="text-sm text-muted-foreground">
                      Campaign analytics chart
                    </p>
                  </div>

                  <div className="space-y-0">
                    {activities.map((a, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 py-4 border-b border-border/40 last:border-0 group"
                      >
                        <div className="mt-1.5 size-2 rounded-full bg-[#FF4FD8] shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold text-foreground">
                              {a.name}
                            </p>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-[#FF4FD8] font-medium">
                                {a.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {a.time}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {a.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Pipeline + TGE — narrow panel */}
                <div className="w-72 px-7 py-6 shrink-0">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-5">
                    Pipeline
                  </p>
                  <div className="space-y-3 mb-8">
                    {pipeline.map((p) => (
                      <div
                        key={p.stage}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-full shrink-0"
                            style={{ backgroundColor: p.color }}
                          />
                          <span className="text-sm text-foreground">
                            {p.stage}
                          </span>
                        </div>
                        <span className="text-sm font-semibold tabular-nums">
                          {p.count}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2">
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            background:
                              "linear-gradient(90deg, #FF4FD8, #7c3aed)",
                            width: "100%",
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-5">
                    TGE
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: "Total Users", value: "12,847" },
                      { label: "KYC Verified", value: "9,234" },
                      { label: "Transactions", value: "45,678" },
                      { label: "Tokens Sold", value: "2.4M" },
                    ].map((r) => (
                      <div
                        key={r.label}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-muted-foreground">
                          {r.label}
                        </span>
                        <span className="text-sm font-semibold">{r.value}</span>
                      </div>
                    ))}
                    <div className="pt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Progress</span>
                        <span className="text-[#FF4FD8] font-semibold">
                          68%
                        </span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
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
                </div>
              </div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
