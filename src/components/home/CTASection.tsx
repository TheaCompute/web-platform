import Image from "next/image";
import { ButtonLink, Sparkle } from "./ui";

export function CTASection() {
  return (
    <section className="relative overflow-hidden border-t-2 border-ink bg-peach-deep">
      <div className="dot-paper absolute inset-0 opacity-50" aria-hidden />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pt-24 text-center lg:pt-28">
        <div className="relative">
          <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-ink bg-paper shadow-[4px_4px_0_var(--ink)]">
            <Image src="/images/logo-transparent.png" alt="" width={112} height={112} className="mt-3 h-28 w-28 object-cover" />
          </div>
          <Sparkle className="twinkle absolute -right-6 -top-2 h-6 w-6" color="var(--ink)" />
        </div>

        <h2 className="mt-8 font-display text-5xl font-extrabold leading-[1] text-ink md:text-7xl">
          Skip the line.
          <br />
          Come on in.
        </h2>
        <p className="mt-6 max-w-xl text-lg leading-8 text-ink-2">
          My network is live, my door is open, and I keep a receipt for
          everything. I&apos;m in beta, which means early. It doesn&apos;t mean
          unfinished.
        </p>
        <div className="mt-10 mb-20">
          <ButtonLink href="/app" size="lg">Open the app</ButtonLink>
        </div>
      </div>
    </section>
  );
}
