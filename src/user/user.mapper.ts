import { User } from "./user.interface";

class UserMapper {
    static toDomain(raw: any): User {
        return {
            id: raw.id,
            email: raw.email,
            password: raw.password,
            role: raw.role
        }
    }
}

export {
    UserMapper
}