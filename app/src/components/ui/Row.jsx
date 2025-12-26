export default function Row({ label, value, mono }) {
  const display =
    value === null || value === undefined ? "N/A" : value;

  return (
    <div className="flex justify-between gap-4 border-b border-white/5 pb-2 last:border-none">
      <span className="text-slate-400">{label}</span>
      <span
        className={`text-right ${
          mono ? "font-mono text-xs text-slate-300" : "text-slate-100"
        }`}
      >
        {display}
      </span>
    </div>
  );
}
