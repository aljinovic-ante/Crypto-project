import Row from "../ui/Row";
import { formatTriple } from "../../utils/format";

export default function BlockCard({ block }) {
  const time =
    block.time &&
    new Date(block.time * 1000).toLocaleString("hr-HR", {
      timeZone: "Europe/Zagreb"
    });

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.15),transparent_70%)]" />

      <div className="relative">
        <h2 className="text-2xl font-semibold text-white mb-6">
          Block #{block.height}
        </h2>

        <div className="grid gap-3 text-sm text-slate-200">
          <Row label="Hash" value={block.hash} mono />
          <Row label="Transactions" value={block.txCount} />
          <Row
            label="Total Size"
            value={block.size && `${(block.size / 1e6).toFixed(2)} MB`}
          />
          <Row label="Time" value={time} />
          <Row
            label="Weight"
            value={block.weight && `${block.weight} WU`}
          />
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
            label="Subsidy + Fee"
            value={
              block.subsidy &&
              block.totalFee &&
              formatTriple(block.subsidy + block.totalFee)
            }
          />
          <Row
            label="Total Output Value"
            value={block.totalValue && formatTriple(block.totalValue)}
          />
        </div>
      </div>
    </div>
  );
}
