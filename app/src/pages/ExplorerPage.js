import { useEffect, useState } from "react";
import { searchExplorer } from "../api/explorer";

const BTC_EUR = 60000;

const satToBtc = (sat) => sat / 1e8;

const formatEUR = (value) =>
  value.toLocaleString("hr-HR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const formatTriple = (sat) => {
  const btc = satToBtc(sat);
  const eur = btc * BTC_EUR;
  return `${sat.toLocaleString("hr-HR")} sat · ${btc.toFixed(
    8
  )} BTC · €${formatEUR(eur)}`;
};

export default function ExplorerPage() {
  const [q, setQ] = useState("");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(false);

  const runSearch = async (query) => {
    const value = String(query ?? "").trim();
    if (!value) return;

    setLoading(true);
    setError("");
    setData(null);

    try {
      const res = await searchExplorer(value);
      setData(res);
      setQ(value);
    } catch {
      setError("Not found");
    } finally {
      setLoading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    runSearch(q);
  };

  useEffect(() => {
    fetch("http://localhost:3001/api/blocks/latest")
      .then((r) => r.json())
      .then(setLatest)
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <form onSubmit={submit} className="flex gap-2 mb-6">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Block height or TXID"
          className="flex-1 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-slate-100"
        />
        <button className="bg-sky-500 hover:bg-sky-600 px-6 rounded-lg text-white font-medium">
          Search
        </button>
      </form>

      {latest.length > 0 && (
        <div className="mb-10">
          <h3 className="mb-4 text-sm font-medium text-slate-400">
            Latest blocks
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {latest.map((b) => (
              <button
                key={b.hash}
                onClick={() => runSearch(String(b.height))}
                className="rounded-xl border border-white/10 bg-gradient-to-br from-slate-900 to-indigo-950 p-4 text-left shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition"
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
                  {b.txCount} tx
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="text-slate-400 text-center py-8">
          Loading…
        </div>
      )}

      {error && (
        <div className="text-red-400 bg-red-900/20 border border-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      {data?.type === "block" && <BlockCard block={data} />}
      {data?.type === "tx" && <TxCard tx={data} />}
    </div>
  );
}

/* ================= BLOCK CARD ================= */

function BlockCard({ block }) {
  const time =
    block.time &&
    new Date(block.time * 1000).toLocaleString("hr-HR", {
      timeZone: "Europe/Zagreb"
    });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),transparent_70%)]" />

      <div className="relative">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Block #{block.height}
        </h2>

        <div className="grid gap-3 text-sm text-slate-200">
          <Row label="Hash" value={block.hash} mono />
          <Row label="Transactions" value={block.txCount} />
          <Row
            label="Total Size"
            value={block.size && `${(block.size / 1e6).toFixed(2)} MB`}
          />
          <Row label="Time" value={time} />
          <Row
            label="Weight"
            value={block.weight && `${block.weight} WU`}
          />

          <Row
            label="Median Fee"
            value={block.medianFee && formatTriple(block.medianFee)}
          />
          <Row
            label="Average Fee"
            value={block.avgFee && formatTriple(block.avgFee)}
          />
          <Row
            label="Total Fee"
            value={block.totalFee && formatTriple(block.totalFee)}
          />
          <Row
            label="Subsidy"
            value={block.subsidy && formatTriple(block.subsidy)}
          />
          <Row
            label="Subsidy + Fee"
            value={
              block.subsidy &&
              block.totalFee &&
              formatTriple(block.subsidy + block.totalFee)
            }
          />
          <Row
            label="Total Output Value"
            value={block.totalValue && formatTriple(block.totalValue)}
          />
        </div>
      </div>
    </div>
  );
}

/* ================= ROW ================= */

function Row({ label, value, mono }) {
  const display =
    value === null || value === undefined ? "N/A" : value;

  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-2 last:border-none">
      <span className="text-slate-400">{label}</span>
      <span
        className={`text-right ${
          mono ? "font-mono text-xs text-slate-300" : "text-slate-100"
        }`}
      >
        {display}
      </span>
    </div>
  );
}

/* ================= TX CARD ================= */

function TxCard({ tx }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-sky-400 mb-4">
        Transaction
      </h2>

      <div className="space-y-2 text-slate-300 text-sm">
        <div>
          <span className="text-slate-400">TXID:</span>{" "}
          <span className="break-all font-mono text-xs">
            {tx.txid}
          </span>
        </div>
        <div>
          <span className="text-slate-400">Inputs:</span>{" "}
          {tx.vinCount ?? "N/A"}
        </div>
        <div>
          <span className="text-slate-400">Outputs:</span>{" "}
          {tx.voutCount ?? "N/A"}
        </div>
        <div>
          <span className="text-slate-400">Size:</span>{" "}
          {tx.size ? `${tx.size} bytes` : "N/A"}
        </div>
      </div>
    </div>
  );
}
