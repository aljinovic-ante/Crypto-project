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
    return <div className="p-10 text-slate-400">Loading…</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <BlockCard block={block} />
      <TxList txs={block.tx ?? []} />
    </div>
  );
}
