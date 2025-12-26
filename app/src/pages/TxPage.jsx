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
    <div className="mb-8 text-center">
      <h1 className="text-3xl font-semibold text-white">
        Transaction Details
      </h1>
    </div>
    <hr></hr><br></br>
    {loading && (
      <div className="flex items-center justify-center min-h-[40vh] text-slate-400">
        Fetching transaction information…
      </div>
    )}

    {error && (
      <div className="max-w-3xl mx-auto bg-red-900/20 border border-red-800 text-red-300 p-4 rounded-xl text-center">
        {error}
      </div>
    )}

    {tx && (
      <div className="mt-6">
        <TxCard tx={tx} />
      </div>
    )}
  </div>
);

}
