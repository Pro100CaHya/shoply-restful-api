import { HttpException } from "src/exceptions";

class InvalidRefreshToken extends HttpException {
    constructor() {
        super("Invalid Refresh Token", 401);
    }
}

export {
    InvalidRefreshToken
}