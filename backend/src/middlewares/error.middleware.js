const notFound = (req, res, next) => {
    const error = new Error(`Route not found: ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

const errorHandler = (error, req, res, next) => {
    let statusCode = error.statusCode || res.statusCode || 500;
    let message = error.message || "Internal server error";

    if (error.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource id";
    }

    if (error.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(error.errors).map((err) => err.message).join(", ");
    }

    if (error.code === 11000) {
        statusCode = 409;
        const duplicateField = Object.keys(error.keyValue || {})[0] || "field";
        message = `${duplicateField} already exists`;
    }

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
};

export {
    notFound,
    errorHandler
};
