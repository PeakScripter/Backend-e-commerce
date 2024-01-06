import ErrorHander from "../utils/errorhander.mjs";

const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    //wrong mongoose object id error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        err = new ErrorHander(message, 400);
    }
    //mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHander(message, 400);
    }
    //wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `JSON Web Token is invalid. Try again!!!`;
        err = new ErrorHander(message, 400);
    }
    //expired jwt error
    if (err.name === "TokenExpiredError") {
        const message = `JSON Web Token is expired. Try again!!!`;
        err = new ErrorHander(message, 400);
    }
    //validation error
    res.status(err.statusCode).json({
        success: false,
        error: err.message,
    });
};

export default errorMiddleware;
