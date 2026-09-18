"use client";

import { usePathname } from "next/navigation";
import { AppTopBar, PageTitleStrip } from "@/components/app/AppTopBar";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Chat manages its own full-height layout and spans the full width;
  // every other page renders in a centered max-width container.
  const fullBleed = pathname.startsWith("/app/chat");

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppTopBar />
      <main className="min-h-0 flex-1 bg-background">
        <div className="h-full overflow-y-auto">
          {!fullBleed && <PageTitleStrip />}
          <div className={cn("mx-auto w-full", fullBleed ? "h-full" : "max-w-6xl pb-16")}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
