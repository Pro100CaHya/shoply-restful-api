import { PostgresService } from "src/postgres"
import { CreateUserDto } from "./dto"
import { UserMapper } from "./user.mapper";
import { User } from "./user.interface";

class UserRepository {
    constructor(private postgresService: PostgresService) {}

    public async createUser(createUserDto: CreateUserDto): Promise<User> {
        const {
            email,
            password,
            role
        } = createUserDto;

        const queryResult = await this.postgresService.query(
            `
                INSERT INTO users (email, password, role, updated_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                RETURNING id, email, password, role;
            `,
            [
                email,
                password,
                role
            ]
        );

        return UserMapper.toDomain(queryResult.rows[0]);
    }

    public async getUserById(id: number): Promise<User> {
        const queryResult = await this.postgresService.query(
            `
                SELECT id, email, password, role
                FROM users
                WHERE id = $1;
            `,
            [
                id
            ]
        );

        if (queryResult.rowCount === 0) {
            return null;
        }

        return UserMapper.toDomain(queryResult.rows[0]);
    }
}

export {
    UserRepository
}