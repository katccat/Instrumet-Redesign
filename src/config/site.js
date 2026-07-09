// ---------------------------------------------------------------------------
// Site configuration
//
// Edit brand text, contact details, and external links here — nothing in the
// components hard-codes these values. Plain JS on purpose (easy to hand-edit).
// ---------------------------------------------------------------------------

export const site = {
  // Wordmark shown next to the logo. The company's real name is "Instru-Met";
  // change this single value to restyle the wordmark everywhere.
  wordmark: "Instru-Met",
  companyName: "Instru-Met Corporation",
  tagline: "50 years of service",
  foundedYear: 1974,

  contact: {
    phone: "(908) 851-0700",
    phoneHref: "tel:+19088510700",
    email: "sales@instrumet.com",
    fax: "908-686-1688",
    address: {
      street: "931 Lehigh Ave",
      city: "Union",
      state: "NJ",
      zip: "07083",
    },
  },

  // Key staff (from the redesign brief).
  people: [
    { role: "Service Manager", name: "Paul Metzger", email: "paulmetzger@instrumet.com" },
    { role: "Production Manager", name: "Ward Ruoff", email: "wardruoff@instrumet.com" },
  ],

  social: [
    { label: "YouTube", href: "https://www.youtube.com/@instrumetcorporation" },
    {
      label: "Facebook",
      href: "https://www.facebook.com/p/Instru-Met-Corporation-100063479472507/",
    },
  ],

  // External accreditation reference.
  a2laDirectoryUrl:
    "https://customer.a2la.org/index.cfm?event=directory.detail&labPID=1160BEEC-3FF0-4576-9902-D096B159C0BC",
};

// ---------------------------------------------------------------------------
// Primary navigation (lower tier).
//
// Items with `panel` render as click-to-open mega-menu triggers. Each panel
// has a `links` column (left) and two `featured` cards (right).
// ---------------------------------------------------------------------------

export const nav = [
  {
    label: "Products",
    href: "/products",
    panel: {
      links: [
        { label: "Load Cells", href: "/products#load-cells" },
        { label: "Grips & Fixtures", href: "/products#grips-fixtures" },
        { label: "Load Frames", href: "/products#load-frames" },
      ],
      featured: [
        {
          title: "Cord Capstan Tensile Grip",
          description:
            "Self-tightening capstan grips rated to 2.5 kN (500 lbf) for cords, yarns, and flexible specimens.",
          href: "/articles/cord-capstan-tensile-grip",
          cta: "Learn More",
          image: null,
          imageAlt: "Capstan tensile grip",
        },
        {
          title: "Single Column Tensile Testers",
          description:
            "Compact, tabletop universal testing machines that test up to 1000 lb — testing within minutes.",
          href: "/products#load-frames",
          cta: "Start Now",
          image: "/images/single-column.jpg",
          imageAlt: "Single column tensile tester",
        },
      ],
    },
  },
  {
    label: "Services",
    href: "/services",
    panel: {
      links: [
        { label: "Calibration / Verification", href: "/services#calibration" },
        { label: "Repair", href: "/services#repair" },
      ],
      featured: [
        {
          title: "Calibration & Verification",
          description:
            "A2LA-accredited, NIST-traceable force, extensometer, and crosshead-speed calibration — on-site.",
          href: "/services#calibration",
          cta: "Learn More",
          image: "/images/calibration.jpg",
          imageAlt: "On-site calibration of a testing machine",
        },
        {
          title: "Repair & Upgrade",
          description:
            "On-site and in-lab repair for load cells, frames, and grips — typical response under 24 hours.",
          href: "/services#repair",
          cta: "Start Now",
          image: "/images/repair-tensile-tester.jpg",
          imageAlt: "Tensile tester repair",
        },
      ],
    },
  },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
];
