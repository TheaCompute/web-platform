"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* Shared visual vocabulary for the app, matching the homepage:
   white cards on cream, ink outlines, pill buttons with hard shadows,
   and pink as the single accent. */

/** Small bold label for metadata and table headers. */
export function MonoTag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("text-xs font-bold text-graphite", className)}>{children}</span>;
}

/** Card surface. "quiet" for dense content, "sticker" for the one panel that matters most. */
export function Panel({
  children,
  className,
  variant = "quiet",
}: {
  children: ReactNode;
  className?: string;
  variant?: "quiet" | "sticker";
}) {
  return (
    <div className={cn("relative overflow-hidden", variant === "sticker" ? "sticker" : "card-quiet", className)}>
      {children}
    </div>
  );
}

/** Panel header strip: title on the left, anything on the right. */
export function PanelHeader({ label, right }: { label: ReactNode; right?: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-line px-5 py-3.5">
      <span className="font-display text-[15px] font-bold text-ink">{label}</span>
      {right}
    </div>
  );
}

interface PixelBtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "ghost" | "dark";
  size?: "sm" | "md";
}

/** Pill button that presses down when clicked. */
export function PixelBtn({ variant = "primary", size = "md", className, children, ...props }: PixelBtnProps) {
  return (
    <button
      className={cn(
        "btn",
        {
          primary: "btn-primary",
          outline: "btn-secondary",
          danger: "btn-danger",
          ghost: "btn-ghost",
          dark: "btn-dark",
        }[variant],
        size === "sm" && "btn-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const STATUS: Record<string, { label: string; cls: string; pulse?: boolean }> = {
  completed: { label: "completed", cls: "bg-pink-soft text-berry" },
  confirmed: { label: "confirmed", cls: "bg-pink-soft text-berry" },
  active:    { label: "active",    cls: "bg-pink-soft text-berry" },
  online:    { label: "online",    cls: "bg-pink-soft text-berry", pulse: true },
  running:   { label: "running",   cls: "bg-peach-deep text-ink", pulse: true },
  verifying: { label: "verifying", cls: "bg-peach-deep text-ink", pulse: true },
  pending:   { label: "pending",   cls: "bg-peach text-graphite" },
  idle:      { label: "idle",      cls: "bg-peach text-graphite" },
  offline:   { label: "offline",   cls: "bg-peach text-graphite" },
  failed:    { label: "failed",    cls: "bg-danger-soft text-danger" },
  disputed:  { label: "disputed",  cls: "bg-danger-soft text-danger" },
  blocked:   { label: "blocked",   cls: "bg-danger-soft text-danger" },
  "policy-violation": { label: "violation", cls: "bg-danger-soft text-danger" },
};

/** Rounded status pill. */
export function StatusChip({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, cls: "bg-peach text-graphite" };
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-bold", s.cls)}>
      <span className={cn("h-1.5 w-1.5 rounded-[2px] bg-current", s.pulse && "animate-pulse")} />
      {s.label}
    </span>
  );
}

/** Model tier pill, colored like the homepage rate card. */
export function TierChip({ tier }: { tier: string }) {
  const cls: Record<string, string> = {
    lite:     "bg-paper",
    standard: "bg-peach",
    pro:      "bg-peach-deep",
    max:      "bg-pink",
  };
  return (
    <span className={cn("inline-block rounded-full border-[1.5px] border-ink px-2 py-px text-[10px] font-bold capitalize text-ink", cls[tier] ?? "bg-paper")}>
      {tier}
    </span>
  );
}

/** Shared input styling. */
export const inputCls = "field";

export const labelCls = "mb-1.5 block text-sm font-bold text-ink";

/** Error message box. */
export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border-[1.5px] border-danger bg-danger-soft px-4 py-3">
      <p className="text-sm font-medium text-danger">{children}</p>
    </div>
  );
}

/** Three hopping pixel dots with a label. */
export function Spinner({ label = "One sec", className }: { label?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-sm font-semibold text-graphite", className)}>
      <span className="hop-dots inline-flex gap-1 text-pink" aria-hidden>
        <span />
        <span />
        <span />
      </span>
      {label}
    </span>
  );
}

/** Friendly empty state with a pixel sparkle. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <svg viewBox="0 0 7 7" aria-hidden shapeRendering="crispEdges" className="twinkle h-8 w-8">
        <path fill="var(--pink)" d="M3 0h1v2H3zM3 5h1v2H3zM0 3h2v1H0zM5 3h2v1H5zM2 2h3v3H2z" />
      </svg>
      <p className="mt-4 font-display text-lg font-bold text-ink">{title}</p>
      {children && <p className="mt-1.5 max-w-sm text-sm text-graphite">{children}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
