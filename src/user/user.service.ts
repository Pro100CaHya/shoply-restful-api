import { hashSync } from "bcrypt";

import { CreateUserDto, UpdateUserDto } from "./dto";
import { UserNotFoundException, UserWithEmailAlreadyExists } from "./exceptions";
import { UserRepository } from "./user.repository";

class UserService {
    constructor(private userRepository: UserRepository) {}

    public async createUser(createUserDto: CreateUserDto) {
        const user = await this.userRepository.getUserByEmail(createUserDto.email);

        if (user) {
            throw new UserWithEmailAlreadyExists(createUserDto.email);
        }

        const hashedPassword = hashSync(createUserDto.password, 5);

        return await this.userRepository.createUser({...createUserDto, password: hashedPassword});
    }

    public async getUserById(id: number) {
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw new UserNotFoundException(id);
        }

        return await this.userRepository.getUserById(id);
    }

    public async getAllUsers(page: number, size: number) {
        return await this.userRepository.getAllUsers(page, size);
    }

    public async updateUser(id: number, updateUserDto: UpdateUserDto) {
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw new UserNotFoundException(id);
        }

        return await this.userRepository.updateUser(id, updateUserDto);
    }

    public async deleteUser(id: number) {
        const user = await this.userRepository.getUserById(id);

        if (!user) {
            throw new UserNotFoundException(id);
        }

        return await this.userRepository.deleteUser(id);
    }
}

export {
    UserService
}