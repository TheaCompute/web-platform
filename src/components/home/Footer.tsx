import Image from "next/image";
import Link from "next/link";
import { XLogo } from "@/components/icons";

const networkLinks = [
  { label: "Chat", href: "/app/chat" },
  { label: "Earn", href: "/app/earn" },
  { label: "Explorer", href: "/app/jobs" },
  { label: "Wallets", href: "/app/wallets" },
];

const developerLinks = [
  { label: "Documentation", href: "https://docs.theacompute.com" },
  { label: "API reference", href: "https://docs.theacompute.com/api-reference" },
  { label: "@theacompute/sdk", href: "https://docs.theacompute.com/integrations/javascript-sdk" },
  { label: "OpenAI-compatible API", href: "https://docs.theacompute.com/integrations/openai-compatible" },
  { label: "Webhooks", href: "https://docs.theacompute.com/api-reference/webhooks" },
];

const socialLinks = [
  { label: "X", href: "https://x.com/theacompute", Icon: XLogo },
  // Hidden until the GitHub org is public. To restore, uncomment and import GitHubLogo.
  // { label: "GitHub", href: "https://github.com/theacompute", Icon: GitHubLogo },
];

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-ink text-cream">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_0.9fr_0.9fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-cream bg-peach-deep">
                <Image src="/images/logo-transparent.png" alt="" width={44} height={44} className="mt-2 h-11 w-11 object-cover" />
              </span>
              <span className="font-display text-2xl font-extrabold">TheaCompute</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-[#b9bdc2]">
              I&apos;m Thea. I run decentralized AI inference and settle every job on Robinhood Chain.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cream text-cream transition-colors hover:bg-pink hover:text-ink"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-5 font-display text-base font-bold text-pink">Use me</h3>
            <nav className="flex flex-col gap-3">
              {networkLinks.map((link) => (
                <Link key={link.label} href={link.href} className="text-sm text-[#d8dbde] transition-colors hover:text-pink">
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <h3 className="mb-5 font-display text-base font-bold text-pink">Build with me</h3>
            <nav className="flex flex-col gap-3">
              {developerLinks.map((link) => (
                <a key={link.label} href={link.href} className="text-sm text-[#d8dbde] transition-colors hover:text-pink">
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-[#33373c] pt-6 text-sm text-[#9ca1a6] md:flex-row md:items-center md:justify-between">
          <span>© 2026 TheaCompute</span>
        </div>
      </div>
    </footer>
  );
}
