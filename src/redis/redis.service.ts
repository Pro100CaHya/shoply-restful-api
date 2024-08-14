import { createClient, RedisClientType } from "redis";

class RedisService {
    private client: RedisClientType;

    constructor(url: string) {
        this.client = createClient({
            url
        });

        this.client.on("error", (err) => console.log(err));
    }

    public async connect() {
        await this.client.connect();
    }

    public async close() {
        await this.client.disconnect();
    }

    public async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    public async set(key: string, value: string): Promise<void> {
        await this.client.set(key, value);
    }

    public async delete(key: string): Promise<void> {
        await this.client.del(key);
    }
}

export {
    RedisService
}