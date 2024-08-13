import { UserSession } from "./user-session.interface"

class UserSessionMapper {
    static toDomain(raw: any): UserSession {
        return {
            id: raw.id,
            device: raw.device,
            refreshToken: raw.refresh_token,
            userId: raw.user_id
        }
    }
}

export {
    UserSessionMapper
}