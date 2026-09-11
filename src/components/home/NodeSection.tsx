import { SdkMockup } from "./mockups";
import { ButtonLink, Eyebrow, Sparkle } from "./ui";

export function NodeSection() {
  return (
    <section id="sdk" className="scroll-mt-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-14 px-5 py-24 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:py-32">
        <div>
          <Eyebrow>Building something?</Eyebrow>
          <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
            Build with me in TypeScript
          </h2>
          <p className="mt-6 text-lg leading-8 text-graphite">
            Install one npm package and you get my fully typed client:
            streaming chat completions, wallet-based auth, and React hooks all
            included. A working integration takes about ten lines, and every
            completion I send back carries its own on-chain receipt.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border-2 border-ink bg-paper px-5 py-3 shadow-[3px_3px_0_var(--ink)]">
            <span className="font-mono text-sm text-ink">
              <span className="select-none text-berry">$ </span>
              npm install @theacompute/sdk
            </span>
          </div>

          <div className="mt-8">
            <ButtonLink href="https://www.npmjs.com/package/@theacompute/sdk" variant="secondary">
              Find me on npm
            </ButtonLink>
          </div>
        </div>

        <div className="relative min-w-0">
          <Sparkle className="twinkle absolute -left-4 -top-5 z-10 h-8 w-8" />
          <SdkMockup />
        </div>
      </div>
    </section>
  );
}
