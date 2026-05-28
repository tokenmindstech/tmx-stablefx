import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export const iframeHeight = "800px";
export const description = "TMX Marketing - Sales, Deals & Pipeline Platform";

function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="border border-border/50 bg-card shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="rounded-lg bg-[#FFF5FC] p-2">
          <Icon className="h-4 w-4 text-[#FF4FD8]" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        <div className="flex items-center gap-1 mt-1">
          {changeType === "positive" ? (
            <ArrowUpRight className="h-3 w-3 text-emerald-600" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-red-500" />
          )}
          <p
            className={`text-xs ${changeType === "positive" ? "text-emerald-600" : "text-red-500"}`}
          >
            {change}
          </p>
          <span className="text-xs text-muted-foreground">from last month</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 bg-background">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here&apos;s an overview of your marketing performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Partners"
          value="2,847"
          change="+12.5%"
          changeType="positive"
          icon={Users}
        />
        <StatsCard
          title="Active Campaigns"
          value="24"
          change="+4.2%"
          changeType="positive"
          icon={Activity}
        />
        <StatsCard
          title="Revenue"
          value="$1.2M"
          change="+18.7%"
          changeType="positive"
          icon={DollarSign}
        />
        <StatsCard
          title="Conversion Rate"
          value="3.24%"
          change="-0.4%"
          changeType="negative"
          icon={TrendingUp}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">
              Campaign Performance
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Track your campaign metrics over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center rounded-lg bg-muted/30 border border-dashed border-border">
              <p className="text-sm text-muted-foreground">
                Campaign analytics chart
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3 border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Activity</CardTitle>
            <CardDescription className="text-muted-foreground">
              Latest updates from your pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "New partner onboarded",
                  time: "2 hours ago",
                  type: "partner",
                },
                {
                  name: "Campaign launched",
                  time: "4 hours ago",
                  type: "campaign",
                },
                { name: "Deal closed", time: "1 day ago", type: "deal" },
                { name: "KYC approved", time: "2 days ago", type: "kyc" },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-[#FF4FD8]" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Pipeline Overview</CardTitle>
            <CardDescription className="text-muted-foreground">
              Current status of your deals pipeline
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Lead", count: 156, color: "#FF4FD8" },
                { stage: "Qualified", count: 89, color: "#FF5BEF" },
                { stage: "Proposal", count: 45, color: "#E93DFF" },
                { stage: "Negotiation", count: 23, color: "#C45BFF" },
                { stage: "Closed", count: 12, color: "#A855F7" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="flex-1 text-sm text-foreground">
                    {item.stage}
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="border border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground">TGE Statistics</CardTitle>
            <CardDescription className="text-muted-foreground">
              Token generation event progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Total Users
                </span>
                <span className="text-sm font-medium text-foreground">
                  12,847
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  KYC Verified
                </span>
                <span className="text-sm font-medium text-foreground">
                  9,234
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Transactions
                </span>
                <span className="text-sm font-medium text-foreground">
                  45,678
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Tokens Sold
                </span>
                <span className="text-sm font-medium text-foreground">
                  2.4M
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mt-2">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "68%",
                    background: "linear-gradient(90deg, #FF4FD8, #A855F7)",
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center">
                68% of target reached
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
