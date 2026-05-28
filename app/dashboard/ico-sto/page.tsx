import { Landmark } from "lucide-react";

export default function IcoStoPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-[#FFF5FC] p-2.5">
          <Landmark className="h-5 w-5 text-[#FF4FD8]" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">ICO / STO</h1>
          <p className="text-sm text-muted-foreground">
            Configure and oversee your Initial Coin Offering or Security Token
            Offering.
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 py-24 text-center">
        <div className="rounded-full bg-[#FFF5FC] p-4 mb-4">
          <Landmark className="h-8 w-8 text-[#FF4FD8]" />
        </div>
        <p className="text-sm font-medium text-foreground">
          No offering configured
        </p>
        <p className="mt-1 text-xs text-muted-foreground max-w-xs">
          Set up your ICO or STO parameters to launch your token sale.
        </p>
      </div>
    </div>
  );
}
