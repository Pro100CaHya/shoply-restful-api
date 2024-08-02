import { Controller } from "src/interfaces";
import { UserService } from "./user.service";
import { Router } from "express";

class UserController implements Controller {
    public router = Router();
    public path = "/users";

    constructor(private userService: UserService) {}
}

export {
    UserController
}