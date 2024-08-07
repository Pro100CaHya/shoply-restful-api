import { CategoryService, CategoryNotFoundException } from "src/category";
import { CreateGoodDto } from "./dto";
import { GoodRepository } from "./good.repository";
import { GoodNotFoundException } from "./exceptions";

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

    public async getGoodById(id: number) {
        const good = await this.goodRepository.getGoodById(id);

        if (!good) {
            throw new GoodNotFoundException(id);
        }

        return good;
    }

    public async getAllGoods(page: number, size: number) {
        return await this.goodRepository.getAllGoods(page, size);
    }
}

export {
    GoodService
}