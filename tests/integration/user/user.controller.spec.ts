import request from "supertest";

import { User, USER_ROLE } from "src/user/user.interface";
import { config } from "dotenv";
import { PostgresService } from "src/postgres";
import { Server } from "src/server";
import { UserController, UserRepository, UserService } from "src/user";
import { CreateUserDto, UpdateUserDto } from "src/user/dto";
import { HttpBodyResponse } from "src/interfaces";

config();

describe("Integration Test User Controller", () => {
    let postgresService: PostgresService;
    let userRepository: UserRepository;
    let userService: UserService;
    let userController: UserController;
    let server: Server;

    const createUserTest = async (createUserDto: CreateUserDto, expectedUser: Omit<User, "password">, expectedStatusCode = 201) => {
        const createUserResponse = await request(server.getAppInstance())
            .post(`/api/users`)
            .send(
                createUserDto
            );

        const createUserResponseBody: HttpBodyResponse = createUserResponse.body;

        const createdUser = createUserResponseBody.data?.[0] ?? null;

        expect(createUserResponse.status).toBe(expectedStatusCode);

        if (expectedStatusCode === 201) {
            expect(createdUser.email).toEqual(expectedUser.email);
            expect(createdUser.role).toEqual(USER_ROLE.CUSTOMER);
        } else {
            expect(createdUser).toEqual(null);
        }
    }

    const getUserByIdTest = async (id: number, expectedUser: Omit<User, "password">, expectedStatusCode = 200) => {
        const getUserByIdResponse = await request(server.getAppInstance())
            .get(`/api/users/${id}`)
            .send();

        const getUserByIdResponseBody: HttpBodyResponse = getUserByIdResponse.body;

        const foundUser: User = getUserByIdResponseBody.data?.[0] ?? null;
        expect(getUserByIdResponse.status).toBe(expectedStatusCode);

        if (foundUser) {
            delete foundUser.password;

        }

        expect(foundUser).toEqual(expectedUser);
    }

    const updateUserTest = async (id: number, updateUserDto: UpdateUserDto, expectedUser: Omit<User, "password">, expectedStatusCode = 200) => {
        const updateUserResponse = await request(server.getAppInstance())
            .patch(`/api/users/${id}`)
            .send(updateUserDto);

        const updateUserResponseBody: HttpBodyResponse = updateUserResponse.body;

        const foundUser: User = updateUserResponseBody.data?.[0] ?? null;
        expect(updateUserResponse.status).toBe(expectedStatusCode);

        if (foundUser) {
            delete foundUser.password;

        }

        expect(foundUser).toEqual(expectedUser);
    }

    const deleteUserTest = async (id: number, expectedUser: Omit<User, "password">, expectedStatusCode = 200) => {
        const deleteUserResponse = await request(server.getAppInstance())
            .delete(`/api/users/${id}`)
            .send();

        const deleteUserResponseBody: HttpBodyResponse = deleteUserResponse.body;

        const foundUser: User = deleteUserResponseBody.data?.[0] ?? null;
        expect(deleteUserResponse.status).toBe(expectedStatusCode);

        if (foundUser) {
            delete foundUser.password;
        }

        expect(foundUser).toEqual(expectedUser);
    }

    const getAllUsersTest = async (page: number, size: number, expectedUsers: Omit<User, "password">[], expectedStatusCode = 200) => {
        const getAllUsersResponse = await request(server.getAppInstance())
            .get(`/api/users`)
            .query({
                page,
                size
            })
            .send();

        const getAllUsersResponseBody: HttpBodyResponse = getAllUsersResponse.body;

        const foundUsers: User[] = getAllUsersResponseBody.data;
        expect(getAllUsersResponse.status).toBe(expectedStatusCode);

        if (foundUsers) {
            const usersWithourPassword = foundUsers.map((user) => {
                delete user.password;
                return user;
            });

            expect(usersWithourPassword).toEqual(expectedUsers);
        } else {
            expect(foundUsers).toEqual(expectedUsers);
        }
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
        // await postgresService.query(
        //     `
        //         DELETE FROM users;
        //         ALTER SEQUENCE users_id_seq RESTART WITH 1;
        //     `
        // );
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

    it("should create user with email 'banya@gmail.com'", async () => {
        const createUserDto: CreateUserDto = {
            email: "banya@gmail.com",
            password: "12345678",
            role: USER_ROLE.CUSTOMER
        }

        const expectedCreatedUser: Omit<User, "password"> = {
            id: 2,
            email: "banya@gmail.com",
            role: USER_ROLE.CUSTOMER
        }

        await createUserTest(createUserDto, expectedCreatedUser);

        await postgresService.query(
            `SELECT id, email, role
            FROM users;`
        )
    });

    it("should get user with email 'sanya@gmail.com'", async () => {
        const userId = 2;

        const expectedGetUserByIdUser: Omit<User, "password"> = {
            id: 2,
            email: "sanya@gmail.com",
            role: USER_ROLE.CUSTOMER
        }

        await getUserByIdTest(userId, expectedGetUserByIdUser);

        await postgresService.query(
            `SELECT id, email, role
            FROM users;`
        )
    });

    it("should not get user with email 'bnnya@gmail.com' and get 'not found'", async () => {
        const userId = 4;

        const expectedGetUserByIdUser: Omit<User, "password"> = null;

        await getUserByIdTest(userId, expectedGetUserByIdUser, 404);
    });

    it("should not create user with email 'banya@gmail.com' because it already exists", async () => {
        const createUserDto: CreateUserDto = {
            email: "banya@gmail.com",
            password: "12345678",
            role: USER_ROLE.CUSTOMER
        }

        const expectedCreatedUser: Omit<User, "password"> = null;

        await createUserTest(createUserDto, expectedCreatedUser, 400);
    });

    it("should update user with email 'sanya@gmail.com'", async () => {
        const userId = 2;
        const updateUserDto: UpdateUserDto = {
            email: "manya@gmail.com",
            role: USER_ROLE.ADMIN
        }

        const expectedCreatedUser: Omit<User, "password"> = {
            id: 2,
            email: "manya@gmail.com",
            role: USER_ROLE.ADMIN
        };

        await updateUserTest(userId, updateUserDto, expectedCreatedUser);
    });

    it("should not update user because user not found", async () => {
        const userId = 5;
        const updateUserDto: UpdateUserDto = {
            email: "manya@gmail.com",
            role: USER_ROLE.ADMIN
        }

        const expectedCreatedUser: Omit<User, "password"> = null;

        await updateUserTest(userId, updateUserDto, expectedCreatedUser, 404);
    });

    it("should not update user because user with suggested email already exists", async () => {
        const userId = 3;
        const updateUserDto: UpdateUserDto = {
            email: "manya@gmail.com",
            role: USER_ROLE.ADMIN
        }

        const expectedCreatedUser: Omit<User, "password"> = null;

        await updateUserTest(userId, updateUserDto, expectedCreatedUser, 400);
    });

    it("should get first two users", async () => {
        const page = 1;
        const size = 2;

        const getAllUsers: Omit<User, "password">[] = [
            {
                id: 1,
                email: "vasya@gmail.com",
                role: USER_ROLE.CUSTOMER
            },
            {
                id: 2,
                email: "manya@gmail.com",
                role: USER_ROLE.ADMIN
            }
        ]

        await getAllUsersTest(page, size, getAllUsers);
    });

    it("should delete user with email 'manya@gmail.com' and id = 2", async () => {
        const userId = 2;

        const expectedDeletedUser: Omit<User, "password"> = {
            id: 2,
            email: "manya@gmail.com",
            role: USER_ROLE.ADMIN
        };

        await deleteUserTest(userId, expectedDeletedUser);
    });

    it("should not delete user with id = 5 because user not exists", async () => {
        const userId = 6;

        const expectedDeletedUser: Omit<User, "password"> = null

        await deleteUserTest(userId, expectedDeletedUser, 404);
    });
});