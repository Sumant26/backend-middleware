import express from "express";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import responseMiddleware from "./middlewares/response.middleware.js";
import rateLimiter from "./middlewares/rateLimiter.middleware.js";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import sanitizeRequest from "./middlewares/sanitize.middleware.js";
import { corsMiddleware, securityHeaders } from "./middlewares/security.middleware.js";
import requestId from "./middlewares/requestId.middleware.js";
import requestTimeout from "./middlewares/requestTimeout.middleware.js";
import slowDown from "./middlewares/slowDown.middleware.js";
import compression from "./middlewares/compression.middleware.js";

const app = express(); // create an express app

// ── 1. Identity & tracing ────────────────────────────────────────────────────
app.use(requestId);           // attach X-Request-Id to every request

// ── 2. Security ──────────────────────────────────────────────────────────────
app.use(securityHeaders);     // X-Frame-Options, CSP, Referrer-Policy, etc.
app.use(corsMiddleware);       // Access-Control headers

// ── 3. Throttling ────────────────────────────────────────────────────────────
app.use(slowDown());           // progressive delay (soft limit)
app.use(rateLimiter());        // hard block at 100 req / 15 min

// ── 4. Timeout guard ─────────────────────────────────────────────────────────
app.use(requestTimeout(10000)); // 503 if a request takes > 10 s

// ── 5. Parsing & compression ─────────────────────────────────────────────────
app.use(compression());        // gzip / brotli / deflate
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// ── 6. Sanitization & response shaping ───────────────────────────────────────
app.use(sanitizeRequest);      // strip $ and . keys (NoSQL injection guard)
app.use(responseMiddleware);   // standardised res.success / res.error helpers

// ── 7. Logging ───────────────────────────────────────────────────────────────
app.use(requestLogger);        // METHOD URL STATUS IP - Xms  (includes requestId)

// routes import

import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";


// routes declaration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/posts", postRouter);

app.use(notFound);
app.use(errorHandler);

// example route: http://localhost:3000/api/v1/users/register
export default app;
