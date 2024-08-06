import { NextFunction, Request, Response, Router } from "express";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto";
import { HttpBodyResponse, HttpBodyResponseMetaStatus } from "src/interfaces";

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

            const httpBodyResponse: HttpBodyResponse = {
                meta: {
                    message: null,
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
                data: null,
                details: {
                    statusCode: 201,
                    method: request.method,
                    time: new Date().toISOString()
                }
            }

            response.status(201)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
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
            next(error);
        }
    }
}

export {
    CategoryController
}