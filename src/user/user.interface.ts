export interface User {
    id: number;
    email: string;
    password: string;
    role: USER_ROLE
}

export enum USER_ROLE {
    CUSTOMER = "CUSTOMER",
    ADMIN = "ADMIN"
}