import request from "supertest";
import { config } from "dotenv";

import { Server } from "src/server";
import { CategoryController, CategoryService, CategoryRepository} from "src/category";
import { PostgresService } from "src/postgres";

config();

describe("Integration Server Test", () => {
    let server: Server;
    let postgresService: PostgresService;

    beforeAll(async () => {
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

        await postgresService.query(
            `
                DELETE FROM categories;
            `
        );
        await postgresService.query(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);

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
        await postgresService.query(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);
    });

    it("should create a category", async () => {
        const response = await request("http://localhost:3000")
            .post("/api/categories")
            .send({
                name: "Mobile phones"
            });

        expect(response.status).toBe(201);
    });

    it("should get a category", async () => {
        const response = await request("http://localhost:3000")
            .get("/api/categories/1")
            .send();

        expect(response.status).toBe(200);
        expect(response.body.data[0]).toEqual(
            {
                id: 1,
                name: "Mobile phones"
            });
    });

    it("should not found category", async () => {
        const response = await request("http://localhost:3000")
            .get("/api/categories/2")
            .send();

        expect(response.status).toBe(404);
        expect(response.body.data).toEqual(null);
    });

    it("should update a category", async () => {
        const response = await request("http://localhost:3000")
            .patch("/api/categories/1")
            .send({
                name: "Tablets"
            });

        expect(response.status).toBe(200);
        expect(response.body.data[0]).toEqual(
            {
                id: 1,
                name: "Tablets"
            });
    });
});