import jwt from "jsonwebtoken";
import { appConfig } from "../config/app.config";

/**
 * The JWT now carries ONLY an opaque sessionId — see core/sessionStore.ts
 * for why the real UserCredential deliberately never goes in here.
 */
export function issueAgentToken(sessionId: string): string {
  return jwt.sign({ sessionId }, appConfig.jwt.secret, { expiresIn: appConfig.jwt.expiresIn });
}

export function verifySessionId(token: string): string {
  const payload = jwt.verify(token, appConfig.jwt.secret) as { sessionId: string };
  return payload.sessionId;
}
