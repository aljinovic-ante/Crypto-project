import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { searchExplorer } from "../api/explorer";
import TxCard from "../components/tx/TxCard";

export default function TxPage() {
  const { txid } = useParams();
  const [tx, setTx] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    setTx(null);

    searchExplorer(txid)
      .then((res) => {
        if (res.type !== "tx") {
          setError("Not a transaction");
        } else {
          setTx(res);
        }
      })
      .catch(() => {
        setError("Transaction not found");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [txid]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {loading && (
        <div className="text-slate-400 text-center py-10">
          Loading…
        </div>
      )}

      {error && (
        <div className="text-red-400 bg-red-900/20 border border-red-800 p-4 rounded-lg">
          {error}
        </div>
      )}

      {tx && <TxCard tx={tx} />}
    </div>
  );
}
