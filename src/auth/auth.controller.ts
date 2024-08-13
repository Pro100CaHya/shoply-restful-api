import { Controller, HttpBodyResponse, HttpBodyResponseMetaStatus } from "src/interfaces";

import { Router, Request, Response, NextFunction } from "express";
import { LoginDto } from "./dto";
import { AuthService } from "./auth.service";

class AuthController implements Controller {
    public router = Router();
    public path = "/auth";

    constructor(private authService: AuthService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, this.login);
    }

    private login = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const device = request.headers["user-agent"];
            const loginDto: LoginDto = request.body;

            const authTokens = await this.authService.login(loginDto, device);

            const httpBodyResponse: HttpBodyResponse = {
                data: [
                    authTokens
                ],
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "Authorized",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response.status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }
}

export {
    AuthController
}