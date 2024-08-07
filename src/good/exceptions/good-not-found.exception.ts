import { HttpException } from "src/exceptions";

class GoodNotFoundException extends HttpException {
    constructor(id: number) {
        super(`Good with id ${id} not found`, 404);
    }
}

export {
    GoodNotFoundException
}