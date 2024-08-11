import { Request, Router, Response, NextFunction } from "express";
import { CreateGoodDto, UpdateGoodDto } from "./dto";
import { GoodService } from "./good.service";
import { HttpBodyResponse, HttpBodyResponseMetaStatus } from "src/interfaces";

export class GoodController {
    public path = "/goods";
    public router = Router();

    constructor(private goodService: GoodService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.createGood);
        this.router.get(`${this.path}/:id`, this.getGoodById);
        this.router.get(`${this.path}`, this.getAllGoods);
        this.router.patch(`${this.path}/:id`, this.updateGood);
        this.router.delete(`${this.path}/:id`, this.deleteGood)
    };

    private createGood = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const createGoodDto: CreateGoodDto = request.body;

            const createdGood = await this.goodService.createGood(createGoodDto);

            const httpBodyResponse: HttpBodyResponse = {
                data: [
                    createdGood
                ],
                details: {
                    statusCode: 201,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "Good created",
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

    private getGoodById = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const goodId = parseInt(request.params.id);

            const good = await this.goodService.getGoodById(goodId);

            const httpBodyResponse: HttpBodyResponse = {
                data: [
                    good
                ],
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "Good received",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private getAllGoods = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {
                page,
                size
            } = request.query;

            const goods = await this.goodService.getAllGoods(Number(page), Number(size));

            const httpBodyResponse: HttpBodyResponse = {
                data: goods,
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "Good received",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private updateGood = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {
                id
            } = request.params;

            const updateGoodDto: UpdateGoodDto = request.body;

            const updatedGood = await this.goodService.updateGood(Number(id), updateGoodDto);

            const httpBodyResponse: HttpBodyResponse = {
                data: [updatedGood],
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "Good updated",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }

    private deleteGood = async (request: Request, response: Response, next: NextFunction) => {
        try {
            const {
                id
            } = request.params;

            const deletedGood = await this.goodService.deleteGood(Number(id));

            const httpBodyResponse: HttpBodyResponse = {
                data: [deletedGood],
                details: {
                    statusCode: 200,
                    method: request.method,
                    time: new Date().toISOString()
                },
                meta: {
                    message: "Good deleted",
                    status: HttpBodyResponseMetaStatus.SUCCESS,
                },
            }

            response
                .status(200)
                .json(httpBodyResponse);
        } catch (error) {
            next(error);
        }
    }
}