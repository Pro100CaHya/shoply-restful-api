import { USER_ROLE } from "src/user/user.interface";

export interface JwtPayload {
    device: string;
    user: {
        id: number;
        role: USER_ROLE
    }
}