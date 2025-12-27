import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    setQ("");
    navigate(`/search/${value}`);
  };

  const linkClass = ({ isActive }) =>
    [
      "px-4 py-2 rounded-lg text-sm font-medium transition",
      isActive
        ? "bg-sky-500 text-white shadow"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    ].join(" ");

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
        <NavLink
          to="/"
          reloadDocument
          className="text-slate-100 font-semibold tracking-tight text-lg"
        >
          BlockExplorer
        </NavLink>
        <NavLink to="/exchange" className={linkClass}>
          Exchange
        </NavLink>
        <NavLink to="/mempool" className={linkClass}>
          Mempool
        </NavLink>
        <form
          onSubmit={submit}
          className="ml-auto flex items-center gap-2"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Block # or Hash / TXID"
            className="w-72 bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-lg text-sm font-medium text-white">
            Search
          </button>
        </form>
      </div>
    </nav>
  );
}
