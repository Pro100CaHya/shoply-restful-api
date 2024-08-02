import { Category } from "./category.interface";
import { CategoryRepository } from "./category.repository";
import { CreateCategoryDto } from "./dto";

class CategoryService {
    constructor(private categoryRepository: CategoryRepository) { }

    public async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return await this.categoryRepository.createCategory(createCategoryDto);
    }
}

export {
    CategoryService
}