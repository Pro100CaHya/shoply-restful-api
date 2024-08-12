import { PostgresService } from "src/postgres"
import { CreateUserDto, UpdateUserDto } from "./dto"
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

    public async getAllUsers(page: number, size: number): Promise<User[]> {
        const queryResult = await this.postgresService.query(
            `
                SELECT id, email, password, role
                FROM users
                ORDER BY id
                LIMIT $1
                OFFSET $2;
            `,
            [
                size,
                (page - 1) * size
            ]
        );

        return queryResult.rows.map((row) => UserMapper.toDomain(row));
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

    public async getUserByEmail(email: string) {
        const queryResult = await this.postgresService.query(
            `
                SELECT id, email, password, role
                FROM users
                WHERE email = $1;
            `,
            [
                email
            ]
        );

        if (queryResult.rowCount === 0) {
            return null;
        }

        return UserMapper.toDomain(queryResult.rows[0]);
    }

    public async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const setClauses: Array<string> = [];
        const values: Array<string | number> = [];

        Object.entries(updateUserDto).forEach(([key, value], index) => {
            setClauses.push(`${key} = $${index + 1}`);
            values.push(value);
        });

        const queryResult = await this.postgresService.query(
            `
                UPDATE users
                SET ${setClauses.join(", ")}
                WHERE id = $${values.length + 1}
                RETURNING id, email, password, role;
            `,
            [
                ...values,
                id
            ]
        );

        return UserMapper.toDomain(queryResult.rows[0]);
    }

    public async deleteUser(id: number): Promise<User> {
        const queryResult = await this.postgresService.query(
            `
                DELETE FROM users
                WHERE id = $1
                RETURNING id, email, password, role;
            `,
            [
                id
            ]
        );

        return UserMapper.toDomain(queryResult.rows[0]);
    }
}

export {
    UserRepository
}