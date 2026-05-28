import { FileText } from "lucide-react";

export default function ContentBriefPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-[#FFF5FC] p-2.5">
          <FileText className="h-5 w-5 text-[#FF4FD8]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Content / Brief
          </h1>
          <p className="text-sm text-muted-foreground">
            Create and distribute content briefs to your KOL partners.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="rounded-full bg-[#FFF5FC] p-4 mb-4">
          <FileText className="h-8 w-8 text-[#FF4FD8]" />
        </div>
        <p className="text-sm font-medium text-foreground">No briefs yet</p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Draft your first content brief to align KOLs with your campaign goals.
        </p>
      </div>
    </div>
  );
}
