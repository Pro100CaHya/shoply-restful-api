import { PostgresService } from "src/postgres";
import { CreateGoodDto, UpdateGoodDto } from "./dto";
import { GoodMapper } from "./good.mapper";
import { Good } from "./good.interface";

class GoodRepository {
    constructor(private postgresService: PostgresService) {}

    public async createGood(createGoodDto: CreateGoodDto): Promise<Good> {
        const {
            name,
            price,
            categoryId
        } = createGoodDto;

        const queryResult = await this.postgresService.query(
            `
                WITH inserted_goods AS (
                    INSERT INTO goods (name, price, category_id, updated_at)
                    VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                    RETURNING id, name, price, category_id
                )
                SELECT
                    g.id AS id,
                    g.name AS name,
                    g.price AS price,
                    json_build_object('id', c.id, 'name', c.name) AS category
                FROM
                    inserted_goods g
                JOIN
                    categories c ON g.category_id = c.id;
            `,
            [
                name,
                price,
                categoryId
            ]
        );

        return GoodMapper.toDomain(queryResult.rows[0]);
    }

    public async getGoodById(id: number): Promise<Good> {
        const queryResult = await this.postgresService.query(
            `
                SELECT
                    g.id AS id,
                    g.name AS name,
                    g.price AS price,
                    json_build_object('id', c.id, 'name', c.name) AS category
                FROM
                    goods g
                JOIN
                    categories c ON g.category_id = c.id
                WHERE
                    c.id = $1;
            `,
            [
                id
            ]
        );

        return GoodMapper.toDomain(queryResult.rows[0]);
    }

    public async getAllGoods(page: number = 1, size: number = 10): Promise<Good[]> {
        const queryResult = await this.postgresService.query(
            `
                SELECT
                    g.id AS id,
                    g.name AS name,
                    g.price AS price,
                    json_build_object('id', c.id, 'name', c.name) AS category
                FROM
                    goods g
                JOIN
                    categories c ON g.category_id = c.id
                ORDER BY g.id
                LIMIT $1
                OFFSET $2;
            `,
            [
                size,
                (page - 1) * size
            ]
        )

        return queryResult.rows.map((row) => GoodMapper.toDomain(row));
    }

    public async updateGood(id: number, updateGoodDto: UpdateGoodDto): Promise<Good> {
        const setClauses: Array<string> = [];
        const values: Array<string | number> = [];

        Object.entries(updateGoodDto).forEach(([key, value], index) => {
            setClauses.push(`${key} = $${index + 1}`);
            values.push(value);
        })

        const queryResult = await this.postgresService.query(
            `
                WITH updated_good AS (
                    UPDATE goods
                    SET ${setClauses.join(", ")}
                    WHERE id = $${values.length + 1}
                    RETURNING id, name, price, category_id
                )
                    SELECT
                        g.id AS id,
                        g.name AS name,
                        g.price AS price,
                        json_build_object('id', c.id, 'name', c.name) AS category
                    FROM
                        updated_good g
                    JOIN
                        categories c ON g.category_id = c.id;
            `,
            [
                ...values,
                id
            ]
        )

        return GoodMapper.toDomain(queryResult.rows[0]);
    }
}

export {
    GoodRepository
}