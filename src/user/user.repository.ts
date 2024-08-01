import { PostgresService } from "src/postgres"

class UserRepository {
    constructor(private postgresService: PostgresService) {}
}

export {
    UserRepository
}