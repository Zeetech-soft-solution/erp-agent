import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Settings } from "./pages/Settings";
import { Users } from "./pages/Users";
import { Sidebar } from "./components/Sidebar";
import { api } from "./api/client";

/**
 * Route shell — deliberately minimal. As the admin console grows
 * (role policy editor, module toggles, audit log), add a <Route> here
 * and a matching <NavLink> in Sidebar.tsx; nothing else changes.
 */
function RequireAuth({ children }: { children: React.ReactNode }) {
  if (!api.isLoggedIn()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <Sidebar />
      {children}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/users"
          element={
            <RequireAuth>
              <AdminLayout>
                <Users />
              </AdminLayout>
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/settings" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
