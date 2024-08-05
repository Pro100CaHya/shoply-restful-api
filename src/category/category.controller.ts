import { NextFunction, Request, Response, Router } from "express";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto";

class CategoryController {
    public router = Router();
    public path = "/categories";

    constructor(private categoryService: CategoryService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getCategory);
        this.router.post(`${this.path}`, this.createCategory);
    }

    private createCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const createCategoryDto: CreateCategoryDto = request.body;

            const createdCategory = await this.categoryService.createCategory(createCategoryDto);

            response.status(200)
                .json({
                    meta: {
                        status: "success"
                    },
                    data: {
                        ...createdCategory
                    }
                });
        } catch (error) {
            console.log(error);

            response.status(500)
                .json(error);
        }
    }

    private getCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            const category = await this.categoryService.getCategory(parseInt(id));

            response.status(200)
                .json({
                    meta: {
                        status: "success"
                    },
                    data: {
                        ...category
                    }
                });
        } catch (error) {
            console.log(error);

            response.status(500)
                .json(error);
        }
    }
}

export {
    CategoryController
}