import { UserSession } from "./user-session.interface"

class UserSessionMapper {
    static toDomain(raw: any): UserSession {
        return {
            id: raw.id,
            device: raw.string,
            refreshToken: raw.string,
            userId: raw.userId
        }
    }
}

export {
    UserSessionMapper
}