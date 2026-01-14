import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const CACHE_KEY = "latest_blocks_cache";
const CACHE_TTL = 60 * 1000;
const MAX_BLOCKS = 15;

const BTC_FACTS = [
  "Bitcoin’s supply is capped at 21 million coins.",
  "A new Bitcoin block is found roughly every 10 minutes on average.",
  "Bitcoin uses Proof of Work to secure the network.",
  "The smallest unit of Bitcoin is a satoshi: 0.00000001 BTC.",
  "The block subsidy is cut in half roughly every four years (the halving).",
  "Every Bitcoin transaction is recorded on a public ledger called the blockchain.",
  "Mining difficulty adjusts every 2,016 blocks to maintain ~10-minute block times.",
  "Transaction fees are paid in satoshis and help miners prioritize transactions.",
  "Coinbase transactions create new BTC and collect transaction fees.",
  "Each Bitcoin block links cryptographically to the previous block via its hash.",
  "A single block can contain thousands of transactions.",
  "If two miners find a block simultaneously, the network temporarily forks.",
  "Blocks that are not extended by later blocks become orphaned.",
  "The Merkle root summarizes all transactions included in a block.",
  "Bitcoin’s 10-minute block time is a target, not a strict rule.",
  "Anyone can run a Bitcoin node and independently verify the blockchain."
];

export default function ExplorerPage() {
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const [factIndex, setFactIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed?.data && Date.now() - parsed.timestamp < CACHE_TTL) {
          setLatest(parsed.data);
          setLoading(false);
        }
      } catch {}
    }

    const es = new EventSource("http://localhost:3001/api/blocks/latest/stream");

    es.onmessage = (e) => {
      const block = JSON.parse(e.data);

      setLatest((prev) => {
        if (prev.some((b) => b.hash === block.hash)) return prev;

        const updated = [...prev, block]
          .sort((a, b) => b.height - a.height)
          .slice(0, MAX_BLOCKS);

        sessionStorage.setItem(
          CACHE_KEY,
          JSON.stringify({
            timestamp: Date.now(),
            data: updated
          })
        );

        return updated;
      });

      setLoading(false);
    };

    es.onerror = () => {
      es.close();
    };

    return () => es.close();
  }, []);

  useEffect(() => {
    if (!(loading && latest.length === 0)) return;

    const id = setInterval(() => {
      setFactIndex((i) => (i + 1) % BTC_FACTS.length);
    }, 4000);

    return () => clearInterval(id);
  }, [loading, latest.length]);

  const fact = useMemo(() => BTC_FACTS[factIndex], [factIndex]);

  const formatDate = (ts) =>
    new Date(ts * 1000).toLocaleString("hr-HR", {
      timeZone: "Europe/Zagreb",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  const shortCoinbase = (value) =>
    value && value.length > 12
      ? `${value.slice(0, 6)}…${value.slice(-6)}`
      : value;

  const title =
    latest.length >= MAX_BLOCKS ? "Latest blocks" : "Awaiting latest blocks...";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex min-h-[20vh] flex-col items-center justify-center text-center">
        <h1 className="predictor text-2xl font-semibold text-white">
          Welcome to BitWatch!
        </h1>

        <p className="mt-1 text-slate-400 max-w-2xl">
          Explore Bitcoin blocks, transactions, and addresses in real time as they
          are added to the blockchain.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-1">{title}</h2>

      <hr />
      <br />

      {loading && latest.length === 0 && (
        <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
          <div className="max-w-2xl w-full rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-4">
            <div className="text-base font-medium tracking-wide text-white">
              While blocks are arriving... Did you know that
            </div>
            <div className="mt-1 text-base text-white/80">{fact}</div>
          </div>
        </div>
      )}

      {latest.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {[...latest]
            .sort((a, b) => b.height - a.height)
            .map((b) => (
              <button
                key={b.hash}
                onClick={() => navigate(`/block/${b.height}`)}
                className="group relative rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-left transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:border-indigo-400/40 hover:shadow-2xl hover:shadow-indigo-900/40"
              >
                <div className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100 bg-gradient-to-br from-indigo-500/10 to-transparent" />

                <div className="relative text-lg font-semibold text-white">
                  #{b.height}
                </div>

                <div className="relative mt-1 text-xs text-white">
                  {formatDate(b.time)}
                </div>

                {(b.minerTag || b.minerCoinbase) && (
                  <div className="relative mt-2 text-xs text-white/70">
                    <div className="font-medium text-white/80">Miner:</div>
                    <div>
                      {b.minerTag ? b.minerTag : shortCoinbase(b.minerCoinbase)}
                    </div>
                  </div>
                )}

                <div className="relative mt-3 text-xs text-white/70">
                  {b.txCount} transactions
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
