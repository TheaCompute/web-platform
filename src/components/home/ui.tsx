import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Shared visual vocabulary for the homepage: peach pill eyebrows,
   pill buttons with hard ink shadows, and pixel sparkles that echo
   the pixel-art logo. */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("eyebrow", className)}>{children}</span>;
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark";
  size?: "md" | "lg";
  className?: string;
}

export function ButtonLink({ href, children, variant = "primary", size = "md", className }: ButtonLinkProps) {
  const cls = cn("btn", `btn-${variant}`, size === "lg" && "btn-lg", className);
  if (!href.startsWith("/")) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  );
}

/** Four-point pixel star, drawn on a 7x7 grid. */
export function Sparkle({
  className,
  color = "var(--pink)",
  style,
}: {
  className?: string;
  color?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      viewBox="0 0 7 7"
      aria-hidden
      shapeRendering="crispEdges"
      className={cn("pointer-events-none", className)}
      style={style}
    >
      <path
        fill={color}
        d="M3 0h1v2H3zM3 5h1v2H3zM0 3h2v1H0zM5 3h2v1H5zM2 2h3v3H2z"
      />
    </svg>
  );
}

/** Pixel heart, drawn on a 7x6 grid. */
export function PixelHeart({ className, color = "var(--pink)" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 7 6" aria-hidden shapeRendering="crispEdges" className={cn("pointer-events-none", className)}>
      <path fill={color} d="M1 0h2v1H1zM4 0h2v1H4zM0 1h7v2H0zM1 3h5v1H1zM2 4h3v1H2zM3 5h1v1H3z" />
    </svg>
  );
}
