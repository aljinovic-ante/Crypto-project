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
            className="rounded-lg bg-slate-800 px-4 py-3 text-xs"
          >
            {input.coinbase ? (
              <div className="text-slate-400 italic">
                Coinbase transaction
              </div>
            ) : (
              <>
                <div className="font-mono text-slate-200 break-all">
                  {input.txid}
                </div>
                <div className="mt-1 text-slate-400">
                  Output index: {input.vout}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
