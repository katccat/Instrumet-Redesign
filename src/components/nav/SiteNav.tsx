import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Primary navigation island.
//
// Implemented as a *custom disclosure* (not shadcn Popover) — a single owner of
// `openIndex` state gives us the cleanest control over the exact behaviors the
// brief requires: toggle-same-to-close, switch-panels, one-panel-at-a-time,
// outside-click / Escape close, focus-in on open, focus-return on close, and a
// focus trap while open. See README for the rationale.
// ---------------------------------------------------------------------------

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const ChevronIcon = ({ open }: { open: boolean }) => (
  <svg
    className={cn("transition-transform", open && "rotate-180")}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

function FeaturedCard({ card }) {
  return (
    <a
      href={card.href}
      className="group flex flex-col border border-border bg-card transition-colors hover:border-accent"
    >
      <div className="aspect-[16/10] w-full overflow-hidden bg-muted">
        {card.image ? (
          <img
            src={card.image}
            alt={card.imageAlt || ""}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center border-b border-dashed border-border text-xs font-medium text-muted-foreground">
            Image: {card.imageAlt || "featured"}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-base font-semibold text-foreground">{card.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          {card.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          {card.cta}
          <ArrowIcon className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </a>
  );
}

export default function SiteNav({ nav }) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileExpanded, setMobileExpanded] = React.useState<number | null>(null);

  const triggerRefs = React.useRef<Array<HTMLButtonElement | null>>([]);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const close = React.useCallback(
    (returnFocus = true) => {
      const idx = openIndex;
      setOpenIndex(null);
      if (returnFocus && idx != null) {
        // Return focus to the trigger that opened the panel.
        requestAnimationFrame(() => triggerRefs.current[idx]?.focus());
      }
    },
    [openIndex]
  );

  const toggle = (index: number) => {
    setOpenIndex((cur) => (cur === index ? null : index));
  };

  // Move focus INTO the panel when it opens.
  React.useEffect(() => {
    if (openIndex == null) return;
    const panel = panelRef.current;
    if (!panel) return;
    requestAnimationFrame(() => {
      const first = panel.querySelector<HTMLElement>(FOCUSABLE);
      first?.focus();
    });
  }, [openIndex]);

  // Outside click + Escape (document level).
  React.useEffect(() => {
    if (openIndex == null) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        close(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openIndex, close]);

  // Focus trap within the open panel.
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Tab") return;
    const panel = panelRef.current;
    if (!panel) return;
    const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      {/* Lower tier bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Desktop nav — mega-menu is desktop only */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {nav.map((item, index) =>
              item.panel ? (
                <li key={item.label}>
                  <button
                    ref={(el) => (triggerRefs.current[index] = el)}
                    type="button"
                    aria-expanded={openIndex === index}
                    aria-controls={`meganav-panel-${index}`}
                    onClick={() => toggle(index)}
                    className={cn(
                      "relative flex items-center gap-1.5 px-4 py-4 text-sm font-medium transition-colors",
                      openIndex === index
                        ? "text-accent"
                        : "text-foreground hover:text-accent"
                    )}
                  >
                    {item.label}
                    <ChevronIcon open={openIndex === index} />
                    {/* Active indicator */}
                    <span
                      className={cn(
                        "absolute inset-x-3 bottom-0 h-0.5 bg-accent transition-opacity",
                        openIndex === index ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </button>
                </li>
              ) : (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="px-4 py-4 text-sm font-medium text-foreground transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="ml-auto inline-flex items-center justify-center p-2 text-foreground lg:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {mobileOpen ? (
              <path d="M18 6 6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Desktop mega-menu panel — full viewport width, anchored to header */}
      {openIndex != null && nav[openIndex].panel && (
        <div
          id={`meganav-panel-${openIndex}`}
          ref={panelRef}
          role="region"
          aria-label={`${nav[openIndex].label} menu`}
          onKeyDown={onPanelKeyDown}
          className="absolute inset-x-0 top-full z-40 hidden border-t border-border bg-background shadow-lg lg:block"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-12 gap-10 px-4 py-10 sm:px-6 lg:px-8">
            {/* Left: category links */}
            <div className="col-span-4">
              <p className="mb-4 text-sm font-semibold tracking-wide text-accent">
                {nav[openIndex].label}
              </p>
              <ul className="space-y-1">
                {nav[openIndex].panel.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group flex items-center justify-between rounded-btn px-3 py-2.5 text-base font-medium text-foreground transition-colors hover:bg-muted hover:text-accent"
                    >
                      {link.label}
                      <ArrowIcon className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href={nav[openIndex].href}
                className="mt-4 inline-flex items-center gap-1.5 px-3 text-sm font-semibold text-accent hover:underline"
              >
                View all {nav[openIndex].label.toLowerCase()}
                <ArrowIcon />
              </a>
            </div>

            {/* Right: two featured cards side by side */}
            <div className="col-span-8 grid grid-cols-2 gap-6">
              {nav[openIndex].panel.featured.map((card) => (
                <FeaturedCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu — stacked list / accordion, no mega-menu layout */}
      {mobileOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background lg:hidden"
        >
          <nav aria-label="Mobile" className="px-4 py-4 sm:px-6">
            <ul className="divide-y divide-border">
              {nav.map((item, index) =>
                item.panel ? (
                  <li key={item.label} className="py-1">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-3 text-base font-medium text-foreground"
                      aria-expanded={mobileExpanded === index}
                      onClick={() =>
                        setMobileExpanded((v) => (v === index ? null : index))
                      }
                    >
                      {item.label}
                      <ChevronIcon open={mobileExpanded === index} />
                    </button>
                    {mobileExpanded === index && (
                      <ul className="pb-3 pl-3">
                        {item.panel.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              className="block py-2 text-sm text-muted-foreground hover:text-accent"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                        <li>
                          <a
                            href={item.href}
                            className="block py-2 text-sm font-semibold text-accent"
                          >
                            View all {item.label.toLowerCase()}
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="block py-3 text-base font-medium text-foreground hover:text-accent"
                    >
                      {item.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
}
