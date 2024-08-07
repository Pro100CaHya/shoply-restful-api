import { Request, Router, Response, NextFunction } from "express";
import { CreateGoodDto } from "./dto/create-good.dto";
import { GoodService } from "./good.service";
import { HttpBodyResponse, HttpBodyResponseMetaStatus } from "src/interfaces";

export class GoodController {
    public path = "/goods";
    public router = Router();

    constructor(private goodService: GoodService) {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}`, this.createGood)
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
}