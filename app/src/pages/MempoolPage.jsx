import { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Label
} from "recharts";

const MAX_TX = 100;
const INTERVAL_MS = 10000;

const renderTxid = (txid) => {
  if (!txid || txid.length < 20) return txid;

  const start = txid.slice(0, 10);
  const middle = txid.slice(10, -10);
  const end = txid.slice(-10);

  return (
    <span className="break-all">
      <span className="font-semibold">{start}</span>
      {middle}
      <span className="font-semibold">{end}</span>
    </span>
  );
};

export default function MempoolPage() {
  const [txs, setTxs] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [feeData, setFeeData] = useState([]);

  const bucketRef = useRef([]);
  const lastBucketTime = useRef(null);

  useEffect(() => {
    const es = new EventSource("http://localhost:3001/api/mempool/stream");

    es.onmessage = e => {
      const tx = JSON.parse(e.data);

      setTxs(prev => {
        if (prev.some(t => t.txid === tx.txid)) return prev;
        return [tx, ...prev].slice(0, MAX_TX);
      });

      bucketRef.current.push(tx.value);
    };

    return () => es.close();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (bucketRef.current.length === 0) return;

      const now = Date.now();
      const rounded = Math.floor(now / INTERVAL_MS) * INTERVAL_MS;

      if (lastBucketTime.current === rounded) return;
      lastBucketTime.current = rounded;

      const avgValue =
        bucketRef.current.reduce((s, v) => s + v, 0) /
        bucketRef.current.length;

      bucketRef.current = [];

      setLineData(prev =>
        [...prev, { time: rounded, value: avgValue }].slice(-50)
      );
    }, INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => {
    if (txs.length === 0) return null;

    const totalValue = txs.reduce((s, t) => s + t.value, 0);
    const feeRates = txs
      .map(t => (t.fee * 1e8) / t.vsize)
      .sort((a, b) => a - b);

    const avgFee = feeRates.reduce((s, f) => s + f, 0) / feeRates.length;
    const medianFee = feeRates[Math.floor(feeRates.length / 2)];

    return {
      totalValue: totalValue.toFixed(2),
      avgFee: avgFee.toFixed(2),
      medianFee: medianFee.toFixed(2)
    };
  }, [txs]);

  useEffect(() => {
    const buckets = { "0–1": 0, "1–5": 0, "5–10": 0, "10+": 0 };

    txs.forEach(tx => {
      const rate = (tx.fee * 1e8) / tx.vsize;
      if (rate < 1) buckets["0–1"]++;
      else if (rate < 5) buckets["1–5"]++;
      else if (rate < 10) buckets["5–10"]++;
      else buckets["10+"]++;
    });

    setFeeData(
      Object.entries(buckets).map(([name, value]) => ({ name, value }))
    );
  }, [txs]);

  const formatZagrebTime = (ts) =>
    new Date(ts).toLocaleTimeString("hr-HR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Europe/Zagreb",
      hour12: false
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold mb-1">Mempool Visualization</h1>
      <p className="text-white/70 mb-8">
        Live view of unconfirmed Bitcoin transactions
      </p>

      <hr /><br />

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-slate-900 rounded-xl p-3">
            <div className="text-xs text-white/60">Total value</div>
            <div className="text-xl font-semibold">{stats.totalValue} BTC</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3">
            <div className="text-xs text-white/60">Avg fee rate</div>
            <div className="text-xl font-semibold">{stats.avgFee} sat/vB</div>
          </div>
          <div className="bg-slate-900 rounded-xl p-3">
            <div className="text-xs text-white/60">Median fee</div>
            <div className="text-xl font-semibold">{stats.medianFee} sat/vB</div>
          </div>
        </div>
      )}

      <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 rounded-xl p-4">
          <div className="text-sm text-white/80">
            Transaction value over time
          </div>
          <div className="text-xs text-white/50 mb-2">
            Shows how the average value of transactions entering the mempool changes over time.
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <XAxis
                dataKey="time"
                type="number"
                domain={["dataMin", "dataMax"]}
                tickFormatter={formatZagrebTime}
              >
                <Label value="Time" position="insideBottom" offset={-5} />
              </XAxis>
              <YAxis>
                <Label value="Value (BTC)" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip
                labelFormatter={formatZagrebTime}
                formatter={(v) => [`${v.toFixed(4)} BTC`, "Avg value"]}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#38bdf8"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900 rounded-xl p-4">
          <div className="text-sm text-white/80">
            Fee rate distribution
          </div>
          <div className="text-xs text-white/50 mb-2">
            Shows how unconfirmed transactions are grouped by fee rate, indicating miner prioritization.
          </div>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={feeData}>
              <XAxis dataKey="name">
                <Label value="Fee rate (sat/vB)" position="insideBottom" offset={-5} />
              </XAxis>
              <YAxis>
                <Label value="TX count" angle={-90} position="insideLeft" />
              </YAxis>
              <Tooltip />
              <Bar dataKey="value" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="text-sm mb-4">Mempool size: {txs.length} tx</div>
      <hr /><br></br>

      <div className="flex flex-wrap gap-6 text-sm text-white/90 mb-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-400"></span>
          Low fee rate (&lt; 2 sat/vB) – low priority
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
          Medium fee rate (2–5 sat/vB) – medium priority
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-400"></span>
          High fee rate (&gt; 5 sat/vB) – high priority
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {txs.map(tx => {
          const rate = (tx.fee * 1e8) / tx.vsize;
          const color =
            rate < 2 ? "text-green-400" :
            rate < 5 ? "text-yellow-400" :
            "text-red-400";

          return (
            <div
              key={tx.txid}
              className="bg-gradient-to-br from-slate-900 to-indigo-950 p-4 rounded-xl"
            >
              <div className="text-xs leading-relaxed">
                TXID: {renderTxid(tx.txid)}
              </div>
              <div className="text-sm mt-2">Value: {tx.value} BTC</div>
              <div className="text-sm text-white/70">Fee: {tx.fee} BTC</div>
              <div className={`text-sm ${color}`}>
                Fee rate: {rate.toFixed(2)} sat/vB
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
