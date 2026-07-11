import * as React from "react";

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

// Rotation is driven by CSS: the parent trigger's `aria-expanded="true"`
// flips this chevron (see `.nav-chevron` in nav.css).
const ChevronIcon = () => (
  <svg
    className="nav-chevron"
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
    <a href={card.href} className="feature-card">
      <div className="feature-card__media">
        {card.image ? (
          <img
            src={card.image}
            alt={card.imageAlt || ""}
            loading="lazy"
            className="feature-card__img"
          />
        ) : (
          <div className="feature-card__placeholder">
            Image: {card.imageAlt || "featured"}
          </div>
        )}
      </div>
      <div className="feature-card__body">
        <h3 className="feature-card__title">{card.title}</h3>
        <p className="feature-card__desc">{card.description}</p>
        <span className="feature-card__cta">
          {card.cta}
          <ArrowIcon className="feature-card__cta-arrow" />
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
    <div ref={rootRef} className="site-nav">
      {/* Lower tier bar */}
      <div className="site-container nav-bar">
        {/* Desktop nav — mega-menu is desktop only */}
        <nav aria-label="Primary" className="nav-desktop">
          <ul className="nav-desktop__list">
            {nav.map((item, index) =>
              item.panel ? (
                <li key={item.label}>
                  <button
                    ref={(el) => {
                      triggerRefs.current[index] = el;
                    }}
                    type="button"
                    aria-expanded={openIndex === index}
                    aria-controls={`meganav-panel-${index}`}
                    onClick={() => toggle(index)}
                    className="nav-link"
                  >
                    {item.label}
                    <ChevronIcon />
                    {/* Active indicator */}
                    <span className="nav-link__indicator" />
                  </button>
                </li>
              ) : (
                <li key={item.label}>
                  <a href={item.href} className="nav-link">
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
          className="nav-mobile-toggle"
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
          className="meganav"
        >
          <div className="site-container meganav__inner">
            {/* Left: category links */}
            <div className="meganav__col-links">
              <p className="meganav__label">{nav[openIndex].label}</p>
              <ul className="meganav__links">
                {nav[openIndex].panel.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="meganav__link">
                      {link.label}
                      <ArrowIcon className="meganav__arrow" />
                    </a>
                  </li>
                ))}
              </ul>
              <a href={nav[openIndex].href} className="meganav__viewall">
                View all {nav[openIndex].label.toLowerCase()}
                <ArrowIcon />
              </a>
            </div>

            {/* Right: two featured cards side by side */}
            <div className="meganav__col-featured">
              {nav[openIndex].panel.featured.map((card) => (
                <FeaturedCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile menu — stacked list / accordion, no mega-menu layout */}
      {mobileOpen && (
        <div id="mobile-menu" className="nav-mobile">
          <nav aria-label="Mobile" className="nav-mobile__nav">
            <ul className="nav-mobile__list">
              {nav.map((item, index) =>
                item.panel ? (
                  <li key={item.label} className="nav-mobile__item">
                    <button
                      type="button"
                      className="nav-mobile__trigger"
                      aria-expanded={mobileExpanded === index}
                      onClick={() =>
                        setMobileExpanded((v) => (v === index ? null : index))
                      }
                    >
                      {item.label}
                      <ChevronIcon />
                    </button>
                    {mobileExpanded === index && (
                      <ul className="nav-mobile__sublist">
                        {item.panel.links.map((link) => (
                          <li key={link.href}>
                            <a href={link.href} className="nav-mobile__sublink">
                              {link.label}
                            </a>
                          </li>
                        ))}
                        <li>
                          <a href={item.href} className="nav-mobile__viewall">
                            View all {item.label.toLowerCase()}
                          </a>
                        </li>
                      </ul>
                    )}
                  </li>
                ) : (
                  <li key={item.label}>
                    <a href={item.href} className="nav-mobile__link">
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
