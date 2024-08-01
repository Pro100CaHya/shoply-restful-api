import { PostgresService } from "./postgres";
import { Server } from "./server";
import { config } from "dotenv";
import { UserController, UserRepository, UserService } from "./user";

config();

const {
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_HOST,
    PORT
} = process.env

const postgresService = new PostgresService(
    POSTGRES_USER,
    POSTGRES_HOST,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
    parseInt(POSTGRES_PORT)
);

const userRepository = new UserRepository(postgresService);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

const server = new Server(
    parseInt(PORT),
    [
        userController
    ]
);