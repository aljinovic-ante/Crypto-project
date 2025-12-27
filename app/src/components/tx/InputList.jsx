import { useNavigate } from "react-router-dom";

export default function InputList({ vin }) {
  const navigate = useNavigate();
  const inputs = Array.isArray(vin) ? vin : [];
  const inputCount = inputs.length;

  const extractAddress = (input) => {
    const addr =
      input?.prevout?.scriptpubkey_address ??
      input?.prevout?.scriptPubKey?.address ??
      input?.address ??
      null;

    return typeof addr === "string" && addr.length > 0 ? addr : null;
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-4">
        Inputs: {inputCount}
      </h3>

      <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
        {inputCount === 0 && (
          <div className="text-slate-400 text-sm">No inputs available</div>
        )}

        {inputs.map((input, i) => {
          const address = extractAddress(input);

          return (
            <div
              key={`${input.txid ?? "coinbase"}-${i}`}
              className="rounded-lg bg-slate-800 px-4 py-3 text-sm"
            >
              {input.coinbase ? (
                <div className="text-slate-400 italic">Coinbase input</div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <span className="text-xs text-slate-400">Input #{i}</span>

                    <div className="flex items-center gap-3">
                      {typeof input.value === "number" && (
                        <span className="text-slate-300 text-white">
                          {(input.value / 1e8).toFixed(8)} BTC
                        </span>
                      )}

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
                  <div className="mt-1 text-xs text-slate-400">
                    Source transaction (TXID):
                  </div>
                  <div className="font-mono text-xs text-slate-200 break-all">
                    {input.txid}
                  </div>

                  <div className="mt-2 text-xs break-all">
                    <span className="text-slate-400">Address: </span>
                    <span className="text-white">{address ?? "N/A"}</span>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
