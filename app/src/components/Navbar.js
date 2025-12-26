import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    [
      "px-4 py-2 rounded-lg text-sm font-medium transition",
      isActive
        ? "bg-sky-500 text-white shadow"
        : "text-slate-300 hover:bg-slate-800 hover:text-white"
    ].join(" ");

  return (
    <nav className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-slate-100 font-semibold tracking-tight text-lg">
            BlockExplorer
          </span>
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Explorer
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
