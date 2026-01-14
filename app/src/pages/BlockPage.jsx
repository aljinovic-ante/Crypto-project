import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchExplorer } from "../api/explorer";
import BlockCard from "../components/block/BlockCard";
import TxList from "../components/block/TxList";

const BTC_FACTS = [
  "Anyone can run a Bitcoin node and independently verify the blockchain.",
  "Bitcoin’s 10-minute block time is a target, not a strict rule.",
  "The Merkle root summarizes all transactions included in a block.",
  "Blocks that are not extended by later blocks become orphaned.",
  "If two miners find a block simultaneously, the network temporarily forks.",
  "A single block can contain thousands of transactions.",
  "Each Bitcoin block links cryptographically to the previous block via its hash.",
  "Coinbase transactions create new BTC and collect transaction fees.",
  "Transaction fees are paid in satoshis and help miners prioritize transactions.",
  "Mining difficulty adjusts every 2,016 blocks to maintain ~10-minute block times.",
  "Every Bitcoin transaction is recorded on a public ledger called the blockchain.",
  "The block subsidy is cut in half roughly every four years (the halving).",
  "The smallest unit of Bitcoin is a satoshi: 0.00000001 BTC.",
  "Bitcoin uses Proof of Work to secure the network.",
  "A new Bitcoin block is found roughly every 10 minutes on average.",
  "Bitcoin’s supply is capped at 21 million coins."
];

export default function BlockPage() {
  const { id } = useParams();
  const [block, setBlock] = useState(null);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    setBlock(null);
    searchExplorer(id).then(setBlock);
  }, [id]);

  useEffect(() => {
    if (block) return;

    const interval = setInterval(() => {
      setFactIndex((i) => (i + 1) % BTC_FACTS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [block]);

  if (!block) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col items-center justify-center text-center gap-4">
          <div className="text-slate-400 text-lg">
            Fetching block information…
          </div>

          <div className="max-w-2xl w-full rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4">
            <div className="text-base font-medium tracking-wide text-white/90">
              While block is loading… Did you know that
            </div>
            <div className="mt-2 text-base text-white/80">
              {BTC_FACTS[factIndex]}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-white">
          Block Information
        </h1>
      </div>

      <hr />
      <br />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <BlockCard block={block} />
        <TxList txs={block.tx ?? []} />
      </div>
    </div>
  );
}
