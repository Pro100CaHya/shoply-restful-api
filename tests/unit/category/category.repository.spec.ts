import { QueryResult } from "pg";
import { CategoryRepository, CategoryMapper, CreateCategoryDto } from "src/category";
import { PostgresService } from "src/postgres";

jest.mock("src/postgres/postgres.service");

describe("Test Category Repository", () => {
    let postgresService: jest.Mocked<PostgresService>;
    let categoryRepository: CategoryRepository;

    beforeEach(() => {
        postgresService = new PostgresService('user', 'host', 'database', 'password', 5432) as jest.Mocked<PostgresService>;
        categoryRepository = new CategoryRepository(postgresService);
        jest.spyOn(CategoryMapper, "toDomain");
    });

    afterEach(() => {
        jest.clearAllMocks();
    })

    it("Should create category 'Mobile Phones'", async () => {
        const mockedQueryResult: QueryResult = {
            command: "INSERT",
            rowCount: 1,
            oid: null,
            fields: [{
                name: 'id',
                tableID: 16600,
                columnID: 1,
                dataTypeID: 23,
                dataTypeSize: 4,
                dataTypeModifier: -1,
                format: 'text'
            },
            {
                name: 'name',
                tableID: 16600,
                columnID: 2,
                dataTypeID: 25,
                dataTypeSize: -1,
                dataTypeModifier: -1,
                format: 'text'
            }],
            rows: [
                {
                    id: 1,
                    name: "Mobile phones"
                }
            ],
        };
        const mockedCreateCategoryResult = {
            id: 1,
            name: "Mobile phones"
        };
        const createCategoryDto: CreateCategoryDto = {
            name: "Mobile phones"
        };

        postgresService.query.mockResolvedValue(mockedQueryResult);

        const createCategoryResult = await categoryRepository.createCategory(createCategoryDto);

        expect(CategoryMapper.toDomain).toHaveBeenCalledTimes(1);

        expect(postgresService.query).toHaveBeenCalledWith(
            `
                INSERT INTO categories (name, updated_at)
                VALUES ($1, CURRENT_TIMESTAMP)
                RETURNING id, name;
            `,
            [
                createCategoryDto.name
            ]
        );
        expect(postgresService.query).toHaveBeenCalledTimes(1);
        expect(createCategoryResult).toEqual(mockedCreateCategoryResult);
    });

    it("Should get the category 'Mobile Phones'", async () => {
        const mockedQueryResult: QueryResult = {
            command: "INSERT",
            rowCount: 3,
            oid: null,
            fields: [{
                name: 'id',
                tableID: 16600,
                columnID: 1,
                dataTypeID: 23,
                dataTypeSize: 4,
                dataTypeModifier: -1,
                format: 'text'
            },
            {
                name: 'name',
                tableID: 16600,
                columnID: 2,
                dataTypeID: 25,
                dataTypeSize: -1,
                dataTypeModifier: -1,
                format: 'text'
            }],
            rows: [
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
                }
            ],
        };
        const mockedGetCategoryResult = {
            id: 1,
            name: "Mobile phones"
        };
        const categoryId = 1;

        postgresService.query.mockResolvedValue(mockedQueryResult);

        const createCategoryResult = await categoryRepository.getCategory(categoryId);

        expect(CategoryMapper.toDomain).toHaveBeenCalledTimes(1);
        expect(postgresService.query).toHaveBeenCalledTimes(1);
        expect(postgresService.query).toHaveBeenCalledWith(
            `
                SELECT id, name
                FROM categories
                WHERE id = $1;
            `,
            [1]
        );
        expect(createCategoryResult).toEqual(mockedGetCategoryResult);
    });

    it("Should delete the category 'Mobile Phones'", async () => {
        const mockedQueryResult: QueryResult = {
            command: "INSERT",
            rowCount: 3,
            oid: null,
            fields: [{
                name: 'id',
                tableID: 16600,
                columnID: 1,
                dataTypeID: 23,
                dataTypeSize: 4,
                dataTypeModifier: -1,
                format: 'text'
            },
            {
                name: 'name',
                tableID: 16600,
                columnID: 2,
                dataTypeID: 25,
                dataTypeSize: -1,
                dataTypeModifier: -1,
                format: 'text'
            }],
            rows: [
                {
                    id: 1,
                    name: "Mobile phones"
                }
            ]
        };
        const mockedGetCategoryResult = {
            id: 1,
            name: "Mobile phones"
        };
        const categoryId = 1;

        postgresService.query.mockResolvedValue(mockedQueryResult);

        const createCategoryResult = await categoryRepository.deleteCategory(categoryId);

        expect(CategoryMapper.toDomain).toHaveBeenCalledTimes(1);
        expect(postgresService.query).toHaveBeenCalledTimes(1);
        expect(postgresService.query).toHaveBeenCalledWith(
            `
                DELETE FROM categories
                WHERE id = $1
                RETURNING id, name;
            `,
            [1]
        );
        expect(createCategoryResult).toEqual(mockedGetCategoryResult);
    });

    it("Should get first three categories", async () => {
        const mockedQueryResult: QueryResult = {
            command: "SELECT",
            rowCount: 3,
            oid: null,
            fields: [{
                name: 'id',
                tableID: 16600,
                columnID: 1,
                dataTypeID: 23,
                dataTypeSize: 4,
                dataTypeModifier: -1,
                format: 'text'
            },
            {
                name: 'name',
                tableID: 16600,
                columnID: 2,
                dataTypeID: 25,
                dataTypeSize: -1,
                dataTypeModifier: -1,
                format: 'text'
            }],
            rows: [
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
                }
            ],
        };
        const mockedDeleteCategoryResult = [
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
            }
        ]
        const page = 1;
        const size = 3;

        postgresService.query.mockResolvedValue(mockedQueryResult);

        const createCategoryResult = await categoryRepository.getAllCategories(page, size);

        expect(CategoryMapper.toDomain).toHaveBeenCalledTimes(3);
        expect(postgresService.query).toHaveBeenCalledTimes(1);
        expect(postgresService.query).toHaveBeenCalledWith(
            `
                SELECT id, name
                FROM categories
                LIMIT $1
                OFFSET $2;
            `,
            [size, (page - 1) * size]
        );
        expect(createCategoryResult).toEqual(mockedDeleteCategoryResult);
    });
});