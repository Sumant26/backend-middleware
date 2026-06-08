/**
 * Progressive slow-down middleware (zero external dependencies).
 *
 * Works alongside the rate-limiter:
 *  - Rate limiter  → hard blocks after N requests (429).
 *  - Slow-down     → adds artificial delay after M requests so abusive
 *                    clients naturally back off before hitting the hard limit.
 *
 * Options:
 *   windowMs   – sliding window length in ms         (default: 15 min)
 *   delayAfter – requests before delay kicks in       (default: 50)
 *   delayMs    – ms added per extra request           (default: 500)
 *   maxDelayMs – cap on the total artificial delay    (default: 5 000)
 */
const visitors = new Map();

const slowDown = (options = {}) => {
    const windowMs   = options.windowMs   ?? 15 * 60 * 1000;
    const delayAfter = options.delayAfter ?? 50;
    const delayMs    = options.delayMs    ?? 500;
    const maxDelayMs = options.maxDelayMs ?? 5000;

    return (req, res, next) => {
        const now = Date.now();
        const key = req.ip || req.socket?.remoteAddress || "unknown";

        let visitor = visitors.get(key);

        if (!visitor || visitor.resetAt <= now) {
            visitor = { count: 0, resetAt: now + windowMs };
        }

        visitor.count += 1;
        visitors.set(key, visitor);

        if (visitor.count > delayAfter) {
            const delay = Math.min((visitor.count - delayAfter) * delayMs, maxDelayMs);
            res.setHeader("X-SlowDown-Delay", `${delay}ms`);
            return setTimeout(next, delay);
        }

        next();
    };
};

export default slowDown;
