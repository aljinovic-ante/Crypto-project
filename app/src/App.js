import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExplorerPage from "./pages/ExplorerPage";
import BlockPage from "./pages/BlockPage";
import TxPage from "./pages/TxPage";
import SearchPage from "./pages/SearchPage";
import ExchangePage from "./pages/ExchangePage";
import MempoolPage from "./pages/MempoolPage";
import AddressPage from "./pages/AddressPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<ExplorerPage />} />
          <Route path="/search/:query" element={<SearchPage />} />
          <Route path="/block/:id" element={<BlockPage />} />
          <Route path="/tx/:txid" element={<TxPage />} />
          <Route path="/exchange" element={<ExchangePage />} />
          <Route path="/mempool" element={<MempoolPage />} />
          <Route path="/address/:address" element={<AddressPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
