class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;
        if (stack) {
            // If a stack trace is already provided when creating the ApiError instance, it uses that stack trace.
            this.stack = stack;
        } else {
            // here automatically it captures the current stack trace
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
