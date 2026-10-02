import Link from "next/link";

type LinkItem = { label: string; href: string };

const PRODUCT: LinkItem[] = [
  { label: "App", href: "/app" },
  { label: "Product", href: "/#features" },
  { label: "Who it's for", href: "/#use-cases" },
  { label: "TypeScript SDK", href: "https://www.npmjs.com/package/@theacompute/sdk" },

];

const DEVELOPERS: LinkItem[] = [
  { label: "Quickstart", href: "https://docs.theacompute.com/quickstart" },
  { label: "API reference", href: "https://docs.theacompute.com/api-reference/authentication" },
  { label: "Webhooks", href: "https://docs.theacompute.com/api-reference/webhooks" },
  { label: "LangChain tool", href: "https://docs.theacompute.com/integrations/langchain" },
];

const RESOURCES: LinkItem[] = [
  { label: "Documentation", href: "https://docs.theacompute.com" },
  { label: "Core concepts", href: "https://docs.theacompute.com/core-concepts" },
  { label: "Privacy", href: "https://docs.theacompute.com/core-concepts/privacy" },
  { label: "Architecture", href: "https://docs.theacompute.com/architecture" },
];

const COMPANY: LinkItem[] = [
  { label: "X / @theacompute", href: "https://x.com/theacompute" },
  { label: "GitHub", href: "https://github.com/theacompute" },
];

export function Footer() {
  return (
    <footer
      id="be-footer"
      className="text-white"
      aria-label="Site footer"
      style={{ background: "var(--surface-dark)" }}
    >
      <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-20">
        <div className="mb-10 flex items-center gap-4">
          <Link
            href="/"
            aria-label="TheaCompute home"
            className="inline-flex items-center gap-2"
          >
            <span className="text-[26px] font-heading text-white">
              TheaCompute
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Column heading="Product" links={PRODUCT} />
          <Column heading="Developers" links={DEVELOPERS} />
          <Column heading="Resources" links={RESOURCES} />
          <Column heading="More" links={COMPANY} />
        </div>

        <div className="mt-20 space-y-3 text-[14px] text-white/60">
          <p>
            An inference network owned by the people who run it, with every payment settled in the open on Robinhood Chain.
          </p>
          <p>© 2026 TheaCompute.</p>
        </div>
      </div>
    </footer>
  );
}

function Column({ heading, links }: { heading: string; links: LinkItem[] }) {
  return (
    <div>
      <h3
        className="mb-3 text-[18px] uppercase tracking-[0.1em] text-white/50"
      >
        {heading}
      </h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-[15px] text-white/70 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
