import { Controller, HttpBodyResponse, HttpBodyResponseMetaStatus } from "src/interfaces";

import { Router, Request, Response, NextFunction } from "express";
import { LoginDto, RefreshDto } from "./dto";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";

class AuthController implements Controller {
    public router = Router();
    public path = "/auth";

    constructor(private authService: AuthService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/login`, this.login);
        this.router.post(`${this.path}/register`, this.register);
        this.router.post(`${this.path}/refresh`, this.refresh);
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

    private register = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const device = request.headers["user-agent"];
            const registerDto: RegisterDto = request.body;

            const authTokens = await this.authService.register(registerDto, device);

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
                    message: "Registered",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response.status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private refresh = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const device = request.headers["user-agent"];
            const refreshDto: RefreshDto = request.body;

            const authTokens = await this.authService.getNewTokensByRefreshToken(refreshDto.refresh, device);

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
                    message: "Refreshed",
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