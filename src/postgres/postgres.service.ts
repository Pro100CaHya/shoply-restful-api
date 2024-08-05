import { Pool, PoolClient } from "pg";

class PostgresService {
    private pool: Pool

    constructor(user: string, host: string, database: string, password: string, port: number) {
        this.pool = new Pool({
            user,
            host,
            database,
            password,
            port
        });
    }

    public async connect() {
        await this.pool.connect();
    }

    public async close() {
        await this.pool.end();
    }

    public async query(text: string, params?: any[]) {
        return this.pool.query(text, params);
    }
}

export {
    PostgresService
}