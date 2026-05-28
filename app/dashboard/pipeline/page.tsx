import { GitBranch } from "lucide-react";

export default function PipelinePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-[#FFF5FC] p-2.5">
          <GitBranch className="h-5 w-5 text-[#FF4FD8]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">Pipeline</h1>
          <p className="text-sm text-muted-foreground">
            Visualize and manage the deal flow across your KOL partnership
            pipeline.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="rounded-full bg-[#FFF5FC] p-4 mb-4">
          <GitBranch className="h-8 w-8 text-[#FF4FD8]" />
        </div>
        <p className="text-sm font-medium text-foreground">Pipeline is empty</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Add partners to your pipeline to track deal progress and stages.
        </p>
      </div>
    </div>
  );
}
