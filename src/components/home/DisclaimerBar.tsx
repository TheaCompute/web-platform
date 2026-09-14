export function DisclaimerBar() {
  return (
    <section className="border-b border-white/10 bg-background px-6 py-8">
      <p className="mx-auto max-w-4xl text-center font-sans text-[13px] leading-[20px] text-muted-text">
        TheaCompute is in open beta on Robinhood Chain (chain ID 4663), an
        Ethereum Layer 2 built on the Arbitrum Orbit stack. Beta means early,
        not unfinished: the network is live, the earnings are real, and the
        receipts are on-chain. Contracts are open-source and audited before
        anything touches Mainnet. TheaCompute is neutral infrastructure, not a
        hosted product, and nothing in the published material constitutes
        financial, legal, or investment advice.
      </p>
    </section>
  );
}
