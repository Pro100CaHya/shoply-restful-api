import { HttpException } from "src/exceptions";

class UserWithEmailAlreadyExists extends HttpException {
    constructor(email: string) {
        super(`User with email ${email} already exists`, 400);
    }
}

export {
    UserWithEmailAlreadyExists
}