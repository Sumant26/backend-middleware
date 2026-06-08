import { randomUUID } from "crypto";

/**
 * Assigns a unique ID to every incoming request.
 * - Respects an existing X-Request-Id header (useful when a gateway forwards one).
 * - Attaches the id to req.requestId so other middlewares / controllers can use it.
 * - Echoes the id back in the response header for client-side tracing.
 */
const requestId = (req, res, next) => {
    const id = req.headers["x-request-id"] || randomUUID();
    req.requestId = id;
    res.setHeader("X-Request-Id", id);
    next();
};

export default requestId;
