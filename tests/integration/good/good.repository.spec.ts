import { config } from "dotenv";

import { GoodRepository } from "src/good";
import { CategoryRepository } from "src/category";
import { PostgresService } from "src/postgres";
import { CreateGoodDto } from "src/good/dto/create-good.dto";

config();

const postgresService = new PostgresService(
    process.env.POSTGRES_USER,
    process.env.POSTGRES_HOST,
    process.env.POSTGRES_DB,
    process.env.POSTGRES_PASSWORD,
    parseInt(process.env.POSTGRES_PORT)
);

describe("Integration Test Good Repository", () => {
    let goodRepository: GoodRepository;
    let categoryRepository: CategoryRepository;

    beforeAll(async () => {
        goodRepository = new GoodRepository(postgresService);
        categoryRepository = new CategoryRepository(postgresService);

        await postgresService.query(`DELETE FROM goods`);
        await postgresService.query(`ALTER SEQUENCE goods_id_seq RESTART WITH 1`);

        await postgresService.query(`DELETE FROM categories`);
        await postgresService.query(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);

        await postgresService.query(`
            INSERT INTO categories (name, updated_at)
            VALUES ('Smartphones', CURRENT_TIMESTAMP), ('Laptops', CURRENT_TIMESTAMP);
        `);
    });

    afterAll(async () => {
        await postgresService.query(`DELETE FROM goods`);
        await postgresService.query(`ALTER SEQUENCE goods_id_seq RESTART WITH 1`);

        await postgresService.query(`DELETE FROM categories`);
        await postgresService.query(`ALTER SEQUENCE categories_id_seq RESTART WITH 1`);

        await postgresService.close();
    });

    it("should create a good 'iPhone 13 Pro Max', category 'Smartphones'", async () => {
        const createGoodDto: CreateGoodDto = {
            name: "iPhone 13 Pro Max",
            price: 999,
            categoryId: 1
        }

        const createGoodResult = await goodRepository.createGood(createGoodDto);

        expect(createGoodResult).toEqual({
            id: 1,
            name: "iPhone 13 Pro Max",
            price: 999,
            category: {
                id: 1,
                name: "Smartphones"
            }
        });
    });

    it("should create a good 'Xiaomi Mi Notebook Pro 14', category 'Laptops'", async () => {
        const createGoodDto: CreateGoodDto = {
            name: "Xiaomi Mi Notebook Pro 14",
            price: 1299,
            categoryId: 2
        }

        const createGoodResult = await goodRepository.createGood(createGoodDto);

        expect(createGoodResult).toEqual({
            id: 2,
            name: "Xiaomi Mi Notebook Pro 14",
            price: 1299,
            category: {
                id: 2,
                name: "Laptops"
            }
        });
    });

    it("should create a good 'iPhone 14 Pro Max', category 'Smartphones'", async () => {
        const createGoodDto: CreateGoodDto = {
            name: "iPhone 14 Pro Max",
            price: 1049,
            categoryId: 1
        }

        const createGoodResult = await goodRepository.createGood(createGoodDto);

        expect(createGoodResult).toEqual({
            id: 3,
            name: "iPhone 14 Pro Max",
            price: 1049,
            category: {
                id: 1,
                name: "Smartphones"
            }
        });
    });

    it("should create a good 'Xiaomi Redmibook Pro 16', category 'Laptops'", async () => {
        const createGoodDto: CreateGoodDto = {
            name: "Xiaomi Redmibook Pro 16",
            price: 1499,
            categoryId: 2
        }

        const createGoodResult = await goodRepository.createGood(createGoodDto);

        expect(createGoodResult).toEqual({
            id: 4,
            name: "Xiaomi Redmibook Pro 16",
            price: 1499,
            category: {
                id: 2,
                name: "Laptops"
            }
        });
    });

    it("should get a good 'Xiaomi Mi Notebook Pro 14', category 'Laptops'", async () => {
        const getGoodResult = await goodRepository.getGoodById(2);

        expect(getGoodResult).toEqual({
            id: 2,
            name: "Xiaomi Mi Notebook Pro 14",
            price: 1299,
            category: {
                id: 2,
                name: "Laptops"
            }
        });
    });

    it("should get second two goods", async () => {
        const getGoodsResult = await goodRepository.getAllGoods(2, 2);

        expect(getGoodsResult).toEqual([
            {
                id: 3,
                name: "iPhone 14 Pro Max",
                price: 1049,
                category: {
                    id: 1,
                    name: "Smartphones"
                }
            },
            {
                id: 4,
                name: "Xiaomi Redmibook Pro 16",
                price: 1499,
                category: {
                    id: 2,
                    name: "Laptops"
                }
            }
        ]);
    });
})
