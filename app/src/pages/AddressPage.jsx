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

  const [utxosOpen, setUtxosOpen] = useState(true);
  const [txsOpen, setTxsOpen] = useState(true);

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
          setUtxos(Array.isArray(utxoJson) ? utxoJson : []);
          setTxs(Array.isArray(txJson) ? txJson : []);
        }
      } catch {
        if (!cancelled) setError("Invalid or unknown address");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (address) load();
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
    return <div className="text-center py-20 text-red-400">{error}</div>;
  }

  const chain = info?.chain_stats ?? {};
  const mempool = info?.mempool_stats ?? {};

  const balance =
    (chain.funded_txo_sum ?? 0) -
    (chain.spent_txo_sum ?? 0) +
    (mempool.funded_txo_sum ?? 0) -
    (mempool.spent_txo_sum ?? 0);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      <h1 className="text-2xl font-semibold mb-2">Address details</h1>

      <div className="mb-6 break-all rounded-lg border border-white/10 bg-slate-900 p-4 text-sm">
        {info?.address}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Stat label="Balance" value={formatBTC(balance)} />
        <Stat
          label="Total received"
          value={formatBTC(chain.funded_txo_sum ?? 0)}
        />
        <Stat label="Total sent" value={formatBTC(chain.spent_txo_sum ?? 0)} />
        <Stat
          label="Transactions"
          value={((chain.tx_count ?? 0) + (mempool.tx_count ?? 0)).toLocaleString(
            "hr-HR"
          )}
        />
      </div>

      <Section
        title="Unspent outputs (UTXOs)"
        open={utxosOpen}
        onToggle={() => setUtxosOpen((v) => !v)}
      >
        {utxos.length === 0 ? (
          <div className="text-slate-400 text-sm">No unspent outputs</div>
        ) : (
          <div className="max-h-[520px] overflow-y-auto space-y-2">
            {utxos.map((u) => (
              <div
                key={`${u.txid}-${u.vout}`}
                className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-slate-950/40 px-3 py-3 text-sm"
              >
                <div className="break-all font-mono text-white/90">
                  {u.txid}:{u.vout}
                </div>
                <div className="shrink-0 text-white/90">
                  {formatBTC(u.value)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Recent transactions"
        open={txsOpen}
        onToggle={() => setTxsOpen((v) => !v)}
      >
        {txs.length === 0 ? (
          <div className="text-slate-400 text-sm">No transactions found</div>
        ) : (
          <div className="max-h-[520px] overflow-y-auto space-y-2">
            {txs.map((t) => (
              <button
                key={t.txid}
                onClick={() => navigate(`/tx/${t.txid}`)}
                className="w-full text-left rounded-lg border border-white/10 bg-slate-950/40 px-3 py-3 text-sm hover:bg-slate-800/60 transition"
              >
                <div className="break-all font-mono text-sky-400">{t.txid}</div>
                <div className="text-slate-400 mt-1">
                  {t.status?.confirmed ? "Confirmed" : "In mempool"}
                </div>
              </button>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children, open, onToggle }) {
  return (
    <div className="mb-8 rounded-lg border border-white/10 bg-slate-900">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <span className="text-white/70 select-none">
          {open ? "▾" : "▸"}
        </span>
      </button>

      {open && (
        <div className="border-t border-white/10 px-4 py-4">
          {children}
        </div>
      )}
    </div>
  );
}


function Stat({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-900 p-4">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
