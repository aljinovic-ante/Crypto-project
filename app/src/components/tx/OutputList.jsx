export default function OutputList({ vout }) {
  const outputCount = Array.isArray(vout) ? vout.length : 0;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">
        Outputs: {outputCount}
      </h3>

      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
        {outputCount === 0 && (
          <div className="text-slate-400 text-sm">
            No outputs available
          </div>
        )}

        {vout.map((out) => (
          <div
            key={out.n}
            className="rounded-lg bg-slate-800 px-4 py-3 text-xs"
          >
            <div className="flex justify-between text-slate-300">
              <span>Index #{out.n}</span>
              <span>{out.value} BTC</span>
            </div>

            <div className="mt-1 font-mono text-slate-200 break-all">
              {out.scriptPubKey?.address ??
                out.scriptPubKey?.addresses?.[0] ??
                "Unknown address"}
            </div>

            <div className="mt-1 text-slate-400">
              {out.scriptPubKey?.type}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
