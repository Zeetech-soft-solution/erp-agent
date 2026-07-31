import { RequestHandler } from "express";

/**
 * Express 4 does not catch rejections thrown inside an async route
 * handler — they become unhandled promise rejections and, by default,
 * crash the whole Node process (killing every other in-flight request
 * too, not just the one that errored). Wrap any async handler with
 * this so its errors reach the global error middleware in server.ts
 * instead.
 */
export function asyncHandler(fn: RequestHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
