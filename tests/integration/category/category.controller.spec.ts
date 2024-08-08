import { config } from "dotenv";
import request from "supertest";

import { CategoryController, CategoryRepository, CategoryService, CreateCategoryDto } from "src/category";
import { PostgresService } from "src/postgres";
import { Server } from "src/server";
import { HttpBodyResponse } from "src/interfaces";

config();

const postgresService = new PostgresService(
    process.env.POSTGRES_USER,
    process.env.POSTGRES_HOST,
    process.env.POSTGRES_DB,
    process.env.POSTGRES_PASSWORD,
    parseInt(process.env.POSTGRES_PORT)
);

describe("Integration Test Category Controller", () => {
    let server: Server;
    let categoryController: CategoryController;
    let categoryService: CategoryService;

    let categoryRepository: CategoryRepository;

    beforeAll(async () => {
        categoryRepository = new CategoryRepository(postgresService);
        categoryService = new CategoryService(categoryRepository);
        categoryController = new CategoryController(categoryService);
        server = new Server(3001, [
            categoryController
        ]);

        await postgresService.query(`DELETE FROM categories`);
        await postgresService.query(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);
    });

    afterAll(async () => {
        await postgresService.query(`
            DELETE FROM categories;
            ALTER SEQUENCE categories_id_seq RESTART WITH 1;
        `);
    });

    it("Should create category 'Mobile phones' and return created category with status 201", async () => {
        const app = server.getAppInstance();

        const createCategoryDto: CreateCategoryDto = {
            name: "Mobile phones"
        };

        const createCategoryResponse = await request(app)
            .post("/api/categories")
            .send(createCategoryDto);

        const createCategoryBodyResponse: HttpBodyResponse = createCategoryResponse.body;

        expect(createCategoryBodyResponse.data).toEqual(
            [
                {
                    id: 1,
                    name: "Mobile phones"
                }
            ]
        );
        expect(createCategoryResponse.status).toBe(201);
    });
});