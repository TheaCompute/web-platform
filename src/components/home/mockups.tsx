/* Static, production-styled UI mockups for the homepage. Pure JSX, no client JS. */

const kw = "text-pink";
const str = "text-peach-deep";
const fn = "text-cream";
const pr = "text-[#c9ccd0]";
const pun = "text-[#8a8f95]";

const codeLines: React.ReactNode[] = [
  <>
    <span className={kw}>import</span> <span className={pun}>{"{ "}</span>
    <span className={fn}>TheaComputeClient</span> <span className={pun}>{"}"}</span>{" "}
    <span className={kw}>from</span> <span className={str}>&apos;@theacompute/sdk&apos;</span>
  </>,
  <>&nbsp;</>,
  <>
    <span className={kw}>const</span> <span className={fn}>client</span>{" "}
    <span className={pun}>=</span> <span className={kw}>new</span>{" "}
    <span className={fn}>TheaComputeClient</span>
    <span className={pun}>({"{"}</span> <span className={pr}>wallet</span>{" "}
    <span className={pun}>{"})"}</span>
  </>,
  <>&nbsp;</>,
  <>
    <span className={kw}>const</span> <span className={fn}>stream</span>{" "}
    <span className={pun}>=</span> <span className={kw}>await</span>{" "}
    <span className={fn}>client</span>
    <span className={pun}>.</span>
    <span className={fn}>chat</span>
    <span className={pun}>({"{"}</span>
  </>,
  <>
    {"  "}
    <span className={pr}>model</span>
    <span className={pun}>:</span> <span className={str}>&apos;llama-3.3-70b&apos;</span>
    <span className={pun}>,</span>
  </>,
  <>
    {"  "}
    <span className={pr}>messages</span>
    <span className={pun}>: [{"{"}</span> <span className={pr}>role</span>
    <span className={pun}>:</span> <span className={str}>&apos;user&apos;</span>
    <span className={pun}>,</span> <span className={pr}>content</span>
    <span className={pun}>:</span> <span className={str}>&apos;Explain rollups&apos;</span>{" "}
    <span className={pun}>{"}],"}</span>
  </>,
  <>
    {"  "}
    <span className={pr}>stream</span>
    <span className={pun}>:</span> <span className={kw}>true</span>
    <span className={pun}>,</span>
  </>,
  <>
    <span className={pun}>{"})"}</span>
  </>,
  <>&nbsp;</>,
  <>
    <span className={kw}>for await</span> <span className={pun}>(</span>
    <span className={kw}>const</span> <span className={fn}>chunk</span>{" "}
    <span className={kw}>of</span> <span className={fn}>stream</span>
    <span className={pun}>)</span> <span className={fn}>process</span>
    <span className={pun}>.</span>
    <span className={fn}>stdout</span>
    <span className={pun}>.</span>
    <span className={fn}>write</span>
    <span className={pun}>(</span>
    <span className={fn}>chunk</span>
    <span className={pun}>.</span>
    <span className={pr}>delta</span>
    <span className={pun}>)</span>
  </>,
  <>&nbsp;</>,
  <>
    <span className={kw}>const</span> <span className={fn}>receipt</span>{" "}
    <span className={pun}>=</span> <span className={kw}>await</span>{" "}
    <span className={fn}>client</span>
    <span className={pun}>.</span>
    <span className={fn}>jobs</span>
    <span className={pun}>.</span>
    <span className={fn}>getReceipt</span>
    <span className={pun}>(</span>
    <span className={fn}>stream</span>
    <span className={pun}>.</span>
    <span className={pr}>jobId</span>
    <span className={pun}>)</span>
  </>,
];

export function SdkMockup() {
  return (
    <div className="overflow-hidden rounded-3xl border-2 border-ink bg-ink text-left shadow-[7px_7px_0_var(--pink)]">
      <div className="flex items-center gap-3 border-b-2 border-ink-2 px-5 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-pink" />
          <span className="h-3 w-3 rounded-full bg-peach-deep" />
          <span className="h-3 w-3 rounded-full bg-clay" />
        </div>
        <span className="rounded-full bg-ink-2 px-3 py-1 font-mono text-[11px] text-cream">quickstart.ts</span>
        <span className="font-mono text-[11px] text-[#8a8f95]">package.json</span>
      </div>

      <div className="overflow-x-auto px-5 py-5">
        <pre className="font-mono text-[12.5px] leading-[1.75]">
          {codeLines.map((line, i) => (
            <div key={i} className="flex">
              <span className="w-8 shrink-0 select-none pr-4 text-right text-[#4a4f55]">{i + 1}</span>
              <code className="whitespace-pre">{line}</code>
            </div>
          ))}
        </pre>
      </div>

      <div className="border-t-2 border-ink-2 bg-[#0b0c0f] px-5 py-4 font-mono text-[12px] leading-relaxed">
        <p className="text-[#8a8f95]">
          <span className="text-pink">$</span> npx tsx quickstart.ts
        </p>
        <p className="mt-1 text-[#c9ccd0]">
          Rollups run transactions off-chain, bundle them together, and post
          a compressed result to the parent chain, so fees stay low while the
          parent chain&apos;s security carries over...
        </p>
        <p className="mt-2 inline-flex rounded-full bg-pink px-3 py-0.5 font-sans text-[12px] font-bold text-ink">
          Settled on-chain · tx 0x3f8a...b1d3f5 · block 8,472,913 · 8 units
        </p>
      </div>
    </div>
  );
}

const explorerStats = [
  { label: "Jobs running", value: "1,284" },
  { label: "GPUs online", value: "3,407" },
  { label: "Settled so far today", value: "$12,480" },
  { label: "$THEA I've burned", value: "214,006" },
];

const explorerRows = [
  { job: "job_8fx2kq", model: "llama-3.3-70b", worker: "0x7c4b...e942", units: 40, status: "settled", tx: "0x3f8a...d3f5", time: "2s ago" },
  { job: "job_p03mvt", model: "qwen3-8b", worker: "0x91ae...07cd", units: 8, status: "streaming", tx: "pending", time: "4s ago" },
  { job: "job_66dhw1", model: "deepseek-r1", worker: "0xb2f0...5a11", units: 18, status: "settled", tx: "0x9c21...77aa", time: "9s ago" },
  { job: "job_r51xnd", model: "mistral-7b", worker: "0x04d9...c3f8", units: 8, status: "settled", tx: "0x517e...20bc", time: "12s ago" },
  { job: "job_zk8p2m", model: "llama-3.3-70b", worker: "0xe881...94d2", units: 40, status: "queued", tx: "awaiting", time: "14s ago" },
  { job: "job_ta97cf", model: "qwen3-8b", worker: "0x33c7...b6e0", units: 8, status: "settled", tx: "0xd044...9e12", time: "17s ago" },
];

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    settled: "bg-pink-soft text-berry",
    streaming: "bg-peach-deep text-ink",
    queued: "bg-peach text-graphite",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${styles[status] ?? styles.queued}`}>
      <span className={`h-1.5 w-1.5 rounded-[2px] bg-current ${status === "streaming" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}

export function ExplorerMockup() {
  return (
    <div className="sticker overflow-hidden text-left">
      <div className="flex items-center gap-3 border-b-2 border-ink bg-peach px-5 py-3">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-pink" />
          <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-peach-deep" />
          <span className="h-3 w-3 rounded-full border-[1.5px] border-ink bg-paper" />
        </div>
        <div className="flex flex-1 items-center gap-2 rounded-full border-[1.5px] border-ink bg-paper px-4 py-1">
          <span className="font-mono text-[11px] text-graphite">explorer.theacompute.com</span>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-2.5 py-0.5 text-[11px] font-bold text-cream">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink" />
          Live
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
        {explorerStats.map((stat, i) => (
          <div
            key={stat.label}
            className={`rounded-2xl border-[1.5px] border-ink px-4 py-3 ${["bg-pink-soft", "bg-peach", "bg-peach-deep", "bg-paper"][i]}`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wide text-graphite">{stat.label}</p>
            <p className="mt-0.5 font-display text-2xl font-extrabold text-ink">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto px-2 pb-2">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr>
              {["Job", "Model", "Worker", "Units", "Status", "Tx", "Age"].map((h) => (
                <th key={h} className="px-3 py-2 text-[11px] font-bold uppercase tracking-wide text-pebble">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {explorerRows.map((row) => (
              <tr key={row.job} className="border-t-[1.5px] border-dashed border-line">
                <td className="px-3 py-3 font-mono text-[12px] font-semibold text-berry">{row.job}</td>
                <td className="px-3 py-3 font-mono text-[12px] text-ink">{row.model}</td>
                <td className="px-3 py-3 font-mono text-[12px] text-graphite">{row.worker}</td>
                <td className="px-3 py-3 font-mono text-[12px] text-ink">{row.units}</td>
                <td className="px-3 py-3"><StatusBadge status={row.status} /></td>
                <td className="px-3 py-3 font-mono text-[12px] text-graphite">{row.tx}</td>
                <td className="px-3 py-3 text-[12px] text-pebble">{row.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
