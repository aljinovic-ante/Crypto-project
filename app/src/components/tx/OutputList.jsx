import { useNavigate } from "react-router-dom";

export default function OutputList({ vout }) {
  const navigate = useNavigate();
  const outputs = Array.isArray(vout) ? vout : [];
  const outputCount = outputs.length;

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

        {outputs.map((out) => {
          const address =
            out.scriptPubKey?.address ??
            out.scriptPubKey?.addresses?.[0] ??
            null;

          return (
            <div
              key={out.n}
              className="rounded-lg bg-slate-800 px-4 py-3 text-sm"
            >
              <div className="flex items-center justify-between gap-3 mb-2">
                <span className="text-xs text-slate-400">
                  Output #{out.n}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-slate-300 text-white">
                    {out.value.toFixed(8)} BTC
                  </span>

                  <button
                    type="button"
                    disabled={!address}
                    onClick={() => navigate(`/address/${address}`)}
                    className={[
                      "px-3 py-1 rounded-lg text-xs font-medium transition",
                      address
                        ? "bg-sky-500 hover:bg-sky-600 text-white"
                        : "bg-slate-700 text-slate-400 cursor-not-allowed"
                    ].join(" ")}
                  >
                    View address
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs break-all">
                <span className="text-slate-400">Address: </span>
                <span className="text-white">{address ?? "N/A"}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
