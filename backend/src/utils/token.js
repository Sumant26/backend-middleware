import crypto from "crypto";
import ApiError from "./ApiError.js";

const base64UrlEncode = (value) => {
    return Buffer.from(JSON.stringify(value))
        .toString("base64url");
};

const base64UrlDecode = (value) => {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
};

const getTokenSecret = () => {
    return process.env.JWT_SECRET || "development-secret-change-me";
};

const signToken = (payload, options = {}) => {
    const expiresInSeconds = options.expiresInSeconds || 24 * 60 * 60;
    const header = { alg: "HS256", typ: "JWT" };
    const body = {
        ...payload,
        exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    };

    const encodedHeader = base64UrlEncode(header);
    const encodedBody = base64UrlEncode(body);
    const data = `${encodedHeader}.${encodedBody}`;
    const signature = crypto
        .createHmac("sha256", getTokenSecret())
        .update(data)
        .digest("base64url");

    return `${data}.${signature}`;
};

const verifyToken = (token) => {
    const [encodedHeader, encodedBody, signature] = token.split(".");

    if (!encodedHeader || !encodedBody || !signature) {
        throw new ApiError(401, "Invalid authentication token");
    }

    const data = `${encodedHeader}.${encodedBody}`;
    const expectedSignature = crypto
        .createHmac("sha256", getTokenSecret())
        .update(data)
        .digest("base64url");

    if (signature !== expectedSignature) {
        throw new ApiError(401, "Invalid authentication token");
    }

    const payload = base64UrlDecode(encodedBody);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
        throw new ApiError(401, "Authentication token expired");
    }

    return payload;
};

export {
    signToken,
    verifyToken
};
