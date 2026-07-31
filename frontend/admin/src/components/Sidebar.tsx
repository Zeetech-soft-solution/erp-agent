import { NavLink } from "react-router-dom";

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">ERP <span>Agent</span> Admin</div>
      <nav className="sidebar-nav">
        <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
          Global settings
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => (isActive ? "active" : "")}>
          User credentials
        </NavLink>
        {/* Add more admin sections here as the console grows:
            role policy editor, module toggles, audit log viewer, etc. */}
      </nav>
    </aside>
  );
}
