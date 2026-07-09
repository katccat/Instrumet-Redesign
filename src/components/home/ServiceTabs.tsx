import * as React from "react";
import { cn } from "@/lib/utils";

// Pill tabs (per /_assets/inspirations/pill-tabs.png): a row of pill-shaped
// tabs switches the image + copy shown below. Content is the service
// descriptions split out of the old homepage.

export default function ServiceTabs({ tabs }) {
  const [active, setActive] = React.useState(0);
  const current = tabs[active];

  return (
    <div>
      {/* Pills */}
      <div role="tablist" aria-label="Services" className="flex flex-wrap gap-3">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            role="tab"
            id={`svc-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`svc-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight")
                setActive((a) => (a + 1) % tabs.length);
              if (e.key === "ArrowLeft")
                setActive((a) => (a - 1 + tabs.length) % tabs.length);
            }}
            className={cn(
              "rounded-full border px-5 py-2 text-sm font-medium transition-colors",
              active === i
                ? "border-accent bg-accent text-accent-foreground"
                : "border-input bg-background text-foreground hover:border-accent hover:text-accent"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div
        role="tabpanel"
        id={`svc-panel-${active}`}
        aria-labelledby={`svc-tab-${active}`}
        className="mt-8 grid items-stretch gap-8 border border-border md:grid-cols-2"
      >
        <div className="min-h-64 bg-muted md:min-h-96">
          {current.image ? (
            <img
              src={current.image}
              alt={current.imageAlt || ""}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted-foreground">
              Image: {current.imageAlt || current.label}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            {current.heading}
          </h3>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            {current.body}
          </p>
          <a
            href={current.href}
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
          >
            {current.cta || "Learn More"}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
