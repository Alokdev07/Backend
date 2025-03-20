class ApiError extends Error{
    constructor(
        message = "Something went wrong",
        errors = [],
        statusCode,
        stack = ""
    ) {
        super(message)
        this.message = message,
        this.stack = stack,
        this.statusCode = statusCode,
        this.errors = errors,
        this.data = null

        if (stack) {
            this.stack = stack
        }else { 
            Error.captureStackTrace(this,this.constructor)
        }
    }
}

export {ApiError}