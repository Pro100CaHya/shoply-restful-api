import request from "supertest";
import { config } from "dotenv";

import { Server } from "src/server";
import { CategoryController, CategoryService, CategoryRepository} from "src/category";
import { PostgresService } from "src/postgres";

config();

describe("Integration Server Test", () => {
    let server: Server;
    let postgresService: PostgresService;

    beforeAll(() => {
        const {
            POSTGRES_USER,
            POSTGRES_DB,
            POSTGRES_PASSWORD,
            POSTGRES_PORT,
            POSTGRES_HOST,
            SERVER_PORT
        } = process.env;
        

        postgresService = new PostgresService(
            POSTGRES_USER,
            POSTGRES_HOST,
            POSTGRES_DB,
            POSTGRES_PASSWORD,
            parseInt(POSTGRES_PORT)
        );
        
        const categoryRepository = new CategoryRepository(postgresService);
        const categoryService = new CategoryService(categoryRepository);
        const categoryController = new CategoryController(categoryService);

        server = new Server(
            parseInt(SERVER_PORT),
            [
                categoryController
            ]
        );
        server.startServer();
    });

    afterAll(async () => {
        await postgresService.query(
            `
                DELETE FROM categories;
            `
        );
        server.stopServer();
    });

    it("should create a category", async () => {
        const response = await request("http://localhost:3000")
            .post("/api/categories")
            .send({
                name: "Mobile phones"
            });

        expect(response.status).toBe(201);
    });
});