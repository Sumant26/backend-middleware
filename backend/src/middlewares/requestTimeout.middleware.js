/**
 * Aborts requests that exceed the given timeout (default: 10s).
 * - Sends a 503 if headers haven't been sent yet.
 * - Clears the timer on finish / close so it never fires after a normal response.
 */
const requestTimeout = (timeoutMs = 10000) => (req, res, next) => {
    const timer = setTimeout(() => {
        if (!res.headersSent) {
            res.status(503).json({
                success: false,
                message: "Request timed out. Please try again later.",
                requestId: req.requestId || null,
            });
        }
    }, timeoutMs);

    res.on("finish", () => clearTimeout(timer));
    res.on("close", () => clearTimeout(timer));

    next();
};

export default requestTimeout;
