import { HttpException } from "src/exceptions";

class UserWithIdNotFoundException extends HttpException {
    constructor(id: number) {
        super(`User with id ${id} not found`, 404);
    }
}

export {
    UserWithIdNotFoundException
}