"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ErrorNote, PixelBtn, inputCls, labelCls } from "@/components/app/ui";
import { Sparkle } from "@/components/home/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); return; }
    router.push("/app");
    router.refresh();
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center text-center">
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
          <h1 className="mt-6 font-display text-3xl font-extrabold text-ink">Oh hey, it&apos;s you again</h1>
          <p className="mt-2 text-sm text-graphite">Sign in and I&apos;ll pick up right where we left off.</p>
        </div>

        <div className="sticker mt-8 rounded-3xl p-6 sm:p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label htmlFor="email" className={labelCls}>Your email</label>
              <input
                id="email" type="email" autoComplete="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputCls}
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <label htmlFor="password" className="block text-sm font-bold text-ink">Your password</label>
                <Link href="/app/forgot-password" className="text-xs font-semibold text-graphite transition-colors hover:text-berry">
                  Forgot your password?
                </Link>
              </div>
              <input
                id="password" type="password" autoComplete="current-password" required
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputCls}
              />
            </div>

            {error && <ErrorNote>Hmm, I couldn&apos;t sign you in. {error}</ErrorNote>}

            <PixelBtn type="submit" disabled={loading} className="w-full">
              {loading ? "Checking it's you..." : "Sign in"}
            </PixelBtn>
          </form>

          <p className="mt-6 border-t-[1.5px] border-line pt-5 text-center text-sm text-graphite">
            First time with me?{" "}
            <Link href="/app/signup" className="font-bold text-berry hover:underline">
              Make an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
