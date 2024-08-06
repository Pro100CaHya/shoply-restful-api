import { config } from "dotenv";

import { CategoryRepository, CreateCategoryDto } from "src/category";
import { PostgresService } from "src/postgres";

config();

const postgresService = new PostgresService(
    process.env.POSTGRES_USER,
    process.env.POSTGRES_HOST,
    process.env.POSTGRES_DB,
    process.env.POSTGRES_PASSWORD,
    parseInt(process.env.POSTGRES_PORT)
);

describe("Integration Test Category Repository", () => {
    let categoryRepository: CategoryRepository;

    beforeAll(async () => {
        categoryRepository = new CategoryRepository(postgresService);

        await postgresService.query(`DELETE FROM categories`);
        await postgresService.query(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);
    });

    afterAll(async () => {
        await postgresService.query(`DELETE FROM categories`);
        await postgresService.query(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);

        await postgresService.close();
    });

    it("Should create the category 'Mobile phones' in database", async () => {
        const createCategoryDto: CreateCategoryDto = {
            name: "Mobile phones"
        }

        const createCategoryResult = await categoryRepository.createCategory(createCategoryDto);
        const countOfCategories = await postgresService.query(
            `
                SELECT COUNT(id)
                FROM categories
            `
        );

        const selectCreatedCategory = await postgresService.query(
            `
                SELECT id, name
                FROM categories
                WHERE id = $1;
            `,
            [
                1
            ]
        );

        expect(createCategoryResult).toEqual({
            id: 1,
            name: "Mobile phones"
        });
        expect(selectCreatedCategory?.rows[0]).toEqual({
            id: 1,
            name: "Mobile phones"
        });
        expect(parseInt(countOfCategories?.rows[0].count)).toEqual(1);
    });

    it("Should create the category 'Tablets' in database", async () => {
        const createCategoryDto: CreateCategoryDto = {
            name: "Tablets"
        }

        const createCategoryResult = await categoryRepository.createCategory(createCategoryDto);
        const countOfCategories = await postgresService.query(
            `
                SELECT COUNT(id)
                FROM categories
            `
        );
        const selectCreatedCategory = await postgresService.query(
            `
                SELECT id, name
                FROM categories
                WHERE id = $1;
            `,
            [
                2
            ]
        );

        expect(selectCreatedCategory?.rows[0]).toEqual({
            id: 2,
            name: "Tablets"
        });
        expect(createCategoryResult).toEqual({
            id: 2,
            name: "Tablets"
        });
        expect(parseInt(countOfCategories.rows[0].count)).toEqual(2);
    });
});