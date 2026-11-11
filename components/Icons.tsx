type P = { className?: string };
const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconSearch = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
);
export const IconBag = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5.5 8h13l-1 12h-11l-1-12Z" />
    <path d="M9 8a3 3 0 0 1 6 0" />
  </svg>
);
export const IconChat = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 5h16v11H9l-5 4V5Z" />
  </svg>
);
export const IconMenu = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const IconClose = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconChevron = (p: P) => (
  <svg {...base} width={12} height={12} strokeWidth={2} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const IconArrow = (p: P) => (
  <svg {...base} width={18} height={18} {...p}>
    <path d="M19 12H5M11 6l-6 6 6 6" />
  </svg>
);
export const IconTruck = (p: P) => (
  <svg {...base} width={28} height={28} strokeWidth={1.3} {...p}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
export const IconPen = (p: P) => (
  <svg {...base} width={28} height={28} strokeWidth={1.3} {...p}>
    <path d="M4 20l4-1 11-11-3-3L5 16l-1 4Z" />
    <path d="M14 6l3 3" />
  </svg>
);
export const IconEye = (p: P) => (
  <svg {...base} width={28} height={28} strokeWidth={1.3} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
export const IconGift = (p: P) => (
  <svg {...base} width={28} height={28} strokeWidth={1.3} {...p}>
    <path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13" />
    <path d="M12 7c-2-3-5-3-5-1s3 1 5 1c2 0 5 1 5-1s-3-2-5 1Z" />
  </svg>
);
export const IconWhatsApp = (p: P) => (
  <svg width={22} height={22} viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3.9 2.5 1 2.7.1.2 1.8 2.8 4.5 3.9 1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.2-.3-.2-.5-.3Z" />
  </svg>
);
export const IconInstagram = (p: P) => (
  <svg {...base} strokeWidth={1.6} {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);
