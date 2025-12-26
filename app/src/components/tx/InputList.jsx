export default function InputList({ vin }) {
  const inputCount = Array.isArray(vin) ? vin.length : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">
        Inputs: {inputCount}
      </h3>

      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
        {inputCount === 0 && (
          <div className="text-slate-400 text-sm">
            No inputs available
          </div>
        )}

        {vin.map((input, i) => (
          <div
            key={`${input.txid ?? "coinbase"}-${i}`}
            className="rounded-lg bg-slate-800 px-4 py-3 text-sm"
          >
            {input.coinbase ? (
              <div className="text-slate-400 italic">
                Coinbase input
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-slate-400">
                    Input #{i}
                  </span>

                  {typeof input.value === "number" && (
                    <span className="flex justify-between text-slate-300">
                      {(input.value / 1e8).toFixed(8)} BTC
                    </span>
                  )}
                </div>

                <div className="font-mono text-xs text-slate-200 break-all">
                  {input.txid}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
