import * as React from "react";

// Pill tabs (per /_assets/inspirations/pill-tabs.png): a row of pill-shaped
// tabs switches the image + copy shown below. Content is the service
// descriptions split out of the old homepage.

export default function ServiceTabs({ tabs }) {
  const [active, setActive] = React.useState(0);
  const current = tabs[active];

  return (
    <div>
      {/* Pills */}
      <div role="tablist" aria-label="Services" className="pill-row">
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
            className="pill"
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
        className="service-tabs__panel"
      >
        <div className="service-tabs__media">
          {current.image ? (
            <img
              src={current.image}
              alt={current.imageAlt || ""}
              className="media-img"
            />
          ) : (
            <div className="service-tabs__placeholder">
              Image: {current.imageAlt || current.label}
            </div>
          )}
        </div>
        <div className="service-tabs__body">
          <h3 className="service-tabs__title">{current.heading}</h3>
          <p className="service-tabs__text">{current.body}</p>
          <a href={current.href} className="service-tabs__cta">
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
