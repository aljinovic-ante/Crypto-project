import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CACHE_KEY = "latest_blocks_cache";
const CACHE_TTL = 60 * 1000;
const MAX_BLOCKS = 15;

export default function ExplorerPage() {
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cached = sessionStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (
          parsed?.data &&
          Date.now() - parsed.timestamp < CACHE_TTL
        ) {
          setLatest(parsed.data);
          setLoading(false);
        }
      } catch {}
    }

    const es = new EventSource(
      "http://localhost:3001/api/blocks/latest/stream"
    );

    es.onmessage = (e) => {
      const block = JSON.parse(e.data);

      setLatest(prev => {
        if (prev.some(b => b.hash === block.hash)) return prev;

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

  const title =
    latest.length >= MAX_BLOCKS
      ? "Latest blocks"
      : "Awaiting latest blocks...";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex min-h-[20vh] flex-col items-center justify-center text-center">
        <h1 className=" predictor text-2xl font-semibold text-white">
          Bitcoin Block Explorer
        </h1>

        <p className="mt-1 text-slate-400 max-w-2xl">
          Explore newly mined Bitcoin blocks in real time as they are added to the blockchain.
        </p>
      </div>

      <h2 className="text-2xl font-semibold text-white mb-1">
        {title}
      </h2>

      <hr /><br />

      {loading && latest.length === 0 && (
        <div className="flex justify-center text-slate-400">
          Loading…
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
                className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-left hover:shadow-xl transition"
              >
                <div className="text-lg font-semibold text-white">
                  #{b.height}
                </div>

                <div className="mt-1 text-xs text-white">
                  {formatDate(b.time)}
                </div>

                {(b.minerTag || b.minerCoinbase) && (
                  <div className="mt-1 text-xs text-white/70 truncate">
                    Miner: {b.minerTag || b.minerCoinbase}
                  </div>
                )}

                <div className="mt-2 text-xs text-white/70">
                  {b.txCount} transactions
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
