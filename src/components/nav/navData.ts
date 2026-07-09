// Navigation model for the header. Kept as plain data so the mega-menu island
// and the mobile accordion render from one source. Links map to the source
// site's information architecture (see README content-mapping note).

export interface FeaturedCard {
  title: string;
  description: string;
  href: string;
  image: string;
  cta: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  // Items without a panel are plain links (none currently, but supported).
  panel?: {
    // Left column: vertical stack of category links.
    links: { label: string; href: string }[];
    // Right area: exactly two featured cards, side by side.
    featured: [FeaturedCard, FeaturedCard];
  };
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "products",
    label: "Products",
    href: "/products",
    panel: {
      links: [
        { label: "Load Frames", href: "/products/load-frames" },
        { label: "Load Cells", href: "/products/load-cells" },
        { label: "Grips & Fixtures", href: "/products/grips-fixtures" },
        { label: "Extensometers", href: "/products/extensometers" },
        { label: "Retrofit Test Frame", href: "/products/load-frames" },
        { label: "Test Frames in Stock", href: "/products/load-frames" },
      ],
      featured: [
        {
          title: "Model 4500 Series Frames",
          description:
            "Rebuilt and retrofit 4500 series frames, tuned to your specification.",
          href: "/products/load-frames",
          image: "/images/mega-frames.svg",
          cta: "Learn More",
        },
        {
          title: "Single Column Tensile Tester",
          description:
            "A compact frame that tests up to 1000 lbs and fits on a bench.",
          href: "/products/load-frames",
          image: "/images/mega-single-column.svg",
          cta: "Start Now",
        },
      ],
    },
  },
  {
    id: "solutions",
    label: "Solutions",
    href: "/industries",
    panel: {
      links: [
        { label: "Aerospace", href: "/industries/aerospace" },
        { label: "Automotive", href: "/industries/automotive" },
        { label: "Medical & Biomedical", href: "/industries/medical" },
        { label: "Plastics & Rubber", href: "/industries/plastics" },
        { label: "Textiles", href: "/industries/textiles" },
        { label: "Research & Academia", href: "/industries/research" },
      ],
      featured: [
        {
          title: "Industries We Serve",
          description:
            "On-site calibration and service across regulated and research labs.",
          href: "/industries",
          image: "/images/mega-industries.svg",
          cta: "Learn More",
        },
        {
          title: "Accredited Calibration",
          description:
            "A2LA-accredited force, displacement, and speed calibration.",
          href: "/products/calibration-verification",
          image: "/images/mega-calibration.svg",
          cta: "Learn More",
        },
      ],
    },
  },
  {
    id: "learn",
    label: "Learn",
    href: "/news",
    panel: {
      links: [
        { label: "News & Videos", href: "/news" },
        { label: "Technical Information", href: "/news" },
        { label: "Calibration Standards", href: "/products/calibration-verification" },
        { label: "Case Studies", href: "/news" },
      ],
      featured: [
        {
          title: "Calibration for Tensile Testing Equipment",
          description:
            "The ASTM and ISO methods we are accredited to perform.",
          href: "/news",
          image: "/images/mega-technical.svg",
          cta: "Read More",
        },
        {
          title: "Instru-Met Tensile Testers",
          description:
            "Built on 50 years of repairing every tester on the market.",
          href: "/news",
          image: "/images/mega-industries.svg",
          cta: "Read More",
        },
      ],
    },
  },
  {
    id: "support",
    label: "Support",
    href: "/products/repairs-service",
    panel: {
      links: [
        { label: "Tensile Tester Service & Calibration", href: "/products/repairs-service" },
        { label: "Force Calibration (ASTM E4)", href: "/products/calibration-verification" },
        { label: "Repairs", href: "/products/repairs-service" },
        { label: "OEM Frames We Service", href: "/products/repairs-service" },
      ],
      featured: [
        {
          title: "On-Site Repair & Calibration",
          description:
            "We come to your lab with parts in hand, often resolving issues in 24 hours.",
          href: "/products/repairs-service",
          image: "/images/mega-service.svg",
          cta: "Learn More",
        },
        {
          title: "End-of-Life Instron 5500",
          description:
            "Three ways we keep an end-of-life 5500 running, with no end-of-life policy.",
          href: "/news",
          image: "/images/mega-technical.svg",
          cta: "Read More",
        },
      ],
    },
  },
];

export const CONTACT_HREF = "/contact";
