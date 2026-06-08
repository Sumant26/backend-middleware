const securityHeaders = (req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "0");
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
};

const corsMiddleware = (req, res, next) => {
    const allowedOrigin = process.env.CORS_ORIGIN || "*";

    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
};

export {
    securityHeaders,
    corsMiddleware
};
