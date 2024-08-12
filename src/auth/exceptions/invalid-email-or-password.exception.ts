import { HttpException } from "src/exceptions";

class InvalidEmailOrPassword extends HttpException {
    constructor() {
        super("Invalid email or password", 401);
    }
}

export {
    InvalidEmailOrPassword
}