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

    public async getCategory(id: number): Promise<Category> {
        const queryResult = await this.postgresService.query(
            `
                SELECT id, name
                FROM categories
                WHERE id = $1;
            `,
            [
                id
            ]
        );

        return CategoryMapper.toDomain(queryResult.rows[0]);
    }

    public async deleteCategory(id: number): Promise<Category> {
        const queryResult = await this.postgresService.query(
            `
                DELETE FROM categories
                WHERE id = $1
                RETURNING id, name;
            `,
            [
                id
            ]
        );

        return CategoryMapper.toDomain(queryResult.rows[0]);
    }

    public async getAllCategories(page: number = 1, size: number = 10): Promise<Category[]> {
        const queryResult = await this.postgresService.query(
            `
                SELECT id, name
                FROM categories
                LIMIT $1
                OFFSET $2;
            `,
            [
                size,
                (page - 1) * size
            ]
        );

        return queryResult.rows.map((row) => CategoryMapper.toDomain(row));
    }
}

export {
    CategoryRepository
}