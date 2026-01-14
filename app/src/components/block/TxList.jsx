import { useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

export default function TxList({ txs }) {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");

  const safeTxs = Array.isArray(txs) ? txs : [];

  const getTs = (tx) => tx?.blockTime ?? tx?.time ?? 0;

  const sortedTxs = useMemo(() => {
    const list = [...safeTxs];

    switch (sortBy) {
      case "inputs_desc":
        return list.sort(
          (a, b) => (b?.vin?.length ?? 0) - (a?.vin?.length ?? 0)
        );

      case "inputs_asc":
        return list.sort(
          (a, b) => (a?.vin?.length ?? 0) - (b?.vin?.length ?? 0)
        );

      case "outputs_desc":
        return list.sort(
          (a, b) => (b?.vout?.length ?? 0) - (a?.vout?.length ?? 0)
        );

      case "outputs_asc":
        return list.sort(
          (a, b) => (a?.vout?.length ?? 0) - (b?.vout?.length ?? 0)
        );

      case "date":
      default:
        return list.sort((a, b) => getTs(b) - getTs(a));
    }
  }, [safeTxs, sortBy]);

  const txIndexById = useMemo(() => {
    const byDate = [...safeTxs].sort((a, b) => getTs(b) - getTs(a));
    const map = new Map();
    byDate.forEach((tx, idx) => {
      if (tx?.txid) map.set(tx.txid, idx);
    });
    return map;
  }, [safeTxs]);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold text-white">
          Transactions ({safeTxs.length})
        </h2>

        <div className="flex items-center gap-4 text-xs text-white">
          Sort by:
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-md px-2 py-1 text-xs text-white focus:outline-none"
          >
            <option value="date">Default</option>
            <option value="inputs_desc">Most inputs</option>
            <option value="inputs_asc">Least inputs</option>
            <option value="outputs_desc">Most outputs</option>
            <option value="outputs_asc">Least outputs</option>
          </select>
        </div>
      </div>

      <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
        {sortedTxs.length === 0 && (
          <div className="text-slate-400 text-sm">
            No transactions available
          </div>
        )}

        {sortedTxs.map((tx) => {
          const vinLen = tx?.vin?.length ?? 0;
          const voutLen = tx?.vout?.length ?? 0;
          const txNo = tx?.txid ? txIndexById.get(tx.txid) : undefined;

          return (
            <button
              key={tx.txid}
              onClick={() => navigate(`/tx/${tx.txid}`)}
              className="w-full text-left rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700 transition"
            >
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-white">
                  Tx #{typeof txNo === "number" ? txNo : "—"}
                </span>
                <span className="text-[11px] text-slate-400">TX Size: {tx.size} B </span>
              </div>

              <div className="font-mono text-slate-200 text-xs break-all mt-1">
                {tx.txid}
              </div>

              <div className="mt-1 text-[11px] text-white">
                {vinLen} inputs | {voutLen} outputs
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
