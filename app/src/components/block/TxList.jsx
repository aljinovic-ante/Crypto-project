import { useNavigate } from "react-router-dom";

export default function TxList({ txs }) {
  const navigate = useNavigate();

  const totalInputs = txs.reduce((sum, tx) => sum + tx.vin.length, 0);
  const totalOutputs = txs.reduce((sum, tx) => sum + tx.vout.length, 0);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">
          Transactions
        </h2>

        <div className="flex gap-4 text-xs text-white">
          <span>Total tx: {txs.length}</span>
          <span>Total inputs: {totalInputs}</span>
          <span>Total outputs: {totalOutputs}</span>
        </div>
      </div>

      <div className="space-y-2 max-h-[720px] overflow-y-auto pr-1">
        {txs.length === 0 && (
          <div className="text-slate-400 text-sm">
            No transactions available
          </div>
        )}

        {txs.map((tx, index) => (
          <button
            key={tx.txid}
            onClick={() => navigate(`/tx/${tx.txid}`)}
            className="w-full text-left rounded-lg bg-slate-800 px-3 py-2 hover:bg-slate-700 transition"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-white">
                Tx #{index}
              </span>
              <span className="text-[11px] text-slate-400">
                {tx.size} B
              </span>
            </div>

            <div className="font-mono text-slate-200 text-xs break-all mt-1">
              {tx.txid}
            </div>

            <div className="mt-1 text-[11px] text-white">
              {tx.vin.length} inputs | {tx.vout.length} outputs
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
