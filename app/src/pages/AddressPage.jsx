import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const API = "https://mempool.space/api";

export default function AddressPage() {
  const { address } = useParams();
  const navigate = useNavigate();

  const [info, setInfo] = useState(null);
  const [utxos, setUtxos] = useState([]);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [infoRes, utxoRes, txRes] = await Promise.all([
          fetch(`${API}/address/${address}`),
          fetch(`${API}/address/${address}/utxo`),
          fetch(`${API}/address/${address}/txs`)
        ]);

        if (!infoRes.ok) throw new Error("Address not found");

        const infoJson = await infoRes.json();
        const utxoJson = utxoRes.ok ? await utxoRes.json() : [];
        const txJson = txRes.ok ? await txRes.json() : [];

        if (!cancelled) {
          setInfo(infoJson);
          setUtxos(utxoJson);
          setTxs(txJson);
        }
      } catch {
        if (!cancelled) setError("Invalid or unknown address");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => (cancelled = true);
  }, [address]);

  const formatBTC = (sats) =>
    `${(sats / 1e8).toLocaleString("hr-HR", {
      minimumFractionDigits: 8,
      maximumFractionDigits: 8
    })} BTC`;

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-slate-400">
        Loading address…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-400">
        {error}
      </div>
    );
  }

  const chain = info.chain_stats;
  const mempool = info.mempool_stats;

  const balance =
    chain.funded_txo_sum -
    chain.spent_txo_sum +
    mempool.funded_txo_sum -
    mempool.spent_txo_sum;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold mb-2">
        Address details
      </h1>

      <div className="mb-6 break-all rounded-lg border border-white/10 bg-slate-900 p-4 text-sm">
        {info.address}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Stat label="Balance" value={formatBTC(balance)} />
        <Stat label="Total received" value={formatBTC(chain.funded_txo_sum)} />
        <Stat label="Total sent" value={formatBTC(chain.spent_txo_sum)} />
        <Stat
          label="Transactions"
          value={(chain.tx_count + mempool.tx_count).toLocaleString("hr-HR")}
        />
      </div>

      <Section title="Unspent outputs (UTXOs)">
        {utxos.length === 0 && (
          <div className="text-slate-400 text-sm">
            No unspent outputs
          </div>
        )}

        {utxos.map((u) => (
          <div
            key={`${u.txid}-${u.vout}`}
            className="flex justify-between text-sm border-b border-white/5 py-2"
          >
            <div className="break-all">
              {u.txid}:{u.vout}
            </div>
            <div>{formatBTC(u.value)}</div>
          </div>
        ))}
      </Section>

      <Section title="Recent transactions">
        {txs.length === 0 && (
          <div className="text-slate-400 text-sm">
            No transactions found
          </div>
        )}

        {txs.map((t) => (
          <button
            key={t.txid}
            onClick={() => navigate(`/tx/${t.txid}`)}
            className="w-full text-left border-b border-white/5 py-3 text-sm hover:bg-slate-800/60 transition"
          >
            <div className="break-all font-mono text-sky-400">
              {t.txid}
            </div>
            <div className="text-slate-400 mt-1">
              {t.status.confirmed ? "Confirmed" : "In mempool"}
            </div>
          </button>
        ))}
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-3">
        {title}
      </h2>
      <div className="rounded-lg border border-white/10 bg-slate-900 p-4">
        {children}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900 p-4">
      <div className="text-xs text-slate-400">
        {label}
      </div>
      <div className="text-lg font-semibold">
        {value}
      </div>
    </div>
  );
}
