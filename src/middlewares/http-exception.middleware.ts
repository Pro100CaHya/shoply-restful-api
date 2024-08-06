import { Request, Response, NextFunction } from "express";

import { HttpException } from "src/exceptions";
import { HttpBodyResponse, HttpBodyResponseMetaStatus } from "src/interfaces";

function httpExceptionMiddleware(error: HttpException, request: Request, response: Response, next: NextFunction) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";

    const httpBodyResponse: HttpBodyResponse = {
        data: null,
        details: {
            statusCode,
            method: request.method,
            time: new Date().toISOString()
        },
        meta: {
            message,
            status: HttpBodyResponseMetaStatus.SUCCESS,
        }
    }

    response.status(statusCode)
        .send(httpBodyResponse);
}

export {
    httpExceptionMiddleware
}