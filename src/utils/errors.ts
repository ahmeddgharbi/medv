export class HttpError extends Error {
    public statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpError.prototype);
    }
}

export const badRequest = (message: string): HttpError => {
    return new HttpError(400, message);
};

export const unauthorized = (message: string): HttpError => {
    return new HttpError(401, message);
};

export const notFound = (message: string): HttpError => {
    return new HttpError(404, message);
};

export const internalError = (message: string): HttpError => {
    return new HttpError(500, message);
};
