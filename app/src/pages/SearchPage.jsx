import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import { searchExplorer } from "../api/explorer";

export default function SearchPage() {
  const { query } = useParams();
  const navigate = useNavigate();
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    searchExplorer(query)
      .then((res) => {
        if (res.type === "block") {
          navigate(`/block/${res.hash}`);
          return;
        }

        if (res.type === "tx") {
          navigate(`/tx/${res.txid}`);
          return;
        }

        if (res.type === "address") {
          navigate(`/address/${res.address}`);
          return;
        }

        alert("Unexpected response from server.");
        navigate("/");
      })
      .catch((err) => {
        if (err.message === "Invalid input") {
          alert("Invalid input. Enter a block height, block hash, or TXID.");
        } else if (err.message === "Not found") {
          alert("Nothing found. This block or transaction does not exist.");
        } else {
          alert("Server error. Please try again later.");
        }

        navigate("/");
      });
  }, [query, navigate]);

  return (
    <div className="p-10 text-center text-slate-400">
      Searching…
    </div>
  );
}
