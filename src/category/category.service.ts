import { Category } from "./category.interface";
import { CategoryRepository } from "./category.repository";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
import { CategoryNotFoundException } from "./exceptions";

class CategoryService {
    constructor(private categoryRepository: CategoryRepository) { }

    public async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        return await this.categoryRepository.createCategory(createCategoryDto);
    }

    public async getCategory(id: number): Promise<Category> {
        const category = await this.categoryRepository.getCategory(id);

        if (!category) {
            throw new CategoryNotFoundException(id);
        }
        
        return await this.categoryRepository.getCategory(id);
    }

    public async getAllCategories(): Promise<Category[]> {        
        return await this.categoryRepository.getAllCategories();
    }

    public async updateCategory(updateCategoryDto: UpdateCategoryDto, id: number): Promise<Category> {
        const category = await this.categoryRepository.getCategory(id);

        if (!category) {
            throw new CategoryNotFoundException(id);
        }

        return await this.categoryRepository.updateCategory(updateCategoryDto, id);
    }

    public async deleteCategory(id: number): Promise<Category> {
        const category = await this.categoryRepository.getCategory(id);

        if (!category) {
            throw new CategoryNotFoundException(id);
        }

        return await this.categoryRepository.deleteCategory(id);
    }
}

export {
    CategoryService
}