import { availableParallelism } from "node:os";

import { PostgresService } from "./postgres";
import { Server } from "./server";
import { Cluster } from "./cluster";
import { config } from "dotenv";
import { UserController, UserRepository, UserService } from "./user";

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

const server = new Server(
    parseInt(SERVER_PORT),
    [
        userController
    ]
);

const cluster = new Cluster(
    server,
    availableParallelism()
);

cluster.initializeClusters();