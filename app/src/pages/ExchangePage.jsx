import { useEffect, useState } from "react";
import PriceChart from "../components/exchange/PriceChart";

const CRYPTO = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "tether", symbol: "USDT", name: "Tether" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin" },
  { id: "tron", symbol: "TRX", name: "TRON" }
];

const FIAT = ["USD", "EUR", "GBP", "JPY", "CHF", "AUD", "CAD", "CNY", "SEK", "NOK"];

export default function ExchangePage() {
  const [from, setFrom] = useState("BTC");
  const [to, setTo] = useState("EUR");
  const [rate, setRate] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fromCrypto = CRYPTO.find((c) => c.symbol === from);

  useEffect(() => {
    if (!fromCrypto) return;

    let cancelled = false;

    setLoading(true);
    setHistory([]);
    setRate(null);
    setErrorMsg("");

    const vs = to.toLowerCase();

    const fetchRate = fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${fromCrypto.id}&vs_currencies=${vs}`
    ).then(async (r) => {
      if (!r.ok) {
        if (r.status === 429) {
          throw new Error("429");
        }
        throw new Error(`rate:${r.status}`);
      }
      return r.json();
    });

    const fetchHistory = fetch(
      `https://api.coingecko.com/api/v3/coins/${fromCrypto.id}/market_chart?vs_currency=${vs}&days=30&interval=daily`
    ).then(async (r) => {
      if (!r.ok) {
        if (r.status === 429) {
          throw new Error("429");
        }
        throw new Error(`history:${r.status}`);
      }
      return r.json();
    });

    Promise.all([fetchRate, fetchHistory])
      .then(([rateData, histData]) => {
        if (cancelled) return;

        setRate(rateData?.[fromCrypto.id]?.[vs] ?? null);

        const daily = (histData?.prices ?? []).map(([ts, price]) => ({
          date: new Date(ts).toLocaleDateString("hr-HR", {
            day: "2-digit",
            month: "2-digit"
          }),
          price
        }));
        setHistory(daily);
      })
      .catch((err) => {
        if (cancelled) return;

        if (err?.message === "429") {
          setErrorMsg("Too many requests — please try again later.");
        } else {
          setErrorMsg("Too many requests — please try again later.");
        }

        setHistory([]);
        setRate(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const rawMax = history.length > 0 ? Math.max(...history.map((p) => p.price)) : null;

  const yMax = rawMax ? roundNice(rawMax * 1.1) : null;

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-10 text-slate-200">
      <h1 className="text-2xl font-semibold mb-8 text-center">Exchange</h1>

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-10 space-y-10">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 max-w-4xl mx-auto">
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm"
          >
            <optgroup label="Crypto">
              {CRYPTO.map((c) => (
                <option key={c.symbol} value={c.symbol}>
                  {c.symbol} — {c.name}
                </option>
              ))}
            </optgroup>
          </select>

          <div className="text-slate-400 text-xl font-semibold">=</div>

          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm"
          >
            <optgroup label="Fiat">
              {FIAT.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        <div className="text-center border-t border-white/10 pt-6 space-y-2">
          {loading && <div className="text-slate-400">Loading…</div>}

          {!loading && errorMsg && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 bg-red-500/10 text-red-200 text-sm">
              {errorMsg}
            </div>
          )}

          {!loading && !errorMsg && rate !== null && (
            <div className="text-xl font-semibold">
              1 {from} ={" "}
              {rate.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}{" "}
              {to}
            </div>
          )}
        </div>

        {!loading && !errorMsg && history.length > 0 && (
          <PriceChart
            data={history}
            title="Price history — last 30 days"
            yLabel={`${fromCrypto.name} price in ${to}`}
            currency={to}
            yMax={yMax}
          />
        )}
      </div>
    </div>
  );
}

function roundNice(value) {
  if (!value) return value;

  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / magnitude) * magnitude;
}
