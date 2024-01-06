class ErrorHander extends Error {
    constructor(message, statusCode) {
        super(message); // Specify the name of the class (ErrorHandler) as the first argument
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorHander;
