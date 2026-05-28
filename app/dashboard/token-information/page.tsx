import { Coins } from "lucide-react";

export default function TokenInformationPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-[#FFF5FC] p-2.5">
          <Coins className="h-5 w-5 text-[#FF4FD8]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Token Information
          </h1>
          <p className="text-sm text-muted-foreground">
            View and configure your token details, supply, and distribution
            settings.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="rounded-full bg-[#FFF5FC] p-4 mb-4">
          <Coins className="h-8 w-8 text-[#FF4FD8]" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No token configured
        </p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Set up your token information to get started with the TGE dashboard.
        </p>
      </div>
    </div>
  );
}
