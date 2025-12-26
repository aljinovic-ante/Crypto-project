import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchExplorer } from "../api/explorer";
import BlockCard from "../components/block/BlockCard";
import TxList from "../components/block/TxList";

export default function BlockPage() {
  const { id } = useParams();
  const [block, setBlock] = useState(null);

  useEffect(() => {
    searchExplorer(id).then(setBlock);
  }, [id]);

  if (!block) {
    return <>
        <div className="text-slate-400 text-center py-10">
          Fetching block information...
        </div>
        </>
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold text-white">
          Block Information
        </h1>
      </div>
      <hr></hr><br></br>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <BlockCard block={block} />
        <TxList txs={block.tx ?? []} />
      </div>
    </div>
  );
}
