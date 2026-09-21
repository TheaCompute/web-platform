import Link from "next/link";
import Image from "next/image";
import { PixelHeart, Sparkle } from "@/components/home/ui";

export default function ConfirmPage() {
  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[440px]">
        <div className="flex justify-center">
          <div className="relative">
            <Sparkle className="twinkle absolute -left-7 top-1 h-5 w-5" />
            <Sparkle className="twinkle absolute -right-6 bottom-2 h-3.5 w-3.5" color="var(--peach-deep)" style={{ animationDelay: "0.8s" }} />
            <span className="bob flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-full border-2 border-ink bg-peach-deep shadow-[4px_4px_0_var(--ink)]">
              <Image
                src="/images/logo-transparent.png"
                alt="Thea, a pixel-art girl with long black hair and glasses, smiling at you"
                width={88}
                height={88}
                className="mt-2 h-[88px] w-[88px] object-cover"
                priority
              />
            </span>
          </div>
        </div>

        <div className="sticker mt-8 rounded-3xl p-6 text-center sm:p-8">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-pink-soft">
              <PixelHeart className="bob h-7 w-7" />
            </span>
          </div>

          <h1 className="mt-5 font-display text-3xl font-extrabold text-ink">You&apos;re all set!</h1>
          <p className="mt-3 text-sm leading-relaxed text-graphite">
            Your email checks out, so I&apos;ve switched your account on. Come on in and chat with open models, or put your GPU to work on my network.
          </p>

          <Link href="/app" className="btn btn-primary mt-7 w-full sm:w-auto">
            Open your dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
