import { config } from "dotenv";
import request from "supertest";

import { CategoryController, CategoryRepository, CategoryService, CreateCategoryDto } from "src/category";
import { Server } from "src/server";
import { PostgresService } from "src/postgres";
import { HttpBodyResponse } from "src/interfaces";
import { UpdateCategoryDto } from "src/category/dto";
import { QueryResult } from "pg";

config();

const postgresService = new PostgresService(
    process.env.POSTGRES_USER,
    process.env.POSTGRES_HOST,
    process.env.POSTGRES_DB,
    process.env.POSTGRES_PASSWORD,
    parseInt(process.env.POSTGRES_PORT)
);

describe("Integration Test Category Controller", () => {
    let categoryRepository: CategoryRepository;
    let categoryService: CategoryService;
    let categoryController: CategoryController;
    let server: Server;

    const clearCategoriesTable = async () => {
        await postgresService.query(
            `
                BEGIN;
                    DELETE FROM categories;
                    ALTER SEQUENCE categories_id_seq RESTART WITH 1;
                COMMIT;

            `
        );
    }

    beforeAll(async () => {
        categoryRepository = new CategoryRepository(postgresService);
        categoryService = new CategoryService(categoryRepository);
        categoryController = new CategoryController(categoryService);
        server = new Server(3001, [
            categoryController
        ]);

        await clearCategoriesTable();
    });

    afterAll(async () => {
        categoryRepository = new CategoryRepository(postgresService);
        categoryService = new CategoryService(categoryRepository);
        categoryController = new CategoryController(categoryService);
        server = new Server(3001, [
            categoryController
        ]);
        server.startServer();

        await clearCategoriesTable();
    });

    it("Should create category 'Mobile phones', return created category and status '201'", async () => {
        const createCategoryDto = {
            name: "Mobile phones"
        };

        const createCategoryResponse = await request(server.getAppInstance())
            .post("/api/categories")
            .send(createCategoryDto);

        const createCategoryResponseBody: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryResponse.status).toBe(201);
        expect(createCategoryResponseBody.data).toEqual([
            {
                id: 1,
                name: "Mobile phones"
            }
        ]);
    });

    it("Should create category 'Tablets', return created category and status '201'", async () => {
        const createCategoryDto = {
            name: "Tablets"
        };

        const createCategoryResponse = await request(server.getAppInstance())
            .post("/api/categories")
            .send(createCategoryDto);

        const createCategoryResponseBody: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryResponse.status).toBe(201);
        expect(createCategoryResponseBody.data).toEqual([
            {
                id: 2,
                name: "Tablets"
            }
        ]);
    });

    it("Should create category 'Smartwatches', return created category and status '201'", async () => {
        const createCategoryDto = {
            name: "Smartwatches"
        };

        const createCategoryResponse = await request(server.getAppInstance())
            .post("/api/categories")
            .send(createCategoryDto);

        const createCategoryResponseBody: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryResponse.status).toBe(201);
        expect(createCategoryResponseBody.data).toEqual([
            {
                id: 3,
                name: "Smartwatches"
            }
        ]);
    });

    it("Should create category 'TV', return created category and status '201'", async () => {
        const createCategoryDto = {
            name: "TV"
        };

        const createCategoryResponse = await request(server.getAppInstance())
            .post("/api/categories")
            .send(createCategoryDto);

        const createCategoryResponseBody: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryResponse.status).toBe(201);
        expect(createCategoryResponseBody.data).toEqual([
            {
                id: 4,
                name: "TV"
            }
        ]);
    });

    it("Should create category 'Accessories', return created category and status '201'", async () => {
        const createCategoryDto = {
            name: "Accessories"
        };

        const createCategoryResponse = await request(server.getAppInstance())
            .post("/api/categories")
            .send(createCategoryDto);

        const createCategoryResponseBody: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryResponse.status).toBe(201);
        expect(createCategoryResponseBody.data).toEqual([
            {
                id: 5,
                name: "Accessories"
            }
        ]);
    });

    it("Should create category 'Monitors', return created category and status '201'", async () => {
        const createCategoryDto = {
            name: "Monitors"
        };

        const createCategoryResponse = await request(server.getAppInstance())
            .post("/api/categories")
            .send(createCategoryDto);

        const createCategoryResponseBody: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryResponse.status).toBe(201);
        expect(createCategoryResponseBody.data).toEqual([
            {
                id: 6,
                name: "Monitors"
            }
        ]);
    });

    it("Should not create category 'A' because of 'Validation Error'", async () => {
        const createCategoryDto = {
            name: "A"
        };

        const createCategoryResponse = await request(server.getAppInstance())
            .post("/api/categories")
            .send(createCategoryDto);

        const createCategoryResponseBody: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryResponse.status).toBe(400);
        expect(createCategoryResponseBody.meta.message).toEqual("name must be longer than or equal to 2 characters");
    });

    it("Should get category 'Tablets', return found category and status '200'", async () => {
        const categoryId = 2;

        const getCategoryResponse = await request(server.getAppInstance())
            .get(`/api/categories/${categoryId}`)
            .send();

        const getCategoryResponseBody: HttpBodyResponse = getCategoryResponse.body;

        expect(getCategoryResponse.status).toBe(200);
        expect(getCategoryResponseBody.data).toEqual([
            {
                id: 2,
                name: "Tablets"
            }
        ]);
    });

    it("Should get category 'Monitors', return found category and status '200'", async () => {
        const categoryId = 6;

        const getCategoryResponse = await request(server.getAppInstance())
            .get(`/api/categories/${categoryId}`)
            .send();

        const getCategoryResponseBody: HttpBodyResponse = getCategoryResponse.body;

        expect(getCategoryResponse.status).toBe(200);
        expect(getCategoryResponseBody.data).toEqual([
            {
                id: 6,
                name: "Monitors"
            }
        ]);
    });

    it("Should get first three categories: 'Mobile phones', 'Tablets' and 'Smartwatches'", async () => {
        const page = 1;
        const size = 3;

        const createCategoryResponse = await request(server.getAppInstance())
            .get(`/api/categories`)
            .query({
                page,
                size
            })
            .send();

        const createCategoryResponseBody: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryResponse.status).toBe(200);
        expect(createCategoryResponseBody.data).toEqual([
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
                name: "Smartwatches"
            }
        ]);
    });

    it("Should get second three categories: 'TV', 'Accessories' and 'Monitors'", async () => {
        const page = 2;
        const size = 3;

        const getCategoriesResponse = await request(server.getAppInstance())
            .get(`/api/categories`)
            .query({
                page,
                size
            })
            .send();

        const getCategoriesResponseBody: HttpBodyResponse = getCategoriesResponse.body;

        expect(getCategoriesResponse.status).toBe(200);
        expect(getCategoriesResponseBody.data).toEqual([
            {
                id: 4,
                name: "TV"
            },
            {
                id: 5,
                name: "Accessories"
            },
            {
                id: 6,
                name: "Monitors"
            }
        ]);
    });

    it("Should not found the unexisted category", async () => {
        const categoryId = 20;

        const updateCategoryResponse = await request(server.getAppInstance())
            .get(`/api/categories/${categoryId}`)
            .send();

        const updateCategoryResponseBody: HttpBodyResponse = updateCategoryResponse.body;

        expect(updateCategoryResponse.status).toBe(404);
        expect(updateCategoryResponseBody.meta.message).toEqual(`Category with id ${categoryId} not found`);
    });

    it("Should update the second category 'Tablets' and rename it to 'Laptops'", async () => {
        const categoryId = 2;
        const updateCategoryDto = {
            name: "Laptops"
        }

        const updateCategoryResponse = await request(server.getAppInstance())
            .patch(`/api/categories/${categoryId}`)
            .send(updateCategoryDto);

        const updateCategoryResponseBody: HttpBodyResponse = updateCategoryResponse.body;

        expect(updateCategoryResponse.status).toBe(200);
        expect(updateCategoryResponseBody.data).toEqual([
            {
                id: 2,
                name: "Laptops"
            }
        ]);
    });

    it("Should get the updated category 'Laptops'", async () => {
        const categoryId = 2;

        const getCategoryResponse = await request(server.getAppInstance())
            .get(`/api/categories/${categoryId}`)
            .send();

        const getCategoryResponseBody: HttpBodyResponse = getCategoryResponse.body;

        expect(getCategoryResponse.status).toBe(200);
        expect(getCategoryResponseBody.data).toEqual([
            {
                id: 2,
                name: "Laptops"
            }
        ]);
    });

    it("Should update the the unexisted category and get 'Not Found'", async () => {
        const categoryId = 20;
        const updateCategoryDto = {
            name: "Laptops"
        }

        const updateCategoryResponse = await request(server.getAppInstance())
            .patch(`/api/categories/${categoryId}`)
            .send(updateCategoryDto);

        const updateCategoryResponseBody: HttpBodyResponse = updateCategoryResponse.body;

        expect(updateCategoryResponse.status).toBe(404);
        expect(updateCategoryResponseBody.meta.message).toEqual(`Category with id ${categoryId} not found`);
    });

    it("Should delete category 'Laptops'", async () => {
        const categoryId = 2;

        const getCategoryResponse = await request(server.getAppInstance())
            .delete(`/api/categories/${categoryId}`)
            .send();

        const getCategoryResponseBody: HttpBodyResponse = getCategoryResponse.body;

        expect(getCategoryResponse.status).toBe(200);
        expect(getCategoryResponseBody.data).toEqual([
            {
                id: 2,
                name: "Laptops"
            }
        ]);

        const selectCategoryLaptopsQueryResult: QueryResult = await postgresService.query(
            `
                SELECT id, name
                FROM categories
                WHERE id = 2;
            `
        );

        expect(selectCategoryLaptopsQueryResult.rowCount).toBe(0);
    });

    it("Should delete unexisted category and get 'Not Found'", async () => {
        const categoryId = 20;

        const getCategoryResponse = await request(server.getAppInstance())
            .delete(`/api/categories/${categoryId}`)
            .send();

        const getCategoryResponseBody: HttpBodyResponse = getCategoryResponse.body;

        expect(getCategoryResponse.status).toBe(404);
        expect(getCategoryResponseBody.meta.message).toEqual(`Category with id ${categoryId} not found`);

        const selectCategoryLaptopsQueryResult: QueryResult = await postgresService.query(
            `
                SELECT id, name
                FROM categories
                WHERE id = 2;
            `
        );
    });
});