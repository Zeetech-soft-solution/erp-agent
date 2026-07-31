const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function getToken() {
  return localStorage.getItem("erp_agent_admin_token");
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  loginWithPassword: (email: string, password: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  loginWithApiKey: (email: string, apiKey: string, apiSecret: string) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify({ email, apiKey, apiSecret }) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  getSettings: () => request("/api/admin/settings"),
  updateSetting: (key: string, value: any) =>
    request(`/api/admin/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }) }),
  getStatus: () => request("/api/admin/status"),
  getUsers: () => request("/api/admin/users"),
  setUserCredential: (email: string, apiKey: string, apiSecret: string) =>
    request(`/api/admin/users/${encodeURIComponent(email)}/credential`, { method: "PUT", body: JSON.stringify({ apiKey, apiSecret }) }),
  revokeUserCredential: (email: string) =>
    request(`/api/admin/users/${encodeURIComponent(email)}/credential`, { method: "DELETE" }),
  setToken: (token: string) => localStorage.setItem("erp_agent_admin_token", token),
  clearToken: () => localStorage.removeItem("erp_agent_admin_token"),
  isLoggedIn: () => !!getToken(),
};
