import { HttpException } from "src/exceptions";

class InvalidRefreshToken extends HttpException {
    constructor() {
        super("Invalid Access Token", 401);
    }
}

export {
    InvalidRefreshToken
}