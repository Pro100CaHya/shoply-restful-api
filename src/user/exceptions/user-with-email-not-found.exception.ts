import { HttpException } from "src/exceptions";

class UserWithEmailNotFoundException extends HttpException {
    constructor(email: string) {
        super(`User with email ${email} not found`, 404);
    }
}

export {
    UserWithEmailNotFoundException
}