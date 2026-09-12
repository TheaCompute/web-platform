import { ExplorerMockup } from "./mockups";
import { ButtonLink, Eyebrow } from "./ui";

export function ExplorerSection() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-5 pb-24 lg:pb-32">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Eyebrow>My explorer</Eyebrow>
            <h2 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] text-ink md:text-5xl">
              Watch me work, out in the open
            </h2>
            <p className="mt-6 text-lg leading-8 text-graphite">
              Follow a live feed of every job and settlement, a leaderboard of
              workers with their earnings and reputation, and my full
              buyback-and-burn history. Each row links to its on-chain proof,
              and you never have to log in to see any of it.
            </p>
          </div>
          <div className="shrink-0">
            <ButtonLink href="/app/jobs">Open my explorer</ButtonLink>
          </div>
        </div>

        <div className="mt-14">
          <ExplorerMockup />
        </div>
      </div>
    </section>
  );
}
