import { Request, Response, NextFunction } from "express";
import { verifySessionId } from "./jwt";
import { sessionStore } from "../core/sessionStore";
import { Session } from "../core/types";

export interface AuthedRequest extends Request {
  session?: Session;
  sessionId?: string;
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ error: "Missing bearer token" });

  let sessionId: string;
  try {
    sessionId = verifySessionId(header.slice(7));
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const session = sessionStore.get(sessionId);
  if (!session) return res.status(401).json({ error: "Session expired or unknown — please sign in again" });

  req.session = session;
  req.sessionId = sessionId;
  next();
}
