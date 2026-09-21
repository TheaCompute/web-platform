"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ErrorNote, PixelBtn, inputCls, labelCls } from "@/components/app/ui";
import { PixelHeart, Sparkle } from "@/components/home/ui";

function Thea() {
  return (
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
  );
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-[420px]">
          <div className="flex justify-center">
            <Thea />
          </div>
          <div className="sticker mt-8 rounded-3xl p-6 text-center sm:p-8">
            <div className="flex justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-ink bg-pink-soft">
                <PixelHeart className="bob h-7 w-7" />
              </span>
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold text-ink">Check your inbox</h1>
            <p className="mt-3 break-words text-sm leading-relaxed text-graphite">
              I just sent a confirmation link to{" "}
              <span className="font-bold text-ink">{email}</span>.
              Tap it and I&apos;ll switch your account on.
            </p>
            <p className="mt-6 border-t-[1.5px] border-line pt-5 text-sm">
              <Link href="/app/login" className="font-bold text-berry hover:underline">
                Take me back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center text-center">
          <Thea />
          <h1 className="mt-6 font-display text-3xl font-extrabold text-ink">Hi, I&apos;m Thea!</h1>
          <p className="mt-2 text-sm leading-relaxed text-graphite">
            Make an account and I&apos;ll open up private AI for you, plus a way to start earning with your GPU.
          </p>
        </div>

        <div className="sticker mt-8 rounded-3xl p-6 sm:p-8">
          <form onSubmit={handleSignup} className="space-y-5">
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
              <label htmlFor="password" className={labelCls}>Pick a password</label>
              <input
                id="password" type="password" autoComplete="new-password" required minLength={8}
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className={inputCls}
              />
            </div>

            {error && <ErrorNote>Hmm, I couldn&apos;t make your account. {error}</ErrorNote>}

            <PixelBtn type="submit" disabled={loading} className="w-full">
              {loading ? "Setting you up..." : "Make my account"}
            </PixelBtn>
          </form>

          <p className="mt-6 border-t-[1.5px] border-line pt-5 text-center text-sm text-graphite">
            We&apos;ve met before?{" "}
            <Link href="/app/login" className="font-bold text-berry hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
