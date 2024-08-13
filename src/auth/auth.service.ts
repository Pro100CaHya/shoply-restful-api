import jwt, { verify } from "jsonwebtoken";

import { UserService } from "src/user";
import { LoginDto } from "./dto";
import { RegisterDto } from "./dto/register.dto";
import { compareSync, hashSync } from "bcrypt";
import { InvalidEmailOrPassword, InvalidRefreshToken } from "./exceptions";
import { JwtPayload } from "src/interfaces";
import { UserSessionRepository } from "src/user-session";
import { UserWithEmailAlreadyExists } from "src/user/exceptions";
import { CreateUserDto } from "src/user/dto";
import { USER_ROLE } from "src/user/user.interface";
import { CreateUserSessionDto } from "src/user-session/dto";

class AuthService {
    constructor(
        private userService: UserService,
        private userSessionRepository: UserSessionRepository
    ) { }

    public async login(loginDto: LoginDto, device: string) {
        const userCandidate = await this.userService.getUserByEmail(loginDto.email);

        if (!userCandidate) {
            throw new InvalidEmailOrPassword();
        }

        const isPasswordCorrect = compareSync(loginDto.password, userCandidate.password);

        if (!isPasswordCorrect) {
            throw new InvalidEmailOrPassword();
        }

        const existedSession = await this.userSessionRepository.getUserSessionByDeviceAndUserId(device, userCandidate.id);

        if (existedSession) {
            await this.userSessionRepository.deleteSessionById(existedSession.id);
        }

        const jwtPayload = {
            device,
            user: {
                id: userCandidate.id,
                role: userCandidate.role
            }
        };

        const accessToken = this.generateAccessToken(jwtPayload);
        const refreshToken = this.generateRefreshToken(jwtPayload);

        await this.userSessionRepository.createUserSession({
            device,
            refreshToken: refreshToken.token,
            userId: userCandidate.id
        });

        return {
            access: accessToken,
            refresh: refreshToken
        }
    }

    public async register(registerDto: RegisterDto, device: string) {
        const userCandidate = await this.userService.getUserByEmail(registerDto.email);

        if (userCandidate) {
            throw new UserWithEmailAlreadyExists(registerDto.email);
        }

        const createUserDto: CreateUserDto = {
            email: registerDto.email,
            password: registerDto.password,
            role: USER_ROLE.CUSTOMER
        }

        const registeredUser = await this.userService.createUser(createUserDto);

        const accessToken = this.generateAccessToken({
            device,
            user: {
                id: registeredUser.id,
                role: registeredUser.role
            }
        }, "10m");

        const refreshToken = this.generateRefreshToken({
            device,
            user: {
                id: registeredUser.id,
                role: registeredUser.role
            }
        }, "5s");

        const createUserSessionDto: CreateUserSessionDto = {
            device,
            refreshToken: refreshToken.token,
            userId: registeredUser.id
        }

        await this.userSessionRepository.createUserSession(createUserSessionDto);

        return {
            access: accessToken,
            refresh: refreshToken
        }
    }

    public async getNewTokensByRefreshToken(refreshToken: string, device: string) {
        const existedSession = await this.userSessionRepository.getUserSessionByRefreshToken(refreshToken);

        if (!existedSession) {
            throw new InvalidRefreshToken();
        }

        if (existedSession.device !== device) {
            throw new InvalidRefreshToken();
        }

        try {
            await this.userSessionRepository.deleteSessionById(existedSession.id);

            const verificationResponse = verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET);

            const { user: { id: userId, role: userRole } } = verificationResponse as JwtPayload;

            const newAccessToken = this.generateAccessToken({
                device,
                user: {
                    id: userId,
                    role: userRole
                }
            });

            const newRefreshToken = this.generateRefreshToken({
                device,
                user: {
                    id: userId,
                    role: userRole
                }
            });

            console.log("refresh:", newRefreshToken)

            const createUserSessionDto: CreateUserSessionDto = {
                device,
                userId,
                refreshToken
            }

            await this.userSessionRepository.createUserSession(createUserSessionDto);

            return {
                access: newAccessToken,
                refresh: newRefreshToken
            }
        } catch (error) {
            throw new InvalidRefreshToken();
        }
    }

    private generateAccessToken(payload: JwtPayload, expiresIn: string = "10m") {
        return {
            token: jwt.sign(
                payload,
                process.env.JWT_ACCESS_TOKEN_SECRET,
                {
                    expiresIn
                }
            ),
            expiresIn
        }
    }

    private generateRefreshToken(payload: JwtPayload, expiresIn: string = "1h") {
        return {
            token: jwt.sign(
                payload,
                process.env.JWT_REFRESH_TOKEN_SECRET,
                {
                    expiresIn
                }
            ),
            expiresIn
        }
    }
}

export {
    AuthService
}