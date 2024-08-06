import { PostgresService } from "src/postgres";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
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

    public async getCategory(id: number): Promise<Category | null> {
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

        if (queryResult.rows.length === 0) {
            return null;
        }

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

    public async updateCategory(updateCategoryDto: UpdateCategoryDto, id: number): Promise<Category> {
        const queryResult = await this.postgresService.query(
            `
                UPDATE categories
                SET name = $1
                WHERE id = $2
                RETURNING id, name;
            `,
            [
                updateCategoryDto.name,
                id
            ]
        );

        return CategoryMapper.toDomain(queryResult.rows[0]);
    }
}

export {
    CategoryRepository
}