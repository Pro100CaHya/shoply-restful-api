import { availableParallelism } from "node:os";

import { PostgresService } from "./postgres";
import { Server } from "./server";
import { Cluster } from "./cluster";
import { config } from "dotenv";
import { UserController, UserRepository, UserService } from "./user";
import { CategoryController, CategoryRepository, CategoryService } from "./category";
import { GoodController, GoodRepository, GoodService } from "./good";
import { AuthService } from "./auth/auth.service";
import { AuthController } from "./auth/auth.controller";
import { UserSessionRepository } from "./user-session";

config();

const {
    POSTGRES_USER,
    POSTGRES_DB,
    POSTGRES_PASSWORD,
    POSTGRES_PORT,
    POSTGRES_HOST,
    SERVER_PORT
} = process.env;

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

const categoryRepository = new CategoryRepository(postgresService);
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);

const goodRepository = new GoodRepository(postgresService);
const goodService = new GoodService(goodRepository, categoryService);
const goodController = new GoodController(goodService);

const userSessionRepository = new UserSessionRepository(postgresService);

const authService = new AuthService(userService, userSessionRepository);
const authController = new AuthController(authService);

const server = new Server(
    parseInt(SERVER_PORT),
    [
        categoryController,
        goodController,
        userController,
        authController
    ]
);

const cluster = new Cluster(
    server,
    availableParallelism()
);

cluster.initializeClusters();