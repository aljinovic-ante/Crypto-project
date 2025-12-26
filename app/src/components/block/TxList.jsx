import { useNavigate } from "react-router-dom";

export default function TxList({ txs }) {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
      <h2 className="text-xl font-semibold text-white mb-4">
        Transactions
      </h2>

      <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
        {txs.length === 0 && (
          <div className="text-slate-400 text-sm">
            No transactions available
          </div>
        )}

        {txs.map((tx) => (
          <button
            key={tx.txid}
            onClick={() => navigate(`/tx/${tx.txid}`)}
            className="w-full text-left rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700 transition"
          >
            <div className="font-mono text-slate-200 text-xs break-all">
              {tx.txid}
            </div>

            <div className="mt-1 flex justify-between text-[11px] text-slate-400">
              <span>{tx.vin.length} inputs</span>
              <span>{tx.vout.length} outputs</span>
              <span>{tx.size} B</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
