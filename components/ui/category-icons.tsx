import type { SVGProps } from "react";

/** Minimal line icons matching the brand guide's icon set (see docs/brand-guide-page-11.png). */
const shared: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function LaptopIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <rect x="4" y="4" width="16" height="10" rx="1" />
      <path d="M2 18h20l-1.5-3H3.5L2 18Z" />
    </svg>
  );
}

export function HeadphonesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="2.5" y="14" width="4" height="6" rx="1.5" />
      <rect x="17.5" y="14" width="4" height="6" rx="1.5" />
    </svg>
  );
}

export function AccessoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <line x1="7" y1="18" x2="17" y2="18" />
    </svg>
  );
}

export function NetworkingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <circle cx="12" cy="4" r="1.75" />
      <circle cx="5" cy="19" r="1.75" />
      <circle cx="19" cy="19" r="1.75" />
      <path d="M12 5.75V12M12 12 6 17.5M12 12l6 5.5" />
    </svg>
  );
}

export function GadgetIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...shared} {...props}>
      <rect x="6" y="2.5" width="12" height="19" rx="2.5" />
      <line x1="10" y1="19" x2="14" y2="19" />
    </svg>
  );
}
