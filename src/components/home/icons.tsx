import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { className?: string };

/* Node-and-edge mark: four nodes joined by clean lines, slightly asymmetric. */
export function MeshMark({ className, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={className} {...props}>
      <path
        d="M16 4 27 12.5 22 27 8 24 5 11.5 16 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M16 4 22 27M5 11.5 27 12.5M8 24 16 4"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.7"
      />
      <circle cx="16" cy="4" r="2" fill="currentColor" />
      <circle cx="27" cy="12.5" r="2" fill="currentColor" />
      <circle cx="22" cy="27" r="2" fill="currentColor" />
      <circle cx="8" cy="24" r="2" fill="currentColor" />
      <circle cx="5" cy="11.5" r="2" fill="currentColor" />
    </svg>
  );
}

export function BetaPill({ className = "" }: { className?: string }) {
  return (
    <span
      className={`rounded-full border-[1.5px] border-ink bg-pink px-2 py-0.5 text-[11px] font-bold text-ink ${className}`}
    >
      Beta
    </span>
  );
}

export function HamburgerIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 30 30" className={className}>
      <rect x="4" y="9" width="22" height="2" rx="1" />
      <rect x="4" y="19" width="22" height="2" rx="1" />
    </svg>
  );
}

export function InfoIcon({ className }: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 39 38" width="16" height="16" className={className}>
      <rect height="35.92" rx="17.96" stroke="currentColor" strokeWidth="1.77" width="35.92" x="1.42" y="0.92" />
      <path
        d="M18.22 29.04V14.68h2.35v14.36h-2.35ZM19.38 11.97c-.93 0-1.64-.71-1.64-1.61 0-.9.71-1.64 1.64-1.64.93 0 1.64.71 1.64 1.64 0 .9-.71 1.61-1.64 1.61Z"
        fill="currentColor"
      />
    </svg>
  );
}

/* ---- Spot illustrations: wireframe line-art, drawn in chunky ink to match the sticker style ---- */

export function ChatSpot({ className }: IconProps) {
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden="true" className={className}>
      <path
        d="M28 42h94a8 8 0 0 1 8 8v46a8 8 0 0 1-8 8H70l-22 20v-20H28a8 8 0 0 1-8-8V50a8 8 0 0 1 8-8Z"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M20 74h110M75 42l24 62M75 42 51 104" stroke="currentColor" strokeWidth="3" opacity="0.55" />
      <circle cx="75" cy="42" r="7" fill="currentColor" />
      <circle cx="99" cy="104" r="7" fill="currentColor" />
      <circle cx="51" cy="104" r="7" fill="currentColor" />
      <circle cx="20" cy="74" r="7" fill="currentColor" />
      <circle cx="130" cy="74" r="7" fill="currentColor" />
    </svg>
  );
}

export function GpuSpot({ className }: IconProps) {
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden="true" className={className}>
      <rect x="25" y="40" width="100" height="62" rx="6" stroke="currentColor" strokeWidth="5" />
      <rect x="43" y="55" width="34" height="32" rx="3" stroke="currentColor" strokeWidth="4" />
      <path
        d="M90 55h22M90 65h22M90 75h14M35 102v12M55 102v12M75 102v12M95 102v12M115 102v12"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="60" cy="71" r="7" fill="currentColor" />
      <path d="M60 40V28m0 0 30-10M60 28 30 18" stroke="currentColor" strokeWidth="3" opacity="0.55" />
      <circle cx="90" cy="18" r="6" fill="currentColor" />
      <circle cx="30" cy="18" r="6" fill="currentColor" />
    </svg>
  );
}

export function ApiSpot({ className }: IconProps) {
  return (
    <svg viewBox="0 0 150 150" fill="none" aria-hidden="true" className={className}>
      <rect x="20" y="34" width="110" height="82" rx="8" stroke="currentColor" strokeWidth="5" />
      <path d="M20 52h110" stroke="currentColor" strokeWidth="4" />
      <circle cx="32" cy="43" r="7" fill="currentColor" />
      <circle cx="41" cy="43" r="7" fill="currentColor" />
      <circle cx="50" cy="43" r="7" fill="currentColor" />
      <path
        d="m48 70-12 14 12 14M102 70l12 14-12 14M84 66l-18 40"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ---- Privacy line icons ---- */

export function LockIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect x="10" y="21" width="28" height="20" rx="4" stroke="currentColor" strokeWidth="3.2" />
      <path d="M16 21v-5a8 8 0 0 1 16 0v5" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="24" cy="31" r="3" fill="currentColor" />
    </svg>
  );
}

export function KeyIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <circle cx="17" cy="24" r="8" stroke="currentColor" strokeWidth="3.2" />
      <path d="M25 24h16m-6 0v7m-6-7v5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function NoLogsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <ellipse cx="24" cy="13" rx="14" ry="6" stroke="currentColor" strokeWidth="3.2" />
      <path
        d="M10 13v22c0 3.3 6.3 6 14 6s14-2.7 14-6V13M10 24c0 3.3 6.3 6 14 6s14-2.7 14-6"
        stroke="currentColor"
        strokeWidth="3.2"
      />
      <path d="M8 42 40 6" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}

export function WalletIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <rect x="7" y="13" width="34" height="24" rx="4" stroke="currentColor" strokeWidth="3.2" />
      <path d="M41 20h-9a5 5 0 0 0 0 10h9" stroke="currentColor" strokeWidth="3.2" />
      <circle cx="33" cy="25" r="2" fill="currentColor" />
    </svg>
  );
}

export function ExplorerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <circle cx="8" cy="12" r="2" fill="currentColor" />
      <circle cx="16" cy="12" r="2" fill="currentColor" />
      <circle cx="12" cy="7" r="1.5" fill="currentColor" />
      <path d="M9.5 11 12 8m2.5 3L12 8m-4 4h8" stroke="currentColor" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}
