import { PostgresService } from "src/postgres";
import { CreateUserSessionDto } from "./dto";
import { UserSessionMapper } from "./user-session.mapper";
import { UserSession } from "./user-session.interface";

class UserSessionRepository {
    constructor(private postgresService: PostgresService) {}

    public async createUserSession(createUserSessionDto: CreateUserSessionDto): Promise<UserSession> {
        const {
            device,
            refreshToken,
            userId
        } = createUserSessionDto;

        const queryResult = await this.postgresService.query(
            `
                INSERT INTO user_sessions (device, refresh_token, user_id, updated_at)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
                RETURNING id, device, refresh_token, user_id
            `,
            [
                device, refreshToken, userId
            ]
        );

        return UserSessionMapper.toDomain(queryResult.rows[0]);
    }

    public async getUserSessionByRefreshToken(refreshToken: string): Promise<UserSession> {
        const queryResult = await this.postgresService.query(
            `
                SELECT id, device, refresh_token, user_id
                FROM user_sessions
                WHERE refresh_token = $1;
            `,
            [
                refreshToken
            ]
        );

        if (queryResult.rowCount === 0) {
            return null;
        }
        
        return UserSessionMapper.toDomain(queryResult.rows[0]);
    }

    public async getUserSessionByDeviceAndUserId(device: string, userId: number): Promise<UserSession> {
        const queryResult = await this.postgresService.query(
            `
                SELECT id, device, refresh_token,user_id
                FROM user_sessions
                WHERE device = $1
                    AND user_id = $2
            `,
            [
                device, userId
            ]
        );

        if (queryResult.rowCount === 0) {
            return null;
        }

        return UserSessionMapper.toDomain(queryResult.rows[0]);
    }

    public async deleteSessionById(id: number) {
        const queryResult = await this.postgresService.query(
            `
                DELETE FROM user_sessions
                WHERE id = $1
                RETURNING id, device, refresh_token, user_id;
            `,
            [
                id
            ]
        );

        return UserSessionMapper.toDomain(queryResult.rows[0]);
    }
}

export {
    UserSessionRepository
}