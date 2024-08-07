import { PostgresService } from "src/postgres";
import { CreateGoodDto } from "./dto/create-good.dto";
import { GoodMapper } from "./good.mapper";

class GoodRepository {
    constructor(private postgresService: PostgresService) {}

    public async createGood(createGoodDto: CreateGoodDto): Promise<any> {
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
}

export {
    GoodRepository
}