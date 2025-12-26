import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ExplorerPage from "./pages/ExplorerPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-900 text-slate-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<ExplorerPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
