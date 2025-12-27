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
    let usedCache = false;

    const cached = sessionStorage.getItem(CACHE_KEY);

    if (cached) {
      try {
        const parsed = JSON.parse(cached);

        if (
          parsed?.data &&
          Array.isArray(parsed.data) &&
          parsed.data.length > 0 &&
          Date.now() - parsed.timestamp < CACHE_TTL
        ) {
          setLatest(parsed.data.slice(0, MAX_BLOCKS));
          setLoading(false);
          usedCache = true;
        }
      } catch {}
    }

    if (usedCache) return;

    setLoading(true);

    const es = new EventSource(
      "http://localhost:3001/api/blocks/latest/stream"
    );

    es.onmessage = (e) => {
      const block = JSON.parse(e.data);

      setLatest(prev => {
        if (prev.some(b => b.hash === block.hash)) return prev;

        const updated = [block, ...prev].slice(0, MAX_BLOCKS);

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
      setLoading(false);
    };

    return () => es.close();
  }, []);

  const formatDate = (ts) =>
    new Date(ts * 1000).toLocaleString("hr-HR", {
      timeZone: "Europe/Zagreb",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });

  const title =
    latest.length >= MAX_BLOCKS ? "Latest blocks" : "Awaiting latest blocks...";

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex min-h-[20vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-white">
          Bitcoin Block Explorer
        </h1>

        <p className="mt-1 text-slate-400 max-w-2xl">
          Welcome! Here you can explore the latest Bitcoin blocks, inspect individual blocks,
          transactions, view information, fees, and on-chain data in real time.
        </p>
      </div>

      <div className="mt-10"></div>

      <h1 className="text-2xl font-semibold text-white mb-1">
        {title}
      </h1>

      <hr /><br />

      {loading && latest.length === 0 && (
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
          Loading…
        </div>
      )}

      {!loading && latest.length === 0 && (
        <div className="text-slate-400 text-center py-10">
          No blocks available
        </div>
      )}

      {latest.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {latest.map((b) => (
            <button
              key={b.hash}
              onClick={() => navigate(`/block/${b.height}`)}
              className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-left shadow-lg hover:shadow-xl transition"
            >
              <div className="text-lg font-semibold text-white">
                #{b.height}
              </div>

              <div className="mt-1 text-xs truncate text-white">
                {typeof b.time === "number"
                  ? formatDate(b.time)
                  : "N/A"}
              </div>

              {typeof b.minerTag === "string" && b.minerTag.length > 0 && (
                <div className="mt-1 text-xs truncate text-white/70">
                  Miner: {b.minerTag}
                </div>
              )}

              {typeof b.minerTag !== "string" &&
                typeof b.minerCoinbase === "string" && (
                  <div className="mt-1 text-xs truncate text-white/70">
                    Miner: {b.minerCoinbase}
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
