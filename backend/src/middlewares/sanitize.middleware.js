const sanitizeObject = (value) => {
    if (!value || typeof value !== "object") return value;

    if (Array.isArray(value)) {
        return value.map(sanitizeObject);
    }

    for (const key of Object.keys(value)) {
        if (key.startsWith("$") || key.includes(".")) {
            delete value[key];
            continue;
        }

        value[key] = sanitizeObject(value[key]);
    }

    return value;
};

const sanitizeRequest = (req, res, next) => {
    sanitizeObject(req.body);
    sanitizeObject(req.params);
    sanitizeObject(req.query);
    next();
};

export default sanitizeRequest;
