import { PostgresService } from "src/postgres";
import { CreateCategoryDto } from "./dto";
import { CategoryMapper } from "./category.mapper";
import { Category } from "./category.interface";

class CategoryRepository {
    constructor(private postgresService: PostgresService) { }

    public async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const {
            name
        } = createCategoryDto;

        const queryResult = await this.postgresService.query(
            `
                INSERT INTO categories (name, updated_at)
                VALUES ($1, CURRENT_TIMESTAMP)
                RETURNING id, name;
            `,
            [
                name
            ]
        );

        return CategoryMapper.toDomain(queryResult.rows[0]);
    }
}

export {
    CategoryRepository
}