import { HttpBodyResponse } from "src/interfaces";
import { HttpBodyResponseMetaStatus } from "src/interfaces/http-response";

class HttpException extends Error {
    public message: string;
    public statusCode: number;

    constructor(message: string = "Internal Server Error", statusCode: number = 500) {
        super(message);

        this.message = message;
        this.statusCode = statusCode;
    }
}

export {
    HttpException
}