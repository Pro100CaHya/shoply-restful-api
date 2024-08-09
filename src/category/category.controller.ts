import { NextFunction, Request, Response, Router } from "express";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
import { HttpBodyResponse, HttpBodyResponseMetaStatus } from "src/interfaces";
import { validationMiddleware } from "src/middlewares";

class CategoryController {
    public router = Router();
    public path = "/categories";

    constructor(private categoryService: CategoryService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}/:id`, this.getCategory);
        this.router.get(`${this.path}`, this.getAllCategories);
        this.router.post(`${this.path}`, validationMiddleware(CreateCategoryDto), this.createCategory);
        this.router.patch(`${this.path}/:id`, validationMiddleware(CreateCategoryDto), this.updateCategory);
        this.router.delete(`${this.path}/:id`, this.deleteCategory);
    }

    private createCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const createCategoryDto: CreateCategoryDto = request.body;

            const createdCategory = await this.categoryService.createCategory(createCategoryDto);

            const httpBodyResponse: HttpBodyResponse = {
                data: [
                    createdCategory
                ],
                details: {
                    statusCode: 201,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "Category created",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(201)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private getCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            const category = await this.categoryService.getCategory(parseInt(id));

            response
                .status(200)
                .json({
                    data: [
                        category
                    ],
                    details: {
                        statusCode: 200,
                        method: request.method,
                        time: new Date().toISOString()
                    },
                    meta: {
                        message: "Get the category",
                        status: HttpBodyResponseMetaStatus.SUCCESS,
                    },
                });
        } catch (error) {
            next(error);
        }
    }

    private getAllCategories = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {
                page,
                size
            } = request.query;

            const categories = await this.categoryService.getAllCategories(Number(page), Number(size));

            response
                .status(200)
                .json({
                    data: [
                        ...categories
                    ],
                    details: {
                        statusCode: 200,
                        method: request.method,
                        time: new Date().toISOString()
                    },
                    meta: {
                        message: "Received categories",
                        status: HttpBodyResponseMetaStatus.SUCCESS,
                    },
                });
        } catch (error) {
            next(error);
        }
    }

    private updateCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;
            const updateCategoryDto: UpdateCategoryDto = request.body;

            const category = await this.categoryService.updateCategory(updateCategoryDto, parseInt(id));

            response
                .status(200)
                .json({
                    data: [
                        category
                    ],
                    details: {
                        statusCode: 200,
                        method: request.method,
                        time: new Date().toISOString()
                    },
                    meta: {
                        message: "Category updated",
                        status: HttpBodyResponseMetaStatus.SUCCESS,
                    },
                });
        } catch (error) {
            next(error);
        }
    }

    private deleteCategory = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const { id } = request.params;

            const category = await this.categoryService.deleteCategory(parseInt(id));

            response
                .status(200)
                .json({
                    data: [
                        category
                    ],
                    details: {
                        statusCode: 200,
                        method: request.method,
                        time: new Date().toISOString()
                    },
                    meta: {
                        message: "Category deleted",
                        status: HttpBodyResponseMetaStatus.SUCCESS,
                    },
                });
        } catch (error) {
            next(error);
        }
    }
}

export {
    CategoryController
}