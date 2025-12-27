import Row from "../ui/Row";
import InputList from "./InputList";
import OutputList from "./OutputList";

const BTC_EUR = 60000;

const formatTriple = (sat) => {
  if (typeof sat !== "number" || Number.isNaN(sat)) {
    return "N/A";
  }

  const btc = sat / 1e8;
  const eur = btc * BTC_EUR;

  return `${sat.toLocaleString("hr-HR")} sat · ${btc.toFixed(
    8
  )} BTC · €${eur.toLocaleString("hr-HR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
};

export default function TxCard({ tx }) {
  if (!tx) return null;

  const vin = Array.isArray(tx.vin) ? tx.vin : [];
  const vout = Array.isArray(tx.vout) ? tx.vout : [];

  const isCoinbase =
    vin.length === 1 && typeof vin[0]?.coinbase === "string";

  const feeRate =
    typeof tx.vsize === "number" &&
    typeof tx.fee === "number" &&
    tx.vsize > 0
      ? (tx.fee / tx.vsize).toFixed(1)
      : null;

  const isSegWit = vin.some(
    (v) =>
      Array.isArray(v.txinwitness) && v.txinwitness.length > 0
  );
  const formatDate = (ts) => {
    if (!ts) return "N/A";

    return new Date(ts * 1000).toLocaleString("hr-HR", {
      timeZone: "Europe/Zagreb",
      hour12: false,
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),transparent_70%)]" />

        <div className="relative">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Transaction
          </h2>

          <div className="grid gap-3 text-sm text-slate-200">
            <Row label="TXID" value={tx.txid} mono wrap/>
            <Row
              label="Date"
              value={
                typeof tx.blockTime === "number"
                  ? formatDate(tx.blockTime)
                  : "Unconfirmed (in mempool)"
              }
            />
            <Row
                label="Status"
                value={
                    typeof tx.confirmations === "number" && tx.confirmations > 0
                    ? `Confirmed (${tx.confirmations})`
                    : "Unconfirmed"
                }
                />
            <Row
              label="Size"
              value={
                typeof tx.size === "number"
                  ? `${tx.size} bytes`
                  : "N/A"
              }
            />
            <Row label="Inputs" value={vin.length} />
            <Row label="Outputs" value={vout.length} />
            <Row
              label="Input value"
              value={
                isCoinbase
                  ? "Coinbase"
                  : formatTriple(tx.inputValue)
              }
            />
            <Row
              label="Output value"
              value={formatTriple(tx.outputValue)}
            />
            <Row
              label="Transaction fee"
              value={
                isCoinbase
                  ? "None"
                  : formatTriple(tx.fee)
              }
            />
            <Row
              label="Fee rate"
              value={feeRate ? `${feeRate} sat/vB` : "N/A"}
            />
            <Row
              label="Version"
              value={
                typeof tx.version === "number"
                  ? tx.version
                  : "N/A"
              }
            />
            <Row label="SegWit" value={isSegWit ? "Yes" : "No"} />
          </div>
        </div>
      </div>

      <div className="grid grid-rows-2 gap-6">
        <InputList vin={vin} />
        <OutputList vout={vout} />
      </div>
    </div>
  );
}
