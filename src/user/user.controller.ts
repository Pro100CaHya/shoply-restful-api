import { UserService } from "./user.service";

class UserController {
    constructor(private userService: UserService) {}
}

export {
    UserController
}