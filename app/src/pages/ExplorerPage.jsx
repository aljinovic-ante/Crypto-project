import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ExplorerPage() {
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3001/api/blocks/latest")
      .then((r) => r.json())
      .then((data) => {
        setLatest(data);
        setLoading(false);
      })
      .catch(() => {
        setLatest([]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-semibold text-white mb-6">
        Latest blocks
      </h1>

      {loading && (
        <div className="text-slate-400 text-center py-10">
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

              <div className="mt-1 text-xs text-slate-400">
                {new Date(b.time * 1000).toLocaleString("hr-HR", {
                  timeZone: "Europe/Zagreb",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </div>

              <div className="mt-2 text-xs text-slate-300">
                {b.txCount} transactions
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
