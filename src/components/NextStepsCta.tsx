import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "./icons";

export function NextStepsCta() {
  return (
    <section
      className="relative overflow-hidden py-20 lg:py-28"
      aria-labelledby="cta-heading"
      style={{ background: "black" }}
    >
      <Image
        src="/images/compute.png"
        alt=""
        fill
        aria-hidden="true"
        className="object-cover -scale-x-100"
        quality={90}
      />
      <div className="absolute inset-0" style={{ background: "oklch(0 0 0 / 0.2)" }} />

      <div className="relative ml-auto max-w-[1168px] px-6 lg:px-32 text-end">
        <h2
          id="cta-heading"
          className="ml-auto max-w-[800px] text-[44px] leading-[1.05] tracking-[-0.025em] text-white sm:text-[64px] md:text-[80px] lg:text-[96px] lg:leading-[100px] lg:tracking-[-2.88px]"
        >
          Join with a GPU, or just a question.
        </h2>
        <p className="ml-auto mt-6 max-w-[800px] text-[18px] leading-[1.65] text-white/60 md:text-[20px]">
          Providers go online and see their first USDG the same day. Users connect a wallet and get answers nobody else will ever read. Robinhood Chain records it all in public, so nothing runs on trust.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-end gap-x-8 gap-y-4">
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-[4px] bg-white px-5 py-[11px] text-[18px] font-[660] leading-[1.4] text-black transition-colors hover:bg-white/90"
          >
            Launch app
          </Link>
          <Link
            href="mailto:contact@theacompute.com"
            className="inline-flex items-center gap-1 text-[18px] font-[660] text-white/70 hover:text-white transition-colors"
          >
            Get in touch
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
