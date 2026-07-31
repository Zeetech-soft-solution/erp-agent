import axios, { AxiosInstance } from "axios";
import { appConfig } from "../config/app.config";

/**
 * Low-level ERPNext REST helpers. The SERVICE-level client (default
 * export) is reserved for system introspection only (getUserRoles) —
 * every business-data helper below now accepts an optional `client`
 * override, and erpnextConnector.ts always passes one built for the
 * ACTING PERSON (session cookie or personal API key), never this
 * default service client, so ERPNext's own audit trail attributes
 * every create/update to the real user.
 */
const erpnextClient: AxiosInstance = axios.create({
  baseURL: appConfig.erpnext.baseUrl,
  headers: {
    Authorization: `token ${appConfig.erpnext.apiKey}:${appConfig.erpnext.apiSecret}`,
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export default erpnextClient;

export async function getDocList(doctype: string, params?: Record<string, any>, client: AxiosInstance = erpnextClient) {
  const res = await client.get(`/api/resource/${doctype}`, { params });
  return res.data.data;
}

export async function getDoc(doctype: string, name: string, client: AxiosInstance = erpnextClient) {
  const res = await client.get(`/api/resource/${doctype}/${encodeURIComponent(name)}`);
  return res.data.data;
}

export async function createDoc(doctype: string, payload: Record<string, any>, client: AxiosInstance = erpnextClient) {
  const res = await client.post(`/api/resource/${doctype}`, payload);
  return res.data.data;
}

export async function updateDoc(doctype: string, name: string, payload: Record<string, any>, client: AxiosInstance = erpnextClient) {
  const res = await client.put(`/api/resource/${doctype}/${encodeURIComponent(name)}`, payload);
  return res.data.data;
}
