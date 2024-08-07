import { availableParallelism } from "node:os";

import { PostgresService } from "./postgres";
import { Server } from "./server";
import { Cluster } from "./cluster";
import { config } from "dotenv";
import { UserController, UserRepository, UserService } from "./user";
import { CategoryController, CategoryRepository, CategoryService } from "./category";
import { GoodController, GoodRepository, GoodService } from "./good";

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

const server = new Server(
    parseInt(SERVER_PORT),
    [
        categoryController,
        goodController,
        userController,
    ]
);

const cluster = new Cluster(
    server,
    availableParallelism()
);

cluster.initializeClusters();