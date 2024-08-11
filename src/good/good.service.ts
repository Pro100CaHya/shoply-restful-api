import { CategoryService, CategoryNotFoundException } from "src/category";
import { CreateGoodDto, UpdateGoodDto } from "./dto";
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

    public async updateGood(id: number, updateGoodDto: UpdateGoodDto) {
        const good = await this.goodRepository.getGoodById(id);

        if (!good) {
            throw new GoodNotFoundException(id);
        }

        if (updateGoodDto.categoryId) {
            await this.categoryService.getCategory(updateGoodDto.categoryId);
        }

        return await this.goodRepository.updateGood(id, updateGoodDto);
    }

    public async deleteGood(id: number) {
        const good = await this.goodRepository.getGoodById(id);

        if (!good) {
            throw new GoodNotFoundException(id);
        }

        return await this.goodRepository.deleteGood(id);
    }
}

export {
    GoodService
}