import ApiError from "../utils/ApiError.js";

const validators = {
    string: (value) => typeof value === "string",
    number: (value) => typeof value === "number" && !Number.isNaN(value),
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
};

const validateRequest = (schema, source = "body") => {
    return (req, res, next) => {
        const payload = req[source] || {};

        for (const [field, rules] of Object.entries(schema)) {
            const value = payload[field];

            if (rules.required && (value === undefined || value === null || value === "")) {
                throw new ApiError(400, `${field} is required`);
            }

            if (value === undefined || value === null || value === "") continue;

            if (rules.type && !validators[rules.type](value)) {
                throw new ApiError(400, `${field} must be a valid ${rules.type}`);
            }

            if (rules.minLength && value.length < rules.minLength) {
                throw new ApiError(400, `${field} must be at least ${rules.minLength} characters`);
            }

            if (rules.maxLength && value.length > rules.maxLength) {
                throw new ApiError(400, `${field} must be at most ${rules.maxLength} characters`);
            }

            if (rules.min !== undefined && value < rules.min) {
                throw new ApiError(400, `${field} must be at least ${rules.min}`);
            }

            if (rules.max !== undefined && value > rules.max) {
                throw new ApiError(400, `${field} must be at most ${rules.max}`);
            }
        }

        next();
    };
};

export default validateRequest;
