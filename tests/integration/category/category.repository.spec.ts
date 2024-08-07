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

    it("Should create the category 'Laptops' in database", async () => {
        const createCategoryDto: CreateCategoryDto = {
            name: "Laptops"
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
                3
            ]
        );

        expect(selectCreatedCategory?.rows[0]).toEqual({
            id: 3,
            name: "Laptops"
        });
        expect(createCategoryResult).toEqual({
            id: 3,
            name: "Laptops"
        });
        expect(parseInt(countOfCategories.rows[0].count)).toEqual(3);
    });

    it("Should create the category 'Tables' in database", async () => {
        const createCategoryDto: CreateCategoryDto = {
            name: "Tables"
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
                4
            ]
        );

        expect(selectCreatedCategory?.rows[0]).toEqual({
            id: 4,
            name: "Tables"
        });
        expect(createCategoryResult).toEqual({
            id: 4,
            name: "Tables"
        });
        expect(parseInt(countOfCategories.rows[0].count)).toEqual(4);
    });

    it("Should get all the categories", async () => {
        const getAllCategories = await categoryRepository.getAllCategories();

        expect(getAllCategories).toEqual([
            {
                id: 1,
                name: "Mobile phones"
            },
            {
                id: 2,
                name: "Tablets"
            },
            {
                id: 3,
                name: "Laptops"
            },
            {
                id: 4,
                name: "Tables"
            }
        ]);
    });

    it("Should get second two categories", async () => {
        const getAllCategories = await categoryRepository.getAllCategories(2, 2);

        expect(getAllCategories).toEqual([
            {
                id: 3,
                name: "Laptops"
            },
            {
                id: 4,
                name: "Tables"
            }
        ]);
    });

    it("Should delete category 'Laptops'", async () => {
        const deleteCategoryResult = await categoryRepository.deleteCategory(3);

        expect(deleteCategoryResult).toEqual(
            {
                id: 3,
                name: "Laptops"
            }
        );

        const checkCountOfCategories = await postgresService.query(
            `
                SELECT COUNT(id)
                FROM categories
            `
        );

        expect(parseInt(checkCountOfCategories.rows[0].count)).toEqual(3);
    });

    it("Should update category 'Laptops'", async () => {
        const updateCategoryResult = await categoryRepository.updateCategory({ name: "Watches" }, 4);

        expect(updateCategoryResult).toEqual(
            {
                id: 4,
                name: "Watches"
            }
        );

        const checkUpdatedCategory = await postgresService.query(
            `
                SELECT id, name
                FROM categories
                WHERE id = $1;
            `,
            [
                4
            ]
        );

        expect(checkUpdatedCategory.rows[0]).toEqual({
            id: 4,
            name: "Watches"
        });
    });
});