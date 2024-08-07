import { CategoryService, CategoryNotFoundException } from "src/category";
import { CreateGoodDto } from "./dto/create-good.dto";
import { GoodRepository } from "./good.repository";

class GoodService {
    constructor(
        private goodRepository: GoodRepository,
        private categoryService: CategoryService
    ) {}

    public async createGood(createGoodDto: CreateGoodDto): Promise<any> {
        await this.categoryService.getCategory(createGoodDto.categoryId);

        const createdGood = await this.goodRepository.createGood(createGoodDto);

        return createdGood;
    }
}

export {
    GoodService
}