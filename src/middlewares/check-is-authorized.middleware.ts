import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { InvalidAccessToken } from "src/auth/exceptions";

function checkIsAuthorizedMiddleware (request: Request, response: Response, next: NextFunction) {
    try {
        const authData = request.headers.authorization.split(" ");

        const tokenType = authData[0];
        const token = authData[1];

        if (tokenType !== "Bearer") {
            throw new InvalidAccessToken();
        }

        const tokenValidationResult = verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

        
    } catch (error) {
        console.log(error);

        throw new InvalidAccessToken();
    }
    const headerData = request.headers.authorization?.split(" ");


}

export {
    checkIsAuthorizedMiddleware
}