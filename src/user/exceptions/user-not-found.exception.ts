import { HttpException } from "src/exceptions";

class UserNotFoundException extends HttpException {
    constructor(id: number) {
        super(`User with id ${id} not found`, 404);
    }
}

export {
    UserNotFoundException
}