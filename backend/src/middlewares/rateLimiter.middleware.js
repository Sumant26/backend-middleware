const visitors = new Map();

const rateLimiter = (options = {}) => {
    const windowMs = options.windowMs || 15 * 60 * 1000;
    const maxRequests = options.maxRequests || 100;

    return (req, res, next) => {
        const now = Date.now();
        const key = req.ip || req.socket.remoteAddress || "unknown";
        const visitor = visitors.get(key) || { count: 0, resetAt: now + windowMs };

        if (visitor.resetAt <= now) {
            visitor.count = 0;
            visitor.resetAt = now + windowMs;
        }

        visitor.count += 1;
        visitors.set(key, visitor);

        res.setHeader("X-RateLimit-Limit", maxRequests);
        res.setHeader("X-RateLimit-Remaining", Math.max(maxRequests - visitor.count, 0));
        res.setHeader("X-RateLimit-Reset", Math.ceil(visitor.resetAt / 1000));

        if (visitor.count > maxRequests) {
            return res.status(429).json({
                success: false,
                message: "Too many requests, please try again later",
            });
        }

        next();
    };
};

export default rateLimiter;
