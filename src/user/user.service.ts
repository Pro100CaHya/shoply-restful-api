import { UserRepository } from "./user.repository";

class UserService {
    constructor(private userRepository: UserRepository) {}
}

export {
    UserService
}