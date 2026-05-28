import { Activity } from "lucide-react";

export default function ReportingPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-[#FFF5FC] p-2.5">
          <Activity className="h-5 w-5 text-[#FF4FD8]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Reporting</h1>
          <p className="text-sm text-muted-foreground">
            Generate and export detailed reports on campaigns, KOLs, and token
            events.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="rounded-full bg-[#FFF5FC] p-4 mb-4">
          <Activity className="h-8 w-8 text-[#FF4FD8]" />
        </div>
        <p className="text-sm font-medium text-foreground">No reports yet</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Reports will be generated once you have active campaigns and data to
          analyze.
        </p>
      </div>
    </div>
  );
}
