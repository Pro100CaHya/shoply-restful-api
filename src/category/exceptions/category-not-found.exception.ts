import { HttpException } from "src/exceptions";

class CategoryNotFoundException extends HttpException {
    constructor(id: number) {
        super(`Category with id ${id} not found`, 404);
    }
}

export {
    CategoryNotFoundException
}