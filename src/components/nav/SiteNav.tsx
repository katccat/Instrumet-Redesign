import * as React from "react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NAV_ITEMS, CONTACT_HREF, type NavItem } from "./navData";

/*
  SiteNav: the header's interactive island (desktop mega-menu + mobile drawer).

  Why a custom disclosure instead of shadcn/Radix Popover:
   - The panel is ONE shared, full-width surface anchored to the header, not to
     each trigger. Radix Popover anchors to and pairs with a single trigger.
   - Behavior is click-to-toggle and switch-between-triggers, with a focus trap
     scoped to the panel. That is cleaner to express directly than to bend
     Popover's per-trigger model into.

  Interaction contract (per brief):
   - Click a trigger: open its panel. Click the same trigger: close. Click a
     different trigger: switch. Click outside / Escape: close. Never on hover.
   - Active trigger shows an accent bar. Only one panel open at a time.
   - Opening moves focus into the panel; closing returns focus to the trigger;
     focus is trapped in the panel while open.
*/

function Arrow({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

export default function SiteNav({ brand = "Instru-Met" }: { brand?: string }) {
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [mobileExpanded, setMobileExpanded] = React.useState<string | null>(null);

  const rootRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const activeItem: NavItem | undefined = NAV_ITEMS.find((i) => i.id === openId);

  const closePanel = React.useCallback(
    (returnFocus = true) => {
      const id = openId;
      setOpenId(null);
      if (returnFocus && id) triggerRefs.current[id]?.focus();
    },
    [openId],
  );

  const toggle = (id: string) => setOpenId((cur) => (cur === id ? null : id));

  // Close on outside click (anything outside the whole nav root).
  React.useEffect(() => {
    if (!openId) return;
    function onDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openId]);

  // Move focus into the panel when it opens.
  React.useEffect(() => {
    if (!openId) return;
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
  }, [openId]);

  // Escape closes; Tab is trapped within the panel while open.
  const onPanelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      closePanel();
      return;
    }
    if (e.key !== "Tab" || !panelRef.current) return;
    const nodes = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    ).filter((n) => n.offsetParent !== null);
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  // Lock body scroll while the mobile drawer is open.
  React.useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <div ref={rootRef} className="relative">
      <div className="container flex h-16 items-center justify-between gap-6 lg:h-20">
        {/* Brand */}
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground"
        >
          <span
            aria-hidden="true"
            className="grid h-8 w-8 place-items-center bg-primary text-sm font-black text-primary-foreground"
          >
            IM
          </span>
          <span className="hidden sm:inline">{brand}</span>
        </a>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isOpen = openId === item.id;
              return (
                <li key={item.id} className="relative">
                  <button
                    ref={(el) => {
                      triggerRefs.current[item.id] = el;
                    }}
                    type="button"
                    aria-expanded={isOpen}
                    aria-haspopup={item.panel ? "true" : undefined}
                    onClick={() => (item.panel ? toggle(item.id) : undefined)}
                    className={cn(
                      "relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors",
                      isOpen
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    )}
                  >
                    {item.label}
                    {item.panel ? (
                      <Chevron
                        className={cn(
                          "transition-transform",
                          isOpen && "rotate-180",
                        )}
                      />
                    ) : null}
                    {/* Active accent bar */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3 -bottom-[1px] h-0.5 bg-primary transition-opacity",
                        isOpen ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Right cluster: Contact (desktop) + hamburger (mobile) */}
        <div className="flex items-center gap-2">
          <a
            href={CONTACT_HREF}
            className={cn(
              buttonVariants({ variant: "primary", size: "sm" }),
              "hidden lg:inline-flex",
            )}
          >
            Contact Us
          </a>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center text-foreground lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Desktop mega-menu panel: full-width, anchored below the header. */}
      {activeItem?.panel ? (
        <div
          ref={panelRef}
          role="region"
          aria-label={`${activeItem.label} menu`}
          onKeyDown={onPanelKeyDown}
          className="absolute inset-x-0 top-full hidden border-b border-border bg-background shadow-card-hover lg:block"
        >
          <div className="container grid grid-cols-12 gap-10 py-10">
            {/* Left: category links */}
            <div className="col-span-4">
              <p className="eyebrow mb-4">{activeItem.label}</p>
              <ul className="flex flex-col">
                {activeItem.panel.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center justify-between border-b border-border py-3 text-base font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                      <Arrow className="opacity-0 transition-opacity group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: two featured cards side by side */}
            <div className="col-span-8 grid grid-cols-2 gap-6">
              {activeItem.panel.featured.map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  className="group flex flex-col border border-border bg-card transition-shadow hover:shadow-card-hover"
                >
                  <div className="aspect-[16/9] overflow-hidden bg-secondary">
                    <img
                      src={card.image}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-5">
                    <h3 className="text-base font-semibold leading-tight text-foreground">
                      {card.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {card.description}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-primary">
                      {card.cta}
                      <Arrow className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Mobile drawer: hamburger menu with stacked accordion categories. */}
      {mobileOpen ? (
        <div className="border-t border-border bg-background lg:hidden">
          <nav aria-label="Mobile" className="container py-4">
            <ul className="flex flex-col">
              {NAV_ITEMS.map((item) => {
                const expanded = mobileExpanded === item.id;
                return (
                  <li key={item.id} className="border-b border-border">
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setMobileExpanded((cur) =>
                          cur === item.id ? null : item.id,
                        )
                      }
                      className="flex w-full items-center justify-between py-4 text-base font-medium text-foreground"
                    >
                      {item.label}
                      <Chevron
                        className={cn(
                          "transition-transform",
                          expanded && "rotate-180",
                        )}
                      />
                    </button>
                    {expanded && item.panel ? (
                      <ul className="flex flex-col gap-1 pb-4 pl-3">
                        {item.panel.links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              className="block py-2 text-sm text-muted-foreground hover:text-primary"
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <a
              href={CONTACT_HREF}
              className={cn(buttonVariants({ variant: "primary" }), "mt-6 w-full")}
            >
              Contact Us
            </a>
          </nav>
        </div>
      ) : null}
    </div>
  );
}

function MenuIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
