import { Router, Request, Response, NextFunction } from "express";

import { Controller } from "src/interfaces";
import { UserService } from "./user.service";
import { CreateUserDto, UpdateUserDto } from "./dto";
import { HttpBodyResponse, HttpBodyResponseMetaStatus } from "src/interfaces";
import { validationMiddleware } from "src/middlewares";

class UserController implements Controller {
    public router = Router();
    public path = "/users";

    constructor(private userService: UserService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, validationMiddleware(CreateUserDto), this.createUser);
        this.router.get(`${this.path}/:id`, this.getUserById);
        this.router.get(`${this.path}`, this.getAllUsers);
        this.router.patch(`${this.path}/:id`, validationMiddleware(UpdateUserDto), this.updateUser);
        this.router.delete(`${this.path}/:id`, this.deleteUser);
    }

    private createUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const createUserDto: CreateUserDto = request.body;

            const createdUser = await this.userService.createUser(createUserDto);

            const httpBodyResponse: HttpBodyResponse = {
                data: [
                    createdUser
                ],
                details: {
                    statusCode: 201,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "User created",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(201)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private getUserById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            const receivedUser = await this.userService.getUserById(Number(id));

            const httpBodyResponse: HttpBodyResponse = {
                data: [
                    receivedUser
                ],
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "User found",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private getAllUsers = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { page, size } = request.query;

            const receivedUsers = await this.userService.getAllUsers(Number(page), Number(size));

            const httpBodyResponse: HttpBodyResponse = {
                data: receivedUsers,
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "Users found",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private updateUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const updateUserDto: UpdateUserDto = request.body;

            const updatedUser = await this.userService.updateUser(Number(id), updateUserDto);

            const httpBodyResponse: HttpBodyResponse = {
                data: [
                    updatedUser
                ],
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "User updated",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private deleteUser = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            const deletedUser = await this.userService.deleteUser(Number(id));

            const httpBodyResponse: HttpBodyResponse = {
                data: [
                    deletedUser
                ],
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "User deleted",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }
}

export {
    UserController
}