import Row from "../ui/Row";
import { formatTriple } from "../../utils/format";

export default function BlockCard({ block }) {
  const dateTime =
    block.time &&
    new Date(block.time * 1000).toLocaleString("hr-HR", {
      timeZone: "Europe/Zagreb",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

  const reward =
    block.subsidy &&
    block.totalFee &&
    formatTriple(block.subsidy + block.totalFee);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),transparent_70%)]" />

      <div className="relative">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Block #{block.height}
        </h2>

        <div className="grid gap-3 text-sm text-slate-200">
          <Row label="Height" value={block.height} />
          <Row label="Hash" value={block.hash} mono wrap />
          <Row label="Merkle Root" value={block.merkleRoot} mono wrap />
          <Row label="Block timestamp" value={dateTime} />
          <Row label="Transactions" value={block.txCount} />
          <Row
            label="Total Size"
            value={block.size && `${(block.size / 1e6).toFixed(2)} MB`}
          />
          <Row
            label="Difficulty"
            value={block.difficulty && block.difficulty.toLocaleString("en-US")}
          />
          <Row label="Nonce" value={block.nonce} />
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
            label="Reward"
            value={reward}
          />
          <Row
            label="Total Output Value"
            value={block.totalValue && formatTriple(block.totalValue)}
            wrap
          />
          <Row
            label="Miner (Pool)"
            value={
              typeof block.minerTag === "string" && block.minerTag.length > 0
                ? block.minerTag
                : "Unknown"
            }
          />
          <Row
            label="Coinbase data"
            value={block.minerCoinbase || "N/A"}
            mono
            wrap
          />
        </div>
      </div>
    </div>
  );
}
