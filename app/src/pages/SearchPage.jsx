import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { searchExplorer } from "../api/explorer";

export default function SearchPage() {
  const { query } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    searchExplorer(query)
      .then((res) => {
        if (res.type === "block") {
          navigate(`/block/${res.hash}`);
        }
        if (res.type === "tx") {
          navigate(`/tx/${res.txid}`);
        }
      })
      .catch(() => {
        navigate("/");
      });
  }, [query, navigate]);

  return (
    <div className="p-10 text-center text-slate-400">
      Searching…
    </div>
  );
}
