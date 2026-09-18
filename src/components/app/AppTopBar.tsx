"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCredits } from "@/context/CreditsContext";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Overview", href: "/app" },
  { label: "Chat", href: "/app/chat" },
  { label: "Earn", href: "/app/earn" },
  { label: "Jobs", href: "/app/jobs" },
  { label: "Settings", href: "/app/settings" },
];

const ACCOUNT_LINKS = [
  { label: "Wallets", href: "/app/wallets" },
  { label: "Transactions", href: "/app/transactions" },
  { label: "Policies", href: "/app/policies" },
];

const TITLES: Record<string, { title: string; description: string }> = {
  "/app":              { title: "Hey there",     description: "Here's your balance, your latest jobs, and how my network is doing." },
  "/app/chat":         { title: "Chat",         description: "Ask my open models anything. I don't write any of it down." },
  "/app/earn":         { title: "Earn",         description: "Lend me your GPU and I'll pay you in USDG." },
  "/app/jobs":         { title: "Jobs",         description: "Every job I've run for you, each with its own receipt." },
  "/app/settings":     { title: "Settings",     description: "Your units, your API keys, and everything about your account." },
  "/app/wallets":      { title: "Wallets",      description: "The wallets you've connected to me." },
  "/app/transactions": { title: "Transactions", description: "Every settlement I've made for you on Robinhood Chain." },
  "/app/policies":     { title: "Policies",     description: "The spending limits I hold your wallets to." },
};

function isActive(pathname: string, href: string) {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

export function AppTopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { credits, loading } = useCredits();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAccountOpen(false);
    setMenuOpen(false);
    router.push("/app/login");
    router.refresh();
  }

  const closeAll = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  // Signed-out visitors on the auth pages get just the logo and a way home.
  if (pathname === "/app/login" || pathname === "/app/signup") {
    return (
      <header className="relative z-40 shrink-0 border-b-2 border-ink bg-paper">
        <div className="flex h-[68px] items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-peach-deep">
              <Image src="/images/logo-transparent.png" alt="" width={40} height={40} className="mt-2 h-10 w-10 object-cover" priority />
            </span>
            <span className="font-display text-lg font-extrabold text-ink">TheaCompute</span>
          </Link>
          <Link href="/" className="btn btn-secondary btn-sm">
            Back to my homepage
          </Link>
        </div>
      </header>
    );
  }

  return (
    <header className="relative z-40 shrink-0 border-b-2 border-ink bg-paper">
      <div className="relative flex h-[68px] items-center gap-4 px-4 md:px-6">
        <Link href="/app" className="flex shrink-0 items-center gap-2.5" onClick={closeAll}>
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-peach-deep">
            <Image
              src="/images/logo-transparent.png"
              alt=""
              width={40}
              height={40}
              className="mt-2 h-10 w-10 object-cover"
              priority
            />
          </span>
          <span className="hidden font-display text-lg font-extrabold text-ink sm:block">TheaCompute</span>
        </Link>

        {/* Desktop tabs */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border-2 border-ink bg-cream p-1 md:flex">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAll}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                  active ? "bg-pink text-ink shadow-[2px_2px_0_var(--ink)]" : "text-graphite hover:bg-peach hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Link
            href="/app/settings"
            onClick={closeAll}
            className="rounded-full border-2 border-ink bg-peach-deep px-3 py-1 text-sm font-bold text-ink transition-colors hover:bg-peach"
          >
            {loading ? "…" : credits.toLocaleString()} <span className="font-semibold text-ink-2">units</span>
          </Link>

          <div className="relative">
            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((open) => !open)}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink transition-colors",
                accountOpen ? "bg-pink text-ink" : "bg-paper text-ink hover:bg-peach"
              )}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                <path d="M10 10a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                <path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6H3z" />
              </svg>
            </button>

            {accountOpen && (
              <div className="sticker absolute right-0 top-full mt-3 w-56 rounded-3xl p-2">
                <p className="px-3 pb-1 pt-2 text-xs font-bold text-pebble">You</p>
                {ACCOUNT_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeAll}
                    className={cn(
                      "block rounded-2xl px-3 py-2 text-sm font-semibold transition-colors",
                      isActive(pathname, item.href) ? "bg-pink-soft text-berry" : "text-ink hover:bg-peach"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="my-1.5 border-t-[1.5px] border-line" />
                <button
                  onClick={handleSignOut}
                  className="block w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold text-graphite transition-colors hover:bg-peach hover:text-ink"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => {
              setAccountOpen(false);
              setMenuOpen((open) => !open);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink transition-colors hover:bg-peach md:hidden"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4">
              {menuOpen ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t-2 border-ink bg-paper px-3 pb-3 pt-2 md:hidden">
          {[...NAV, ...ACCOUNT_LINKS].map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeAll}
                className={cn(
                  "block rounded-2xl px-4 py-2.5 text-base font-semibold transition-colors",
                  active ? "bg-pink text-ink" : "text-ink hover:bg-peach"
                )}
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="mt-1 block w-full rounded-2xl px-4 py-2.5 text-left text-base font-semibold text-graphite transition-colors hover:bg-peach"
          >
            Sign out
          </button>
        </div>
      )}
    </header>
  );
}

export function PageTitleStrip() {
  const pathname = usePathname();
  const meta = TITLES[pathname];
  if (!meta) return null;

  return (
    <div className="shrink-0 px-4 pb-2 pt-7 md:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="font-display text-3xl font-extrabold text-ink md:text-4xl">{meta.title}</h1>
        <p className="mt-1 text-base text-graphite">{meta.description}</p>
      </div>
    </div>
  );
}
