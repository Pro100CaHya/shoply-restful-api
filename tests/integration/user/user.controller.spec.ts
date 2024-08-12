import request from "supertest";

import { User, USER_ROLE } from "src/user/user.interface";
import { config } from "dotenv";
import { PostgresService } from "src/postgres";
import { Server } from "src/server";
import { UserController, UserRepository, UserService } from "src/user";
import { CreateUserDto } from "src/user/dto";
import { HttpBodyResponse } from "src/interfaces";

config();

describe("Integration Test User Controller", () => {
    let postgresService: PostgresService;
    let userRepository: UserRepository;
    let userService: UserService;
    let userController: UserController;
    let server: Server;

    const createUserTest = async (createUserDto: CreateUserDto, expectedUser: Omit<User, "password">) => {
        const createUserResponse = await request(server.getAppInstance())
            .post(`/api/users`)
            .send(
                createUserDto
            );

        const createUserResponseBody: HttpBodyResponse = createUserResponse.body;

        const createdUser = createUserResponseBody.data?.[0];

        expect(createUserResponse.status).toBe(201);
        expect(createdUser.email).toEqual(expectedUser.email);
        expect(createdUser.role).toEqual(USER_ROLE.CUSTOMER);
    }

    beforeAll(async () => {
        postgresService = new PostgresService(
            process.env.POSTGRES_USER,
            process.env.POSTGRES_HOST,
            process.env.POSTGRES_DB,
            process.env.POSTGRES_PASSWORD,
            parseInt(process.env.POSTGRES_PORT)
        );
        userRepository = new UserRepository(postgresService);
        userService = new UserService(userRepository);
        userController = new UserController(userService);
        server = new Server(3003, [
            userController
        ]);

        server.startServer();

        await postgresService.query(
            `
                DELETE FROM users;
                ALTER SEQUENCE users_id_seq RESTART WITH 1;
            `
        );
    });

    afterAll(async () => {
        await postgresService.query(
            `
                DELETE FROM users;
                ALTER SEQUENCE users_id_seq RESTART WITH 1;
            `
        );
    });

    it("should create user with email 'vanya@gmail.com'", async () => {
        const createUserDto: CreateUserDto = {
            email: "vasya@gmail.com",
            password: "12345678",
            role: USER_ROLE.CUSTOMER
        }

        const expectedCreatedUser: Omit<User, "password"> = {
            id: 1,
            email: "vasya@gmail.com",
            role: USER_ROLE.CUSTOMER
        }

        await createUserTest(createUserDto, expectedCreatedUser);
    });

    it("should create user with email 'sanya@gmail.com'", async () => {
        const createUserDto: CreateUserDto = {
            email: "sanya@gmail.com",
            password: "12345678",
            role: USER_ROLE.CUSTOMER
        }

        const expectedCreatedUser: Omit<User, "password"> = {
            id: 2,
            email: "sanya@gmail.com",
            role: USER_ROLE.CUSTOMER
        }

        await createUserTest(createUserDto, expectedCreatedUser);
    });
});