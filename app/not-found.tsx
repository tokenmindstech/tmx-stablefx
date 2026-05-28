import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center max-w-sm">
        {/* Logo mark */}
        <div
          className="size-14 rounded-2xl flex items-center justify-center text-base font-bold text-white mb-8"
          style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
        >
          TM
        </div>

        {/* 404 number */}
        <p
          className="text-8xl font-extrabold leading-none tracking-tight mb-4"
          style={{
            background: "linear-gradient(135deg, #FF4FD8, #7c3aed)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </p>

        <h1 className="text-xl font-semibold text-foreground mb-2">
          Page not found
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #FF4FD8, #7c3aed)" }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
