import { config } from "dotenv";
import request from "supertest";
import { CategoryController, CategoryRepository, CategoryService } from "src/category";
import { GoodController, GoodRepository, GoodService } from "src/good";
import { Server } from "src/server";
import { PostgresService } from "src/postgres";
import { CreateGoodDto, UpdateGoodDto } from "src/good/dto";
import { HttpBodyResponse } from "src/interfaces";
import { Good } from "src/good/good.interface";

config();

const postgresService = new PostgresService(
    process.env.POSTGRES_USER,
    process.env.POSTGRES_HOST,
    process.env.POSTGRES_DB,
    process.env.POSTGRES_PASSWORD,
    parseInt(process.env.POSTGRES_PORT)
);

describe("Integration Test Good Controller", () => {
    let categoryRepository: CategoryRepository;
    let categoryService: CategoryService;
    let categoryController: CategoryController;

    let goodRepository: GoodRepository;
    let goodService: GoodService;
    let goodController: GoodController;

    let server: Server;

    const createTest = async (dto: CreateGoodDto, expectedGood: Good) => {
        const createGoodResponse = await request(server.getAppInstance())
            .post(`/api/goods`)
            .send(
                dto
            );

        const createGoodResponseBody: HttpBodyResponse = createGoodResponse.body;

        expect(createGoodResponse.status).toBe(201);
        expect(createGoodResponseBody.data).toEqual([
            expectedGood
        ]);
    }

    const getGoodsTest = async (page: number, size: number, expectedGoods: Good[]) => {
        const getGoodsResponse = await request(server.getAppInstance())
            .get(`/api/goods`)
            .query({
                page,
                size
            })
            .send();

        const getGoodsResponseBody: HttpBodyResponse = getGoodsResponse.body;

        expect(getGoodsResponse.status).toBe(200);
        expect(getGoodsResponseBody.data).toEqual(expectedGoods);
    }

    const getGoodByIdTest = async (goodId: number, expectedGood: Good, status = 200) => {
        const getGoodByIdResponse = await request(server.getAppInstance())
            .get(`/api/goods/${goodId}`)
            .send();

        const getGoodByIdResponseBody: HttpBodyResponse = getGoodByIdResponse.body;

        expect(getGoodByIdResponse.status).toBe(status);

        if (expectedGood === null) {
            expect(getGoodByIdResponseBody.data).toEqual(null);
        } else {
            expect(getGoodByIdResponseBody.data).toEqual([expectedGood]);
        }
    }

    const updateGoodTest = async (goodId: number, updateGoodDto: UpdateGoodDto, expectedGood: Good, status = 200) => {
        const updateGoodResponse = await request(server.getAppInstance())
            .patch(`/api/goods/${goodId}`)
            .send(updateGoodDto);

        const updateGoodResponseBody: HttpBodyResponse = updateGoodResponse.body;

        expect(updateGoodResponse.status).toBe(status);

        if (expectedGood === null) {
            expect(updateGoodResponseBody.data).toEqual(null);
        } else {
            expect(updateGoodResponseBody.data).toEqual([expectedGood]);
        }
    }

    const deleteGoodTest = async (goodId: number, expectedGood: Good, status = 200) => {
        const deleteGoodResponse = await request(server.getAppInstance())
            .delete(`/api/goods/${goodId}`)
            .send();

        const deleteGoodResponseBody: HttpBodyResponse = deleteGoodResponse.body;

        expect(deleteGoodResponse.status).toBe(status);

        if (expectedGood === null) {
            expect(deleteGoodResponseBody.data).toEqual(null);
        } else {
            expect(deleteGoodResponseBody.data).toEqual([expectedGood]);

            const findDeletedGood = await postgresService.query(
                `
                    SELECT id
                    FROM goods
                    WHERE id = $1
                `,
                [
                    goodId
                ]
            );
    
            expect(findDeletedGood.rowCount).toBe(0);
        }
    }

    beforeAll(async () => {
        categoryRepository = new CategoryRepository(postgresService);
        categoryService = new CategoryService(categoryRepository);
        categoryController = new CategoryController(categoryService);

        goodRepository = new GoodRepository(postgresService);
        goodService = new GoodService(goodRepository, categoryService);
        goodController = new GoodController(goodService);

        server = new Server(3002, [
            goodController,
            categoryController
        ]);

        server.startServer();

        // Clear tables with categories and goods
        // Create three categories: 'Mobile phones', 'Tablets' and 'Smartwatches'
        await postgresService.query(
            `
                BEGIN;
                    DELETE FROM goods;
                    DELETE FROM categories;

                    ALTER SEQUENCE categories_id_seq RESTART WITH 1;
                    ALTER SEQUENCE goods_id_seq RESTART WITH 1;

                    INSERT INTO categories (name, updated_at)
                    VALUES
                        ('Mobile phones', CURRENT_TIMESTAMP),
                        ('Tablets', CURRENT_TIMESTAMP),
                        ('Smartwatches', CURRENT_TIMESTAMP);
                COMMIT;
            `
        );
    });

    afterAll(async () => {
        await postgresService.query(
            `
                BEGIN;
                    DELETE FROM goods;
                    DELETE FROM categories;

                    ALTER SEQUENCE categories_id_seq RESTART WITH 1;
                    ALTER SEQUENCE goods_id_seq RESTART WITH 1;

                COMMIT;
            `
        );
    })

    it(`Should create good 'iPhone 13', 'Apple Watch Ultra 2', 'Apple Watch Series 7'`, async () => {
        const createGoodDto: CreateGoodDto = {
            name: "iPhone 13",
            price: 899,
            categoryId: 1
        };

        const expectedCreatedGoodResult =
        {
            id: 1,
            name: "iPhone 13",
            price: 899,
            category: {
                id: 1,
                name: "Mobile phones"
            }
        }

        await createTest(createGoodDto, expectedCreatedGoodResult);
    });

    it(`Should create good 'iPhone 13 Pro'`, async () => {
        const createGoodDto: CreateGoodDto = {
            name: "iPhone 13 Pro",
            price: 999,
            categoryId: 1
        };

        const expectedCreatedGoodResult =
        {
            id: 2,
            name: "iPhone 13 Pro",
            price: 999,
            category: {
                id: 1,
                name: "Mobile phones"
            }
        }

        await createTest(createGoodDto, expectedCreatedGoodResult);
    });

    it(`Should create good 'iPhone 13 Pro Max'`, async () => {
        const createGoodDto: CreateGoodDto = {
            name: "iPhone 13 Pro Max",
            price: 1099,
            categoryId: 1
        };

        const expectedCreatedGoodResult =
        {
            id: 3,
            name: "iPhone 13 Pro Max",
            price: 1099,
            category: {
                id: 1,
                name: "Mobile phones"
            }
        }

        await createTest(createGoodDto, expectedCreatedGoodResult);
    });

    it(`Should create good 'iPad Pro 11.9'`, async () => {
        const createGoodDto: CreateGoodDto = {
            name: "iPad Pro 11.9",
            price: 1199,
            categoryId: 2
        };

        const expectedCreatedGoodResult =
        {
            id: 4,
            name: "iPad Pro 11.9",
            price: 1199,
            category: {
                id: 2,
                name: "Tablets"
            }
        }

        await createTest(createGoodDto, expectedCreatedGoodResult);
    });

    it(`Should create good 'iPad Pro 12.9'`, async () => {
        const createGoodDto: CreateGoodDto = {
            name: "iPad Pro 12.9",
            price: 1299,
            categoryId: 2
        };

        const expectedCreatedGoodResult =
        {
            id: 5,
            name: "iPad Pro 12.9",
            price: 1299,
            category: {
                id: 2,
                name: "Tablets"
            }
        }

        await createTest(createGoodDto, expectedCreatedGoodResult);
    });

    it(`Should create good 'Apple Watch Ultra'`, async () => {
        const createGoodDto: CreateGoodDto = {
            name: "Apple Watch Ultra",
            price: 799,
            categoryId: 3
        };

        const expectedCreatedGoodResult =
        {
            id: 6,
            name: "Apple Watch Ultra",
            price: 799,
            category: {
                id: 3,
                name: "Smartwatches"
            }
        }

        await createTest(createGoodDto, expectedCreatedGoodResult);
    });

    it(`Should create good 'Apple Watch Ultra 2'`, async () => {
        const createGoodDto: CreateGoodDto = {
            name: "Apple Watch Ultra 2",
            price: 899,
            categoryId: 3
        };

        const expectedCreatedGoodResult =
        {
            id: 7,
            name: "Apple Watch Ultra 2",
            price: 899,
            category: {
                id: 3,
                name: "Smartwatches"
            }
        }

        await createTest(createGoodDto, expectedCreatedGoodResult);
    });

    it(`Should create good 'Apple Watch Series 7'`, async () => {
        const createGoodDto: CreateGoodDto = {
            name: "Apple Watch Series 7",
            price: 649,
            categoryId: 3
        };

        const expectedCreatedGoodResult =
        {
            id: 8,
            name: "Apple Watch Series 7",
            price: 649,
            category: {
                id: 3,
                name: "Smartwatches"
            }
        }

        await createTest(createGoodDto, expectedCreatedGoodResult);
    });

    it(`Get first four goods`, async () => {
        const page = 1;
        const size = 4;

        const expectedGetGoodsResult = [
            {
                id: 1,
                name: "iPhone 13",
                price: 899,
                category: {
                    id: 1,
                    name: "Mobile phones"
                }
            },
            {
                id: 2,
                name: "iPhone 13 Pro",
                price: 999,
                category: {
                    id: 1,
                    name: "Mobile phones"
                }
            },
            {
                id: 3,
                name: "iPhone 13 Pro Max",
                price: 1099,
                category: {
                    id: 1,
                    name: "Mobile phones"
                }
            },
            {
                id: 4,
                name: "iPad Pro 11.9",
                price: 1199,
                category: {
                    id: 2,
                    name: "Tablets"
                }
            }
        ]

        await getGoodsTest(page, size, expectedGetGoodsResult);
    });

    it(`Get good 'Apple Watch Ultra 2'`, async () => {
        const goodId = 7;
        const expectedGetGoodByIdResult =
        {
            id: 7,
            name: "Apple Watch Ultra 2",
            price: 899,
            category: {
                id: 3,
                name: "Smartwatches"
            }
        };

        await getGoodByIdTest(goodId, expectedGetGoodByIdResult);
    });

    it(`Get unexisted good and get Not Found`, async () => {
        const goodId = 9;

        await getGoodByIdTest(goodId, null, 404);
    });

    it(`Should update good 'Apple Watch Ultra 2' to 'Apple Watch Ultra 3'`, async () => {
        const goodId = 7;
        const updateGoodDto: UpdateGoodDto = {
            name: "Apple Watch Ultra 3",
            price: 2000
        };

        const expectedUpdateGoodResult =
        {
            id: 7,
            name: "Apple Watch Ultra 3",
            price: 2000,
            category: {
                id: 3,
                name: "Smartwatches"
            }
        };

        await updateGoodTest(goodId, updateGoodDto,  expectedUpdateGoodResult);
    });

    it(`Should update unexisted good`, async () => {
        const goodId = 10;
        const updateGoodDto: UpdateGoodDto = {
            name: "Apple Watch Ultra 3",
            price: 2000
        };

        await updateGoodTest(goodId, updateGoodDto, null, 404);
    });

    it(`Should delete good 'Apple Watch Ultra 2' to 'Apple Watch Ultra 3'`, async () => {
        const goodId = 7;

        const expectedDeleteGoodResult =
        {
            id: 7,
            name: "Apple Watch Ultra 3",
            price: 2000,
            category: {
                id: 3,
                name: "Smartwatches"
            }
        };

        await deleteGoodTest(goodId,  expectedDeleteGoodResult);
    });

    it(`Should delete unexisted good`, async () => {
        const goodId = 17;

        const expectedDeleteGoodResult: null = null;

        await deleteGoodTest(goodId,  expectedDeleteGoodResult, 404);
    });
});