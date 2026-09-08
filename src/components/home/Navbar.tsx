"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { HamburgerIcon } from "./icons";

const navLinks = [
  { label: "Network", href: "/#network" },
  { label: "Pricing", href: "/#pricing" },
  { label: "SDK", href: "/#sdk" },
  { label: "Privacy", href: "/#privacy" },
  { label: "Docs", href: "https://docs.theacompute.com" },
];

function NavLink({ href, label, className, onClick }: { href: string; label: string; className: string; onClick?: () => void }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
      {label}
    </a>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <nav className="sticker mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full py-2 pl-3 pr-3 shadow-[4px_4px_0_var(--ink)]">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-peach-deep">
            <Image
              src="/images/logo-transparent.png"
              alt=""
              width={44}
              height={44}
              className="mt-2 h-11 w-11 object-cover"
              priority
            />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-ink">
            TheaCompute
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              href={link.href}
              label={link.label}
              className="rounded-full px-4 py-2 text-[15px] font-semibold text-graphite transition-colors hover:bg-peach hover:text-ink"
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link href="/app" className="btn btn-primary hidden sm:inline-flex">
            Open app
          </Link>
          <button
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-ink bg-paper text-ink transition-colors hover:bg-peach lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <HamburgerIcon className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="sticker mx-auto mt-3 max-w-6xl p-3 lg:hidden">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                href={link.href}
                label={link.label}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-ink transition-colors hover:bg-peach"
              />
            ))}
            <Link href="/app" onClick={() => setMenuOpen(false)} className="btn btn-primary mt-2">
              Open app
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
