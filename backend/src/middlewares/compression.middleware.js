import zlib from "zlib";

/**
 * Response compression middleware (zero external dependencies).
 * Supports Brotli, Gzip, and Deflate based on the client's Accept-Encoding header.
 *
 * Options:
 *   threshold – minimum byte size to compress (default: 1 024 bytes / 1 KB)
 *
 * Strategy: monkey-patches res.json() and res.send() so every JSON / text
 * response is compressed transparently before being written to the socket.
 */

const COMPRESSIBLE = /^(text\/|application\/(json|javascript|xml|x-www-form-urlencoded))/i;

const pickEncoding = (acceptEncoding = "") => {
    if (acceptEncoding.includes("br"))      return "br";
    if (acceptEncoding.includes("gzip"))    return "gzip";
    if (acceptEncoding.includes("deflate")) return "deflate";
    return null;
};

const compressBuffer = (buf, encoding) => {
    switch (encoding) {
        case "br":      return zlib.brotliCompressSync(buf);
        case "gzip":    return zlib.gzipSync(buf);
        case "deflate": return zlib.deflateSync(buf);
        default:        return buf;
    }
};

const compression = (options = {}) => {
    const threshold = options.threshold ?? 1024;

    return (req, res, next) => {
        const encoding = pickEncoding(req.headers["accept-encoding"]);

        // Nothing to do when client doesn't support compression
        if (!encoding) return next();

        const originalSend = res.send.bind(res);

        res.send = (body) => {
            const contentType = res.getHeader("Content-Type") || "";

            // Only compress compressible content types
            if (!COMPRESSIBLE.test(contentType)) {
                return originalSend(body);
            }

            const buf = Buffer.isBuffer(body) ? body : Buffer.from(body ?? "");

            // Skip tiny payloads – compression overhead isn't worth it
            if (buf.length < threshold) {
                return originalSend(body);
            }

            try {
                const compressed = compressBuffer(buf, encoding);
                res.setHeader("Content-Encoding", encoding);
                res.setHeader("Content-Length", compressed.length);
                res.removeHeader("Transfer-Encoding"); // avoid chunked + content-length conflict
                return originalSend(compressed);
            } catch {
                // Fall back to uncompressed on any error
                return originalSend(body);
            }
        };

        next();
    };
};

export default compression;
