const requestLogger = (req, res, next) => {
    const startTime = Date.now();

    res.on("finish", () => {
        const duration  = Date.now() - startTime;
        const id        = req.requestId ? `[${req.requestId}] ` : "";
        const ip        = req.ip || req.socket?.remoteAddress || "-";
        console.log(`${id}${req.method} ${req.originalUrl} ${res.statusCode} ${ip} - ${duration}ms`);
    });

    next();
};

export default requestLogger;
