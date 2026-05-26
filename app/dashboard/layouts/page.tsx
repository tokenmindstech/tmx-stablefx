import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const layouts = [
  {
    id: 1,
    name: "Classic Light",
    description:
      "Clean white layout with left collapsible sidebar, top header, and a standard card grid. Minimal and professional.",
    tags: ["Sidebar Left", "Card Grid", "Breadcrumb"],
    accent: "#FF4FD8",
  },
  {
    id: 3,
    name: "Top Navigation",
    description:
      "No sidebar — navigation lives in a horizontal tab bar at the top. Full-width content area for maximum data space.",
    tags: ["Top Nav", "Full Width", "Quick Actions"],
    accent: "#FF4FD8",
  },
  {
    id: 4,
    name: "Floating Panel",
    description:
      "Sidebar rendered as a floating inset panel with rounded corners. Cards are elevated with stronger shadows on a gray background.",
    tags: ["Floating Sidebar", "Elevated Cards", "Gray BG"],
    accent: "#FF4FD8",
  },
  {
    id: 5,
    name: "Compact & Dense",
    description:
      "Data-dense layout with an inline metrics strip, sub-navigation tabs, and a full data table.",
    tags: ["Sidebar Left", "Sub-Tabs", "Data Table"],
    accent: "#FF4FD8",
  },
  {
    id: 6,
    name: "Hero Stats Banner",
    description:
      "Full-width pink-to-purple gradient hero banner at the top with large stats overlaid. Charts and activity below.",
    tags: ["Sidebar Left", "Hero Banner", "Gradient"],
    accent: "#FF4FD8",
  },
  {
    id: 7,
    name: "Right Rail Sidebar",
    description:
      "Sidebar on the right, main content flows from the left. Reversed layout gives a fresh visual balance.",
    tags: ["Sidebar Right", "Card Grid", "Reversed"],
    accent: "#FF4FD8",
  },
  {
    id: 8,
    name: "Bento Grid",
    description:
      "Asymmetric bento-style grid with cells of varying sizes. No sidebar — full horizontal navigation with a feature chart spanning multiple rows.",
    tags: ["Top Nav", "Bento Grid", "Asymmetric"],
    accent: "#FF4FD8",
  },
  {
    id: 9,
    name: "Minimal Typography",
    description:
      "Ultra-clean layout with generous whitespace, large typographic stats without heavy card borders, and thin dividers.",
    tags: ["Sidebar Left", "Minimal", "Typography-First"],
    accent: "#FF4FD8",
  },
  {
    id: 10,
    name: "Split Overview Panel",
    description:
      "Fixed left overview panel with user info and quick stats alongside the main scrollable content — no traditional sidebar.",
    tags: ["Split Panel", "Fixed Left", "No Sidebar"],
    accent: "#FF4FD8",
  },
  {
    id: 11,
    name: "Tabbed Content",
    description:
      "Sidebar on left, a prominent tab switcher in the content area with uniquely arranged panels per tab: Overview, Analytics, Pipeline.",
    tags: ["Sidebar Left", "Tab Switcher", "Multi-Panel"],
    accent: "#FF4FD8",
  },
];

export default function LayoutsIndex() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Layout Variations
          </h1>
          <p className="text-muted-foreground">
            10 dashboard layout options — click any to preview the full layout.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {layouts.map((layout) => (
            <Link key={layout.id} href={`/dashboard/layouts/${layout.id}`}>
              <Card className="h-full border border-border/60 hover:border-[#FF4FD8]/40 hover:shadow-lg transition-all duration-200 cursor-pointer group">
                {/* Preview thumbnail */}
                <div
                  className="h-36 rounded-t-xl flex items-center justify-center relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${layout.accent}18, ${layout.accent}08)`,
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 19px, ${layout.accent}30 19px, ${layout.accent}30 20px), repeating-linear-gradient(90deg, transparent, transparent 19px, ${layout.accent}30 19px, ${layout.accent}30 20px)`,
                    }}
                  />
                  <span
                    className="text-5xl font-black relative z-10 opacity-20 group-hover:opacity-30 transition-opacity"
                    style={{ color: layout.accent }}
                  >
                    {layout.id}
                  </span>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: layout.accent }}
                    />
                    <CardTitle className="text-base">{layout.name}</CardTitle>
                  </div>
                  <CardDescription className="text-sm leading-relaxed">
                    {layout.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-1.5">
                    {layout.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: `${layout.accent}40`,
                          color: layout.accent,
                          backgroundColor: `${layout.accent}10`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          After the client picks a layout, the others can be removed.
        </p>
      </div>
    </div>
  );
}
